#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const RELEASE = '1.0.70';
export const ARM64_SHA256 = '5c8a688251bf61e35370b828b6a353b0a20fcc3f64000de8a91d426039f29cec';
export const BINARY_SHA256_BY_ARCH = Object.freeze({arm64: ARM64_SHA256, x64: 'd9ecd462f1f3c3b40a7a131944987ee7ed1c38069b7009cc4107398ab767f484'});
const hash = x => crypto.createHash('sha256').update(x).digest('hex');
const json = x => JSON.stringify(x, null, 2) + '\n';

export function parseArgs(argv) {
  const o={};
  const flags=new Set(['preflight','explain']);
  const values=new Set(['agent','prompt','prompt-file','cwd','output-dir','grok-model','grok-effort','resume']);
  for (let i=0;i<argv.length;i++) {
    const [raw,...tail]=argv[i].split('='); const key=raw.replace(/^--/,'');
    if (!argv[i].startsWith('--') || (!flags.has(key)&&!values.has(key))) throw new Error(`Unsupported Grok option: ${raw}`);
    if (Object.hasOwn(o,key)) throw new Error(`Duplicate option: ${raw}`);
    if (flags.has(key)) {if(tail.length)throw new Error(`Unexpected value: ${raw}`);o[key]=true;continue;}
    const val=tail.length?tail.join('='):argv[++i];
    if (!val || val.startsWith('--')) throw new Error(`Missing value: ${raw}`);
    o[key]=val;
  }
  if(o.agent && o.agent!=='grok')throw new Error('This wrapper serves Grok only');
  if(o.prompt && o['prompt-file'])throw new Error('Use one prompt input');
  if(o.resume && !/^[0-9a-f-]{36}$/i.test(o.resume))throw new Error('Resume requires an exact session UUID');
  return o;
}

export function consumerEnvironment(input=process.env) {
  // Do not allow a stale provider key, custom endpoint or auth provider to
  // silently move this consumer-subscription call onto another billing route.
  const env={...input};
  for(const k of Object.keys(env))if(/^(?:GROK_|XAI_)/.test(k))delete env[k];
  const dedicated=path.join(os.homedir(),'.grok-build-agent');
  env.GROK_HOME=input.GROK_HOME ? path.resolve(input.GROK_HOME) : fs.existsSync(path.join(dedicated,'auth.json')) ? dedicated : path.join(os.homedir(),'.grok');
  env.GROK_DISABLE_AUTOUPDATER='1';
  return env;
}

export function checkConfigText(text, label) {
  // Parse TOML rather than matching spelling: dotted keys, quoted tables and
  // inline tables must not evade the consumer-auth boundary. Values stay local.
  const code=`import sys,tomllib,json\nx=tomllib.loads(sys.stdin.read())\npaths=[]\ndef walk(v,p=[]):\n if isinstance(v,dict):\n  for k,w in v.items():\n   q=p+[k]; paths.append(q); walk(w,q)\n elif isinstance(v,list):\n  for w in v: walk(w,p)\nwalk(x)\nprint(json.dumps(paths))`;
  const r=spawnSync(process.env.STARTER_KIT_PYTHON || 'python3',['-c',code],{input:text,encoding:'utf8',maxBuffer:4*1024*1024});
  if(r.error||r.status!==0)throw new Error(`Cannot parse Grok configuration safely (requires Python 3.11+): ${label}`);
  const paths=JSON.parse(r.stdout);
  const authKeys=new Set(['api_key','env_key','auth_provider_command','base_url','proxy_url','deployment_key','oauth2','oidc','grok_ws_url','grok_ws_origin']);
  if(paths.some(parts=>parts.some(k=>authKeys.has(k)) ||
      (parts.length>1 && ['auth','grok_com_config','model','models','endpoints','managed','deployment'].includes(parts[0]))))
    throw new Error(`Custom auth/model/endpoint configuration requires review: ${label}`);
}

export function summarizeEvents(events, exitCode) {
  const ends=events.filter(e=>e.type==='end');
  const errors=events.filter(e=>e.type==='error');
  const end=ends.length===1?ends[0]:null;
  const text=events.filter(e=>e.type==='text').map(e=>typeof e.data==='string'?e.data:'').join('');
  const tools=events.filter(e=>['tool_call','tool_call_update'].includes(e.type));
  const successful=exitCode===0 && ends.length===1 && end.stopReason==='end_turn' && !errors.length && !!text.trim();
  return {successful,text,end,errors,tools};
}

export function validatePrompt(prompt) {
  if(!prompt?.trim())throw new Error('A nonempty prompt is required');
  if(/^\s*LOCAL AGENT INSTRUCTIONS\b/im.test(prompt))throw new Error('Local-only instruction sentinel reached the Grok prompt; rebuild the payload before submission');
}

export function telemetryWarnings(end) {
  const warnings=['root served-model identity unavailable; modelUsage is aggregate telemetry including subagents'];
  if(end?.usage_is_incomplete)warnings.push('usage is incomplete; child-drain completion and accounting are not fully verified');
  return warnings;
}

function capture(bin,args,opts) {
  const r=spawnSync(bin,args,{...opts,encoding:'utf8',maxBuffer:16*1024*1024});
  if(r.error || r.status!==0)throw new Error(`Grok preflight ${args[0]} failed: ${r.error?.message||'exit '+r.status}`);
  return r.stdout;
}

export function preflight(cwd,env) {
  const expectedHash=BINARY_SHA256_BY_ARCH[process.arch];
  if(process.platform!=='darwin'||!expectedHash)throw new Error('This host has no verified Grok binary pin; use the official native macOS release, never PATH grok.');
  const candidates=[process.env.GROK_CLI_PATH, path.join(os.homedir(),'.local/share/grok-build',RELEASE,'grok'), ...(process.env.PATH||'').split(path.delimiter).filter(Boolean).map(dir=>path.join(dir,'grok'))].filter(Boolean);
  const bin=candidates.find(file=>{try{return fs.statSync(file).isFile() && hash(fs.readFileSync(file))===expectedHash;}catch{return false;}});
  if(!bin)throw new Error(`Grok unavailable: official macOS Grok Build ${RELEASE} with the reviewed checksum is required. Kit Setup can help; no automatic upgrade or provider fallback.`);
  const auth=path.join(env.GROK_HOME,'auth.json');
  if(!fs.existsSync(auth))throw new Error('Grok not connected: sign into the official CLI with your subscription account, then retry.');
  const st=fs.lstatSync(auth);
  if(!st.isFile()||st.isSymbolicLink()||(st.mode&0o077)!==0||st.uid!==process.getuid())throw new Error('Dedicated local Grok login file must be owner-only and owned by this user');
  const version=capture(bin,['--version'],{cwd,env}).trim();
  if(!version.startsWith(`grok ${RELEASE} `))throw new Error('Unexpected Grok version');
  const inspection=JSON.parse(capture(bin,['inspect','--json'],{cwd,env}));
  if(!Array.isArray(inspection.configSources?.layers))throw new Error('Unknown config-inspection schema');
  const checked=[];
  for(const layer of inspection.configSources.layers){
    if(typeof layer.path!=='string')throw new Error('Uninspectable configuration layer');
    if(!fs.existsSync(layer.path)){checked.push({path:layer.path,present:false});continue;}
    const bytes=fs.readFileSync(layer.path);
    checkConfigText(bytes.toString('utf8'),layer.path);
    checked.push({path:layer.path,present:true,sha256:hash(bytes)});
  }
  return {bin,version,binary_sha256:expectedHash,binary_architecture:process.arch,auth_source:'dedicated consumer OAuth login; token contents unread',config_layers:checked,inspection};
}

async function main() {
  const o=parseArgs(process.argv.slice(2));
  const cwd=path.resolve(o.cwd||process.cwd());
  const env=consumerEnvironment();
  const p=preflight(cwd,env);
  const model=o['grok-model']||'grok-4.7';
  const effort=o['grok-effort']||'xhigh';
  if(o.preflight||o.explain){console.log(json({state:'ready_local_preflight',...p,requested_model:model,requested_effort:effort,model_prompt_submitted:false,billing:'consumer route; pool entitlement/remaining usage not established by local preflight'}));return;}
  if(!o['output-dir'])throw new Error('--output-dir is required and must be a new directory');
  const prompt=o['prompt-file']?fs.readFileSync(path.resolve(o['prompt-file']),'utf8'):o.prompt;
  validatePrompt(prompt);
  const out=path.resolve(o['output-dir']);fs.mkdirSync(out,{recursive:false,mode:0o700});
  const save=(name,body)=>fs.writeFileSync(path.join(out,name),body,{flag:'wx',mode:0o600});
  const id=crypto.randomUUID();
  save('prompt.md',prompt);save('inspection.json',json(p.inspection));
  const scope='Perform only the supplied user task. Use original files explicitly supplied/named for that task; do not gather unrelated private correspondence, project notes or other session history. Do not read/export credentials or human-subject data. Analyze and report only; do not modify project files or initiate another provider, council, external message, account change or destructive action. These task boundaries preserve normal authorized file/web tools and your own genuinely useful subagents; they impose no research/resource ceiling. Apply substantive project instructions without expanding the requested task.';
  const args=['--prompt-file',path.join(out,'prompt.md'),'--cwd',cwd,'--model',model,'--reasoning-effort',effort,'--output-format','streaming-json','--permission-mode','auto','--rules',scope];
  if(o.resume)args.push('--resume',o.resume);else args.push('--session-id',id);
  const receipt={schema_version:1,provider:'grok',route:'official-grok-build-consumer',requested_model:model,requested_effort:effort,observed_models:[],binary:p.bin,binary_sha256:p.binary_sha256,version:p.version,auth_source:p.auth_source,config_layers:p.config_layers,cwd,session_id:o.resume||id,continuation:!!o.resume,started_at:new Date().toISOString(),state:'starting',submission:'unknown',billing:'consumer OAuth route; inference-cost metadata is not proof of separate billing or included-pool deduction',no_automatic_fallback:true};
  save('EXECUTION.json',json(receipt));
  const raw=fs.createWriteStream(path.join(out,'raw.jsonl'),{flags:'wx',mode:0o600});
  const err=fs.createWriteStream(path.join(out,'stderr.txt'),{flags:'wx',mode:0o600});
  const child=spawn(p.bin,args,{cwd,env,detached:true,stdio:['ignore','pipe','pipe']});
  child.stdout.pipe(raw);child.stderr.pipe(err);
  let spawnError=null;child.on('error',e=>{spawnError=e.message;});
  const forward=sig=>{if(child.pid){try{process.kill(-child.pid,sig);}catch(e){if(e.code!=='ESRCH')throw e;}}};
  const onInt=()=>forward('SIGINT'),onTerm=()=>forward('SIGTERM');
  process.on('SIGINT',onInt);process.on('SIGTERM',onTerm);
  const terminal=await new Promise(resolve=>child.on('close',(code,signal)=>resolve({code,signal})));
  process.off('SIGINT',onInt);process.off('SIGTERM',onTerm);
  await Promise.all([raw,err].map(s=>s.writableFinished?Promise.resolve():new Promise((resolve,reject)=>{s.once('finish',resolve);s.once('error',reject);})));
  const bytes=fs.readFileSync(path.join(out,'raw.jsonl'));
  const events=[];let malformed=0;
  for(const line of bytes.toString('utf8').split(/\r?\n/)){if(!line.trim())continue;try{events.push(JSON.parse(line));}catch{malformed++;}}
  const r=summarizeEvents(events,terminal.code);
  const observed=Object.keys(r.end?.modelUsage||{});
  // modelUsage aggregates root and nested calls. It cannot prove root identity.
  const warnings=telemetryWarnings(r.end);
  if(malformed)warnings.push('unparsed stdout lines retained');
  if(/WARN|ERROR/i.test(fs.readFileSync(path.join(out,'stderr.txt'),'utf8')))warnings.push('runtime diagnostics in stderr; inspect relevant warnings');
  if(r.text.trim())save('report.md',r.text+'\n');
  const state=r.successful&&!spawnError&&!malformed?(warnings.length?'succeeded_with_warnings':'succeeded'):(r.text.trim()?'available_with_failure':'failed');
  Object.assign(receipt,{state,submission:r.end?'completed_run':events.length?'observed_output':'unknown',observed_models:observed,model_observation_scope:'aggregate_root_and_subagent_usage; not root-served-model proof',root_served_model:null,finished_at:new Date().toISOString(),exit_code:terminal.code,signal:terminal.signal,spawn_error:spawnError,session_id:r.end?.sessionId||receipt.session_id,usage:r.end?.usage||null,model_usage:r.end?.modelUsage||null,reported_inference_cost_usd:r.end?.total_cost_usd??null,usage_is_incomplete:r.end?.usage_is_incomplete??null,warnings,errors:r.errors,tool_events:r.tools,raw_sha256:hash(bytes),available_report:r.text.trim()?path.join(out,'report.md'):null,report_sha256:r.text.trim()?hash(r.text+'\n'):null});
  save('result.json',json(receipt));
  console.log(json({state,output_dir:out,result:path.join(out,'result.json'),report:receipt.available_report,session_id:receipt.session_id,warnings}));
  if(!state.startsWith('succeeded'))process.exitCode=1;
}

// Resolve both paths: Dropbox may be a directory alias on the other Mac.
if(process.argv[1]&&fs.existsSync(process.argv[1])&&fs.realpathSync(fileURLToPath(import.meta.url))===fs.realpathSync(process.argv[1])){main().catch(e=>{console.error(json({state:'blocked',error:e.message,fallback:'none'}));process.exitCode=1;});}
