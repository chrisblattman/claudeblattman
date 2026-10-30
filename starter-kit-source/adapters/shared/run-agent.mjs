#!/usr/bin/env node
// Shared transport for both host apps. No shell interpolation, retries, or model substitutions.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const providers=['claude','codex','gemini','grok'];
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
export function parseArgs(argv) {
  const o={};
  const flags=new Set(['preflight','smoke-test']);
  const values=new Set(['agent','prompt-file','cwd','output-dir','model','effort']);
  for(let i=0;i<argv.length;i++) {
    const [raw,...tail]=argv[i].split('='); const key=raw.replace(/^--/,'');
    if(!argv[i].startsWith('--') || (!flags.has(key)&&!values.has(key)) || Object.hasOwn(o,key)) throw new Error(`Unknown or duplicate option: ${raw}`);
    if(flags.has(key)){if(tail.length)throw new Error(`Unexpected value: ${raw}`);o[key]=true;continue;}
    const value=tail.length?tail.join('='):argv[++i];
    if(!value || value.startsWith('--'))throw new Error(`Missing value: ${raw}`);
    o[key]=value;
  }
  if(!providers.includes(o.agent))throw new Error('Specify one --agent: claude, codex, gemini, or grok. Use separate runs for multiple agents.');
  if(o['smoke-test']&&o['prompt-file'])throw new Error('Smoke tests cannot include project prompts.');
  return o;
}
export function discover(agent, env=process.env) {
  const name={claude:'claude',codex:'codex',gemini:'agy'}[agent];
  const explicit=env[{claude:'CLAUDE_CLI_PATH',codex:'CODEX_CLI_PATH',gemini:'ANTIGRAVITY_CLI_PATH'}[agent]];
  const candidates=explicit?[explicit]:(env.PATH||'').split(path.delimiter).filter(Boolean).map(d=>path.join(d,name));
  if(agent==='codex'&&!explicit)candidates.push('/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex',path.join(os.homedir(),'Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex'),'/Applications/Codex.app/Contents/Resources/codex');
  for(const file of candidates){try{fs.accessSync(file,fs.constants.X_OK);if(fs.statSync(file).isFile())return path.resolve(file);}catch{}}
  throw new Error(`${agent} not connected: ${name} executable unavailable. Install/sign in using Kit Setup or the provider's own setup. No fallback was attempted.`);
}
export function command(agent,o,out,task) {
  let args;
  if(agent==='claude')args=['--print','--output-format','stream-json','--verbose','--permission-mode','plan','--permission-prompts','none'];
  if(agent==='codex')args=['exec','--sandbox','read-only','--skip-git-repo-check','--json','--output-last-message',path.join(out,'codex-final.txt')];
  if(agent==='gemini') {
    if(typeof task!=='string'||!task.trim())throw new Error('Antigravity requires a nonempty task for --print.');
    args=['--print',task,'--output-format','stream-json','--mode','plan','--print-timeout','2562047h47m16s'];
  }
  if(o.model)args.push('--model',o.model);
  if(o.effort){
    if(agent==='codex')args.push('-c',`model_reasoning_effort=${JSON.stringify(o.effort)}`);
    else args.push('--effort',o.effort);
  }
  if(agent==='codex')args.push('-');
  return args;
}
export function parseOutput(agent, raw, finalText='') {
  const events=[];let malformed=0;
  for(const line of raw.split(/\r?\n/)){if(!line.trim())continue;try{events.push(JSON.parse(line));}catch{malformed++;}}
  let text='',ok=false,session=null,model=null,errors=[];
  if(agent==='claude') {
    const results=events.filter(e=>e.type==='result');const end=results.at(-1);
    const messages=events.filter(e=>e.type==='assistant'&&!e.parent_tool_use_id).flatMap(e=>(e.message?.content||[]).filter(c=>c.type==='text').map(c=>c.text));
    text=messages.join('\n\n');
    if(end?.result && !messages.includes(end.result))text+=(text?'\n\n':'')+end.result;
    ok=results.length===1&&end.subtype==='success'&&!end.is_error;
    session=end?.session_id||null;
    model=events.find(e=>e.type==='system'&&e.subtype==='init')?.model||null;
    errors=events.filter(e=>e.type==='error'||e.is_error);
  } else if(agent==='gemini') {
    const results=events.filter(e=>e.event==='result').map(e=>e.result);const end=results.at(-1);
    text=end?.response||events.filter(e=>e.event==='step_update'&&e.step_update?.step_type==='agent_response').map(e=>e.step_update.text_delta||'').join('');
    ok=results.length===1&&end?.status==='SUCCESS'&&!end.error;
    session=end?.conversation_id||null;model=end?.model||null;
    errors=events.filter(e=>e.event==='error');if(end?.error)errors.push(end.error);
  } else {
    text=events.filter(e=>e.type==='item.completed'&&e.item?.type==='agent_message').map(e=>e.item.text||'').join('\n\n');
    if(finalText.trim()&&!text.includes(finalText.trim()))text+=(text?'\n\n':'')+finalText;
    ok=events.filter(e=>e.type==='turn.completed').length===1;
    errors=events.filter(e=>['error','turn.failed'].includes(e.type));
    session=events.find(e=>e.type==='thread.started')?.thread_id||null;
  }
  return {text,ok:ok&&!errors.length&&!malformed,session,model,errors,malformed};
}
async function execute(bin,args,{cwd,env,input,out}) {
  // Stream to private files rather than truncating a report at an output limit.
  const stdout=fs.createWriteStream(path.join(out,'raw.jsonl'),{flags:'wx',mode:0o600});
  const stderr=fs.createWriteStream(path.join(out,'stderr.txt'),{flags:'wx',mode:0o600});
  const streamsDone=Promise.all([stdout,stderr].map(s=>new Promise((resolve,reject)=>{s.once('finish',resolve);s.once('error',reject);})));
  const child=spawn(bin,args,{cwd,env,stdio:['pipe','pipe','pipe'],detached:process.platform!=='win32'});
  child.stdout.pipe(stdout);child.stderr.pipe(stderr);
  let error=null;child.on('error',e=>{error=e.message;});
  child.stdin.on('error',e=>{if(e.code!=='EPIPE')error=e.message;});
  child.stdin.end(input);
  const forward=sig=>{try{process.platform==='win32'?child.kill(sig):process.kill(-child.pid,sig);}catch(e){if(e.code!=='ESRCH')error=e.message;}};
  const onInt=()=>forward('SIGINT'),onTerm=()=>forward('SIGTERM');
  process.on('SIGINT',onInt);process.on('SIGTERM',onTerm);
  const terminal=await new Promise(resolve=>child.on('close',(code,signal)=>resolve({code,signal})));
  process.off('SIGINT',onInt);process.off('SIGTERM',onTerm);
  await streamsDone;
  return {...terminal,error};
}
async function main() {
  const o=parseArgs(process.argv.slice(2));
  let cwd=path.resolve(o.cwd||process.cwd());
  if(o['smoke-test'])cwd=fs.mkdtempSync(path.join(os.tmpdir(),'starter-kit-smoke-'));
  if(!fs.statSync(cwd).isDirectory())throw new Error('cwd must be a real project directory');
  if(o.agent==='grok') {
    const args=[path.join(HERE,'grok-agent-run.mjs'),'--agent','grok','--cwd',cwd];
    if(o.preflight)args.push('--preflight');
    else {
      if(!o['output-dir'])throw new Error('--output-dir is required');
      args.push('--output-dir',path.resolve(o['output-dir']));
      if(o['smoke-test'])args.push('--prompt','Reply with exactly: starter-kit-ok');
      else if(o['prompt-file'])args.push('--prompt-file',path.resolve(o['prompt-file']));
      else throw new Error('--prompt-file is required');
    }
    if(o.model)args.push('--grok-model',o.model);
    if(o.effort)args.push('--grok-effort',o.effort);
    const child=spawn(process.execPath,args,{stdio:'inherit',env:process.env});
    child.on('error',e=>{console.error(JSON.stringify({state:'blocked',error:e.message}));process.exitCode=1;});
    const onInt=()=>child.kill('SIGINT'),onTerm=()=>child.kill('SIGTERM');
    process.on('SIGINT',onInt);process.on('SIGTERM',onTerm);
    const code=await new Promise(resolve=>child.on('close',resolve));
    process.off('SIGINT',onInt);process.off('SIGTERM',onTerm);
    process.exitCode=code??1;
    if(o['smoke-test'] && !o.preflight && code===0){
      const result=JSON.parse(fs.readFileSync(path.join(path.resolve(o['output-dir']),'result.json'),'utf8'));
      const ok=result.state.startsWith('succeeded') && result.available_report && fs.readFileSync(result.available_report,'utf8').trim()==='starter-kit-ok';
      console.log(JSON.stringify({smoke_test:!!ok,provider:'grok',result:path.join(path.resolve(o['output-dir']),'result.json')}));
      if(!ok)process.exitCode=1;
    }
    return;
  }
  const bin=discover(o.agent);
  const version=spawnSync(bin,['--version'],{cwd,encoding:'utf8',timeout:15000});
  if(version.error||version.status!==0)throw new Error(`${o.agent} version check failed; no prompt sent.`);
  if(o.preflight){console.log(JSON.stringify({state:'detected',agent:o.agent,executable:bin,version:version.stdout.trim(),authentication:'unverified; run an authorized smoke test',model_prompt_submitted:false}));return;}
  if(!o['output-dir'])throw new Error('--output-dir must name a new private directory');
  if(!o['smoke-test']&&!o['prompt-file'])throw new Error('--prompt-file is required');
  const prompt=o['smoke-test']?'Reply with exactly: starter-kit-ok':fs.readFileSync(path.resolve(o['prompt-file']),'utf8');
  if(!prompt.trim())throw new Error('Prompt must not be empty');
  const out=path.resolve(o['output-dir']);fs.mkdirSync(out,{mode:0o700});
  const save=(name,data)=>fs.writeFileSync(path.join(out,name),data,{flag:'wx',mode:0o600});
  const scope='Analyze and report on this task only. Do not edit project files, send external messages, change accounts, or run another provider/panel. Use only task-relevant authorized evidence; never read credentials. State any missing access.\n\n';
  save('prompt.md',prompt);
  const args=command(o.agent,o,out,scope+prompt);
  const receipt={schema_version:1,provider:o.agent,route:o.agent==='gemini'?'antigravity':o.agent,executable:bin,version:version.stdout.trim(),requested_model:o.model||'account default',requested_effort:o.effort||'account default',cwd,started_at:new Date().toISOString(),no_automatic_fallback:true,permission_profile:'analysis; host/provider permissions apply',state:'starting'};
  save('EXECUTION.json',JSON.stringify(receipt,null,2)+'\n');
  const env={...process.env};delete env.GEMINI_CLI_TRUST_WORKSPACE;
  const execution=await execute(bin,args,{cwd,env,input:o.agent==='gemini'?'':scope+prompt,out});
  const raw=fs.readFileSync(path.join(out,'raw.jsonl'),'utf8');
  const final=path.join(out,'codex-final.txt');
  const parsed=parseOutput(o.agent,raw,fs.existsSync(final)?fs.readFileSync(final,'utf8'):'');
  const mismatch=o.model&&parsed.model&&parsed.model!==o.model;
  const success=execution.code===0&&!execution.error&&parsed.ok&&!mismatch&&!!parsed.text.trim();
  const report=parsed.text.trim()?path.join(out,'report.md'):null;
  if(report)save('report.md',parsed.text+'\n');
  const result={...receipt,state:success?'succeeded':report?'available_with_failure':'failed',finished_at:new Date().toISOString(),exit_code:execution.code,signal:execution.signal,spawn_error:execution.error,session_id:parsed.session,observed_model:parsed.model,model_mismatch:!!mismatch,model_verification:parsed.model?'provider-reported':'unavailable',errors:parsed.errors,unparsed_lines:parsed.malformed,available_report:report,report,report_sha256:report?hash(parsed.text+'\n'):null,raw_sha256:hash(raw),smoke_test:o['smoke-test']?success&&parsed.text.trim()==='starter-kit-ok':null};
  save('result.json',JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({...result,result:path.join(out,'result.json')},null,2));
  if(!success||(o['smoke-test']&&!result.smoke_test))process.exitCode=1;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(JSON.stringify({state:'blocked',error:e.message,fallback:'none'}));process.exitCode=1;});
