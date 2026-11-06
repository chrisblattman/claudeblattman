// Offline protocol and subprocess tests. Fake CLIs never contact a provider.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {parseArgs,command,parseOutput,discover} from '../starter-kit-source/adapters/shared/run-agent.mjs';
import {consumerEnvironment,parseArgs as grokArgs,summarizeEvents,checkConfigText,telemetryWarnings} from '../starter-kit-source/adapters/shared/grok-agent-run.mjs';
import {setupInfo,grokCandidates,inspectCandidates,selectedHome,authMetadata,selectPython,probeVersion} from '../starter-kit-source/adapters/shared/grok-agent-run.mjs';
import {installPinned,loginInvocation} from '../starter-kit-source/adapters/shared/grok-setup.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const runner=path.join(root,'starter-kit-source/adapters/shared/run-agent.mjs');
const lines=(...events)=>events.map(e=>JSON.stringify(e)).join('\n');

test('unknown provider/duplicate options are errors',()=>{
 assert.throws(()=>parseArgs(['--agent','both']));
 assert.throws(()=>parseArgs(['--agent','grok','--agent','claude']));
 assert.throws(()=>parseArgs(['--agent','claude','--smoke-test','--prompt-file','private.md']));
 assert.throws(()=>grokArgs(['--agent','grok','--max-budget','5']));
});
test('requested model and effort survive without fallback or permission bypass',()=>{
 for(const p of ['claude','codex','gemini']){
  const args=command(p,{model:'exact-model',effort:'high'},'/tmp/fixture','Fixture task');
  assert.ok(args.includes('exact-model'));assert.ok(!args.some(a=>/fallback|skip-permissions|bypassPermissions/.test(a)));
 }
 const gemini=command('gemini',{},'/tmp','Fixture task');
 assert.ok(!gemini.includes('--mode'),'Antigravity must inherit the saved execution mode');
 assert.ok(!gemini.includes('--settings'),'the runner must not override personal settings');
 assert.ok(command('codex',{},'/tmp').includes('read-only'));
});
test('discovery does not require a kit registry and never uses Gemini CLI',()=>{
 const d=fs.mkdtempSync(path.join(os.tmpdir(),'kit-discovery-'));
 try{
  fs.writeFileSync(path.join(d,'gemini'),'#!/bin/sh\nexit 0\n',{mode:0o700});
  assert.throws(()=>discover('gemini',{PATH:d}),/agy executable unavailable/);
  fs.writeFileSync(path.join(d,'agy'),'#!/bin/sh\nexit 0\n',{mode:0o700});
  assert.equal(discover('gemini',{PATH:d}),path.join(d,'agy'));
 }finally{fs.rmSync(d,{recursive:true});}
});
test('Claude retains original responses and rejects an error terminal event',()=>{
 const raw=lines({type:'system',subtype:'init',model:'model-a'},{type:'assistant',message:{content:[{type:'text',text:'Original analysis'}]}},{type:'result',subtype:'error_max_turns',result:'Partial conclusion',session_id:'a'});
 const result=parseOutput('claude',raw);assert.equal(result.ok,false);assert.match(result.text,/Original analysis/);assert.match(result.text,/Partial conclusion/);assert.equal(result.model,'model-a');
});
test('Claude success is terminal and nonduplicated',()=>{
 const result=parseOutput('claude',lines({type:'assistant',message:{content:[{type:'text',text:'Answer'}]}},{type:'result',subtype:'success',result:'Answer',session_id:'a'}));
 assert.equal(result.ok,true);assert.equal(result.text,'Answer');
 assert.equal(parseOutput('claude',lines({type:'assistant',message:{content:[{type:'text',text:'No final event'}]}})).ok,false);
});
test('Antigravity response is read from its result envelope',()=>{
 const result=parseOutput('gemini',lines({event:'result',result:{status:'SUCCESS',response:'Full answer',conversation_id:'g'}}));
 assert.equal(result.ok,true);assert.equal(result.text,'Full answer');assert.equal(result.session,'g');
 const partial=parseOutput('gemini',lines({event:'step_update',step_update:{step_type:'agent_response',text_delta:'Partial'}}));
 assert.equal(partial.ok,false);assert.equal(partial.text,'Partial');
});
test('malformed streams and provider errors never become success',()=>{
 assert.equal(parseOutput('gemini','not json\n'+lines({event:'result',result:{status:'SUCCESS',response:'answer'}})).ok,false);
 assert.equal(parseOutput('codex',lines({type:'turn.completed'},{type:'error',message:'auth'}),'answer').ok,false);
});
test('Codex output and session are retained without fabricated model identity',()=>{
 const result=parseOutput('codex',lines({type:'thread.started',thread_id:'c'},{type:'item.completed',item:{type:'agent_message',text:'Answer'}},{type:'turn.completed'}),'Answer');
 assert.equal(result.ok,true);assert.equal(result.text,'Answer');assert.equal(result.model,null);assert.equal(result.session,'c');
});
test('Grok strips API environment and retains only selected consumer home',()=>{
 const env=consumerEnvironment({XAI_API_KEY:'<fixture>',GROK_API_KEY:'fixture',GROK_HOME:'/tmp/consumer-fixture',PATH:'/bin'});
 assert.equal(env.XAI_API_KEY,undefined);assert.equal(env.GROK_API_KEY,undefined);assert.equal(env.GROK_HOME,'/tmp/consumer-fixture');assert.equal(env.PATH,'/bin');
});
test('Grok success and partial content distinguish telemetry from billing',()=>{
 const result=summarizeEvents([{type:'text',data:'Answer'},{type:'end',stopReason:'end_turn',modelUsage:{any:{}}}],0);
 assert.equal(result.successful,true);assert.equal(result.text,'Answer');assert.ok(telemetryWarnings(result.end).some(x=>x.includes('unavailable')));
 assert.equal(summarizeEvents([{type:'text',data:'Partial'},{type:'error',data:'Failure'}],1).text,'Partial');
 assert.equal(summarizeEvents([{type:'text',data:'Partial'}],0).successful,false);
});
test('Grok TOML guard rejects dotted, quoted and inline alternate billing routes',()=>{
 // CI supplies Python >=3.11. Local maintainers may select the same interpreter.
 for(const text of ['api_key="fixture"','["model"]\nname="custom"','auth={env_key="FAKE_KEY"}','other.base_url="https://example.com"'])assert.throws(()=>checkConfigText(text,'fixture'));
 checkConfigText('theme="dark"\n[cli]\nauto_update=false\n','fixture');
});

const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const fixtureDir=()=>fs.mkdtempSync(path.join(os.tmpdir(),'kit-grok-'));
test('Grok discovery distinguishes unusable files and supports official symlinks',()=>{
 const dir=fixtureDir();
 try{
  const good=path.join(dir,'good'),wrong=path.join(dir,'wrong'),noexec=path.join(dir,'noexec');
  const link=path.join(dir,'link'),broken=path.join(dir,'broken'),unreadable=path.join(dir,'unreadable');
  const bytes='#!/bin/sh\nexit 99\n';
  fs.writeFileSync(good,bytes,{mode:0o700});fs.writeFileSync(wrong,'other',{mode:0o700});
  fs.writeFileSync(noexec,bytes,{mode:0o600});fs.symlinkSync(good,link);fs.symlinkSync(path.join(dir,'missing'),broken);
  fs.writeFileSync(unreadable,bytes,{mode:0o000});
  const paths=[path.join(dir,'absent'),dir,wrong,noexec,good,link,broken];
  assert.deepEqual(inspectCandidates(paths,digest(bytes)).map(c=>c.status),
    ['absent','not_regular_file','checksum_mismatch','not_executable','verified','verified','unreadable']);
  if(process.getuid()!==0)assert.equal(inspectCandidates([unreadable],digest(bytes))[0].status,'unreadable');
  assert.equal(inspectCandidates([link],digest(bytes))[0].realpath,fs.realpathSync(good));
  assert.ok(grokCandidates({PATH:dir},dir).includes(path.join(dir,'.grok/bin/grok')));
  assert.deepEqual(grokCandidates({GROK_CLI_PATH:wrong,PATH:dir},dir),[wrong]);
  assert.equal(setupInfo(dir,'x64','darwin').official_url,'https://x.ai/cli/grok-1.0.70-macos-x86_64.gz');
  assert.throws(()=>setupInfo(dir,'arm64','linux'),e=>e.stage==='platform');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('Grok public preflight and setup login never execute a wrong-hash override',()=>{
 const dir=fixtureDir();
 try{
  const bin=path.join(dir,'grok'),marker=path.join(dir,'executed');
  fs.writeFileSync(bin,'#!'+process.execPath+'\nrequire("node:fs").writeFileSync('+JSON.stringify(marker)+',"executed");\n',{mode:0o700});
  const env={...process.env,HOME:dir,GROK_HOME:path.join(dir,'home'),GROK_CLI_PATH:bin};
  for(const args of [
   [runner,'--agent','grok','--preflight','--cwd',dir],
   [path.join(root,'starter-kit-source/adapters/shared/grok-setup.mjs'),'login']
  ]){
   const r=spawnSync(process.execPath,args,{env,cwd:dir,encoding:'utf8'});
   assert.notEqual(r.status,0);
   const info=JSON.parse(r.stderr);
   assert.equal(info.state,'blocked');assert.equal(info.fallback,'none');assert.equal(info.model_prompt_submitted,false);
   assert.equal(info.stage,process.platform==='darwin'?'binary':'platform');
   if(info.candidates){assert.equal(info.candidates.length,1);assert.equal(info.candidates[0].status,'checksum_mismatch');}
  }
  assert.equal(fs.existsSync(marker),false);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('Grok Python discovery uses isolated capability checks and preserves explicit overrides',()=>{
 const calls=[];
 const probe=(exe,args)=>{
  calls.push(exe);assert.equal(args[0],'-I');
  const version=exe==='old'?[3,9,6]:[3,13,1];
  return {status:0,stdout:JSON.stringify({version,executable:'/fixture/'+exe,tomllib:exe==='good'})};
 };
 const selected=selectPython({PATH:''},['old','no-tomllib','good'],probe);
 assert.equal(selected.executable,'/fixture/good');assert.deepEqual(calls,['old','no-tomllib','good']);
 calls.length=0;
 const explicit=selectPython({STARTER_KIT_PYTHON:'old'},['good'],probe);
 assert.equal(explicit.status,'unavailable');assert.deepEqual(calls,['old']);assert.equal(explicit.source,'STARTER_KIT_PYTHON');
 const absent=selectPython({STARTER_KIT_PYTHON:'/not/a/python'},[],()=>({error:{code:'ENOENT'}}));
 assert.equal(absent.attempts[0].reason,'ENOENT');assert.equal(absent.status,'unavailable');
});
test('Grok TOML parsing isolates project modules and distinguishes invalid/private config',()=>{
 const python=selectPython();
 assert.equal(python.status,'ready','A real Python 3.11+ with tomllib is required for this test.');
 const dir=fixtureDir();
 try{
  const marker=path.join(dir,'imported');
  fs.writeFileSync(path.join(dir,'tomllib.py'),'open('+JSON.stringify(marker)+',"w").write("bad")\nraise Exception("shadowed")\n');
  const moduleURL=new URL('../starter-kit-source/adapters/shared/grok-agent-run.mjs',import.meta.url).href;
  const code='import {checkConfigText} from '+JSON.stringify(moduleURL)+'; checkConfigText(\'theme="dark"\',"fixture");';
  const r=spawnSync(process.execPath,['--input-type=module','-e',code],{cwd:dir,encoding:'utf8',env:{...process.env,STARTER_KIT_PYTHON:python.executable,PYTHONPATH:dir}});
  assert.equal(r.status,0,r.stderr);assert.equal(fs.existsSync(marker),false);
  assert.throws(()=>checkConfigText('token="DO_NOT_ECHO"\n[','fixture',python),e=>e.stage==='config_invalid'&&!e.message.includes('DO_NOT_ECHO'));
  assert.throws(()=>checkConfigText('auth={env_key="DO_NOT_ECHO"}','fixture',python),e=>e.stage==='config_policy'&&!e.message.includes('DO_NOT_ECHO'));
  assert.throws(()=>checkConfigText('','fixture',{status:'unavailable',remedy:'missing interpreter'}),e=>e.stage==='python');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('Grok home precedence, login arguments and metadata preserve credential boundaries',()=>{
 const dir=fixtureDir();
 try{
  const dedicated=path.join(dir,'.grok-build-agent');fs.mkdirSync(dedicated);
  assert.equal(selectedHome({},dir).source,'standard_home');
  const auth=path.join(dedicated,'auth.json');fs.writeFileSync(auth,'synthetic fixture',{mode:0o600});
  assert.equal(selectedHome({},dir).source,'existing_dedicated_login');
  assert.equal(selectedHome({GROK_HOME:path.join(dir,'explicit')},dir).source,'GROK_HOME');
  assert.equal(authMetadata(dedicated).status,'present_owner_only');
  fs.chmodSync(auth,0o644);assert.equal(authMetadata(dedicated).status,'unsafe_metadata');
  fs.unlinkSync(auth);fs.symlinkSync(path.join(dir,'absent'),auth);assert.equal(authMetadata(dedicated).status,'unsafe_metadata');
  const invocation=loginInvocation('/verified/grok',{GROK_HOME:dedicated,GROK_API_KEY:'fixture',XAI_API_KEY:'fixture',GROK_BASE_URL:'fixture',PATH:'/bin'},true,dir);
  assert.deepEqual(invocation.args,['login','--device-auth']);assert.equal(invocation.options.stdio,'inherit');
  assert.equal(invocation.options.env.GROK_HOME,dedicated);assert.equal(invocation.options.env.GROK_DISABLE_AUTOUPDATER,'1');
  assert.equal(invocation.options.env.GROK_API_KEY,undefined);assert.equal(invocation.options.env.XAI_API_KEY,undefined);assert.equal(invocation.options.env.GROK_BASE_URL,undefined);
  assert.deepEqual(loginInvocation('/verified/grok',{},false).args,['login','--oauth']);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('Grok install verifies before executable publication and is idempotent',async()=>{
 const dir=fixtureDir(),bytes=Buffer.from('fixture binary');
 const setup={install_target:path.join(dir,'version/grok'),official_url:'https://example.invalid/fixture.gz',expected_sha256:digest(bytes)};
 let downloads=0;
 try{
  const download=async(url,file)=>{downloads++;assert.equal(url,setup.official_url);assert.equal(fs.existsSync(setup.install_target),false);fs.writeFileSync(file,bytes,{mode:0o600});};
  assert.equal((await installPinned(setup,download)).state,'installed');
  assert.equal(fs.statSync(setup.install_target).mode&0o777,0o700);
  assert.equal((await installPinned(setup,download)).state,'already_installed');assert.equal(downloads,1);
  assert.deepEqual(fs.readdirSync(path.dirname(setup.install_target)),['grok']);
  fs.writeFileSync(setup.install_target,'existing different bytes');
  await assert.rejects(installPinned(setup,download),e=>e.stage==='install_conflict');assert.equal(downloads,1);
  assert.equal(fs.readFileSync(setup.install_target,'utf8'),'existing different bytes');
  fs.unlinkSync(setup.install_target);const other=path.join(dir,'other');fs.writeFileSync(other,bytes,{mode:0o700});
  fs.symlinkSync(other,setup.install_target);await assert.rejects(installPinned(setup,download),e=>e.stage==='install_conflict');
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('Grok install cleans failed/aborted downloads and cannot clobber a racing destination',async()=>{
 const dir=fixtureDir(),bytes=Buffer.from('fixture binary');
 const target=path.join(dir,'grok'),setup={install_target:target,official_url:'https://example.invalid/fixture.gz',expected_sha256:digest(bytes)};
 try{
  await assert.rejects(installPinned(setup,async(url,file)=>fs.writeFileSync(file,'wrong',{mode:0o600})),e=>e.stage==='checksum');
  assert.deepEqual(fs.readdirSync(dir),[]);
  await assert.rejects(installPinned(setup,async(url,file)=>{fs.writeFileSync(file,'partial');throw new Error('interrupted');}),/interrupted/);
  assert.deepEqual(fs.readdirSync(dir),[]);
  const controller=new AbortController();
  await assert.rejects(installPinned(setup,async(url,file)=>{fs.writeFileSync(file,bytes);controller.abort();},controller.signal));
  assert.deepEqual(fs.readdirSync(dir),[]);
  await assert.rejects(installPinned(setup,async(url,file)=>{
   fs.writeFileSync(file,bytes,{mode:0o600});fs.writeFileSync(target,'other owner');
  }),e=>e.stage==='install_conflict');
  assert.equal(fs.readFileSync(target,'utf8'),'other owner');assert.deepEqual(fs.readdirSync(dir),['grok']);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('Grok version probes expose launch, exit and version failures',()=>{
 const dir=fixtureDir();
 try{
  assert.throws(()=>probeVersion(path.join(dir,'missing'),dir,process.env),e=>e.stage==='version'&&e.message.includes('ENOENT'));
  const bin=path.join(dir,'fixture');
  fs.writeFileSync(bin,'#!/bin/sh\nexit 7\n',{mode:0o700});
  assert.throws(()=>probeVersion(bin,dir,process.env),e=>e.stage==='version'&&e.message.includes('exit 7'));
  fs.writeFileSync(bin,'#!/bin/sh\necho wrong-version\n');
  assert.throws(()=>probeVersion(bin,dir,process.env),e=>e.stage==='version'&&e.message.includes('Unexpected'));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

function fakeRun(agent,output,options={}){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'kit-transport-'));
 try{
  const bin=path.join(dir,'fake-cli');const stdin=path.join(dir,'input.txt');const argsFile=path.join(dir,'args.json');
  fs.writeFileSync(bin,`#!${process.execPath}\nconst fs=require('node:fs');if(process.argv.includes('--version')){console.log('fixture-cli 1.0');process.exit(0);}fs.writeFileSync(${JSON.stringify(argsFile)},JSON.stringify(process.argv.slice(2)));let input='';process.stdin.on('data',x=>input+=x);process.stdin.on('end',()=>{fs.writeFileSync(${JSON.stringify(stdin)},input);console.log(${JSON.stringify(output)});process.exit(${options.exit||0});});`,{mode:0o700});
  const prompt=path.join(dir,'task.md');fs.writeFileSync(prompt,options.prompt??'A neutral fixture task.');
  const out=path.join(dir,'result');
  const env={...process.env,[{claude:'CLAUDE_CLI_PATH',codex:'CODEX_CLI_PATH',gemini:'ANTIGRAVITY_CLI_PATH'}[agent]]:bin};
  const cli=[runner,'--agent',agent,'--output-dir',out,'--cwd',dir,...(options.smoke?['--smoke-test']:['--prompt-file',prompt]),...(options.model?['--model',options.model]:[])];
  const result=spawnSync(process.execPath,cli,{env,encoding:'utf8'});
  const receipt=JSON.parse(fs.readFileSync(path.join(out,'result.json'),'utf8'));
  const report=receipt.report?fs.readFileSync(receipt.report,'utf8'):null;
  const second=spawnSync(process.execPath,cli,{env,encoding:'utf8'});
  assert.notEqual(second.status,0,'old result directory must not be overwritten');
  return {status:result.status,receipt,report,input:fs.readFileSync(stdin,'utf8'),args:JSON.parse(fs.readFileSync(argsFile,'utf8'))};
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
}
test('end-to-end fake Claude CLI retrieves report and immutable receipt',()=>{
 const r=fakeRun('claude',lines({type:'system',subtype:'init',model:'exact'},{type:'result',subtype:'success',result:'Complete response',session_id:'session-a'}),{model:'exact'});
 assert.equal(r.status,0);assert.equal(r.report,'Complete response\n');assert.equal(path.basename(r.receipt.report),'response.md');assert.equal(r.receipt.session_id,'session-a');assert.match(r.input,/neutral fixture/);assert.ok(r.args.includes('plan'));
});
test('end-to-end fake auth failure retains partial substantive output',()=>{
 const r=fakeRun('gemini',lines({event:'result',result:{status:'ERROR',response:'Partial useful finding',error:'authentication required'}}),{exit:1});
 assert.notEqual(r.status,0);assert.equal(r.receipt.state,'available_with_failure');assert.match(r.report,/Partial useful finding/);
});
test('end-to-end smoke tests carry no project context and validate response',()=>{
 const r=fakeRun('gemini',lines({event:'result',result:{status:'SUCCESS',response:'starter-kit-ok',conversation_id:'smoke'}}),{smoke:true});
 const task=r.args[r.args.indexOf('--print')+1];
 assert.equal(r.status,0);assert.equal(r.receipt.smoke_test,true);assert.equal(r.input,'');assert.doesNotMatch(task,/neutral fixture/);assert.match(task,/starter-kit-ok/);
 const wrong=fakeRun('gemini',lines({event:'result',result:{status:'SUCCESS',response:'wrong'}}),{smoke:true});assert.notEqual(wrong.status,0);
});
test('Antigravity receives the same complete task as Claude and Codex, as one literal print argument',()=>{
 const prompt='Review "quoted paths" and Unicode café.\nKeep $(literal), `backticks`, and --flags as text.';
 const gemini=fakeRun('gemini',lines({event:'result',result:{status:'SUCCESS',response:'Complete review'}}),{prompt});
 const claude=fakeRun('claude',lines({type:'result',subtype:'success',result:'Complete review'}),{prompt});
 const codex=fakeRun('codex',lines({type:'item.completed',item:{type:'agent_message',text:'Complete review'}},{type:'turn.completed'}),{prompt});
 const task=gemini.args[gemini.args.indexOf('--print')+1];
 assert.equal(gemini.status,0);assert.equal(claude.status,0);assert.equal(codex.status,0);
 assert.equal(task,claude.input);assert.equal(task,codex.input);assert.ok(task.endsWith(prompt));
 assert.equal(gemini.input,'');assert.ok(!gemini.args.includes('--input-format'));
 assert.equal(gemini.args[gemini.args.indexOf('--output-format')+1],'stream-json');
 assert.ok(!gemini.args.includes('--mode'));
 assert.ok(!gemini.args.includes('--settings'));
 assert.equal(gemini.report,'Complete review\n');
});
test('Antigravity rejects missing print tasks and still rejects empty successful responses',()=>{
 for(const task of [undefined,'','   '])assert.throws(()=>command('gemini',{},'/tmp',task),/nonempty task/);
 const r=fakeRun('gemini',lines({event:'result',result:{status:'SUCCESS',response:'',denied_actions:[{action:'command'}]}}));
 assert.notEqual(r.status,0);assert.equal(r.receipt.state,'failed');assert.equal(r.report,null);
});
test('explicit model mismatch fails despite valid provider success',()=>{
 const r=fakeRun('claude',lines({type:'system',subtype:'init',model:'different'},{type:'result',subtype:'success',result:'Useful content',session_id:'x'}),{model:'exact'});
 assert.notEqual(r.status,0);assert.equal(r.receipt.model_mismatch,true);assert.equal(r.receipt.state,'available_with_failure');
});
