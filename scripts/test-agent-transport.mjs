// Offline protocol and subprocess tests. Fake CLIs never contact a provider.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {parseArgs,command,parseOutput,discover} from '../starter-kit-source/adapters/shared/run-agent.mjs';
import {consumerEnvironment,parseArgs as grokArgs,summarizeEvents,checkConfigText,telemetryWarnings} from '../starter-kit-source/adapters/shared/grok-agent-run.mjs';
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
  const args=command(p,{model:'exact-model',effort:'high'},'/tmp/fixture');
  assert.ok(args.includes('exact-model'));assert.ok(!args.some(a=>/fallback|skip-permissions|bypassPermissions/.test(a)));
 }
 assert.ok(command('gemini',{},'/tmp').includes('plan'));
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
function fakeRun(agent,output,options={}){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'kit-transport-'));
 try{
  const bin=path.join(dir,'fake-cli');const stdin=path.join(dir,'input.txt');const argsFile=path.join(dir,'args.json');
  fs.writeFileSync(bin,`#!${process.execPath}\nconst fs=require('node:fs');if(process.argv.includes('--version')){console.log('fixture-cli 1.0');process.exit(0);}fs.writeFileSync(${JSON.stringify(argsFile)},JSON.stringify(process.argv.slice(2)));let input='';process.stdin.on('data',x=>input+=x);process.stdin.on('end',()=>{fs.writeFileSync(${JSON.stringify(stdin)},input);console.log(${JSON.stringify(output)});process.exit(${options.exit||0});});`,{mode:0o700});
  const prompt=path.join(dir,'task.md');fs.writeFileSync(prompt,'A neutral fixture task.');
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
 assert.equal(r.status,0);assert.equal(r.report,'Complete response\n');assert.equal(r.receipt.session_id,'session-a');assert.match(r.input,/neutral fixture/);assert.ok(r.args.includes('plan'));
});
test('end-to-end fake auth failure retains partial substantive output',()=>{
 const r=fakeRun('gemini',lines({event:'result',result:{status:'ERROR',response:'Partial useful finding',error:'authentication required'}}),{exit:1});
 assert.notEqual(r.status,0);assert.equal(r.receipt.state,'available_with_failure');assert.match(r.report,/Partial useful finding/);
});
test('end-to-end smoke tests carry no project context and validate response',()=>{
 const r=fakeRun('gemini',lines({event:'result',result:{status:'SUCCESS',response:'starter-kit-ok',conversation_id:'smoke'}}),{smoke:true});
 assert.equal(r.status,0);assert.equal(r.receipt.smoke_test,true);assert.doesNotMatch(r.input,/neutral fixture/);assert.match(r.input,/starter-kit-ok/);
 const wrong=fakeRun('gemini',lines({event:'result',result:{status:'SUCCESS',response:'wrong'}}),{smoke:true});assert.notEqual(wrong.status,0);
});
test('explicit model mismatch fails despite valid provider success',()=>{
 const r=fakeRun('claude',lines({type:'system',subtype:'init',model:'different'},{type:'result',subtype:'success',result:'Useful content',session_id:'x'}),{model:'exact'});
 assert.notEqual(r.status,0);assert.equal(r.receipt.model_mismatch,true);assert.equal(r.receipt.state,'available_with_failure');
});
