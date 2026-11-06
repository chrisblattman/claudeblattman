#!/usr/bin/env node
// Explicit, pinned Grok setup. Importing this file performs no setup action.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {Readable,Transform} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import {createGunzip} from 'node:zlib';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {setupInfo,grokCandidates,inspectCandidates,selectedHome,authMetadata,selectPython,consumerEnvironment,probeVersion,blockedError,blockedResult} from './grok-agent-run.mjs';

export function check(input=process.env) {
  const setup=setupInfo();
  const home=selectedHome(input);
  const candidates=inspectCandidates(grokCandidates(input),setup.expected_sha256);
  const python=selectPython(input);
  const auth=authMetadata(home.path);
  const blockers=[];
  if(!candidates.some(c=>c.status==='verified'))blockers.push('binary');
  if(python.status!=='ready')blockers.push('python');
  if(auth.status!=='present_owner_only')blockers.push('auth');
  return {state:blockers.length?'blocked':'metadata_checks_passed',blockers,setup,candidates,python,home,auth,
    grok_executed:false,model_prompt_submitted:false,
    next:'Normal preflight must still check version and configuration; only an authorized smoke test checks an authenticated request.'};
}

async function downloadBinary(url,file,signal) {
  // Only HTTPS redirects are followed. The decompressed binary pin remains
  // authoritative even if the official download redirects to its CDN.
  let response;
  for(let n=0;n<6;n++){
    if(new URL(url).protocol!=='https:')throw new Error('Download must remain HTTPS.');
    response=await fetch(url,{redirect:'manual',signal});
    if([301,302,303,307,308].includes(response.status)){
      const location=response.headers.get('location');
      await response.body?.cancel();
      if(!location)throw new Error('Download redirect has no location.');
      url=new URL(location,url).href;continue;
    }
    break;
  }
  if(!response?.ok||!response.body)throw new Error('Official artifact download failed: HTTP '+response?.status);
  let bytes=0;
  const limit=new Transform({transform(chunk,encoding,done){
    bytes+=chunk.length;
    done(bytes>512*1024*1024?new Error('Artifact exceeds expected size limit.'):null,chunk);
  }});
  await pipeline(Readable.fromWeb(response.body),createGunzip(),limit,
    fs.createWriteStream(file,{flags:'wx',mode:0o600}),{signal});
}

// CLI always supplies setupInfo(), never an environment hash/URL override.
// Injection is only for offline fixture downloads and filesystem tests.
export async function installPinned(setup,download=downloadBinary,signal) {
  const target=setup.install_target;
  let exists=false;try{fs.lstatSync(target);exists=true;}catch(e){if(e.code!=='ENOENT')throw e;}
  if(exists){
    const st=fs.lstatSync(target);
    const result=inspectCandidates([target],setup.expected_sha256)[0];
    if(st.isFile()&&!st.isSymbolicLink()&&result.status==='verified')
      return {state:'already_installed',path:target,sha256:setup.expected_sha256};
    throw blockedError('install_conflict','Install destination already exists and is not the usable pinned regular file; leave it intact and review it.',{path:target});
  }
  fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});
  const temp=fs.mkdtempSync(path.join(path.dirname(target),'.grok-install-'));
  const staged=path.join(temp,'grok');
  try{
    await download(setup.official_url,staged,signal);
    signal?.throwIfAborted();
    if(!fs.lstatSync(staged).isFile()||fs.lstatSync(staged).isSymbolicLink())
      throw blockedError('download','Downloaded artifact is not a regular file.');
    const digest=crypto.createHash('sha256').update(fs.readFileSync(staged)).digest('hex');
    if(digest!==setup.expected_sha256)
      throw blockedError('checksum','Downloaded binary does not match the reviewed checksum; nothing installed.');
    fs.chmodSync(staged,0o700);
    // Atomic no-clobber publication, including a destination created after the
    // initial existence check. Staging is on the same filesystem.
    try{fs.linkSync(staged,target);}
    catch(e){if(e.code==='EEXIST')throw blockedError('install_conflict','Destination appeared during installation; it was not overwritten.',{path:target});throw e;}
    return {state:'installed',path:target,sha256:digest};
  }catch(e){
    if(e.stage)throw e;
    throw blockedError('install',e.message);
  }finally{fs.rmSync(temp,{recursive:true,force:true});}
}

export function loginInvocation(bin,input=process.env,device=false,cwd=process.cwd()) {
  return {bin,args:['login',device?'--device-auth':'--oauth'],
    options:{cwd,env:consumerEnvironment(input),stdio:'inherit'}};
}

export function login(input=process.env,device=false) {
  const setup=setupInfo();
  const candidates=inspectCandidates(grokCandidates(input),setup.expected_sha256);
  const candidate=candidates.find(c=>c.status==='verified');
  if(!candidate)throw blockedError('binary','Login requires a verified executable; run setup check/install first.',{setup,candidates});
  const env=consumerEnvironment(input);
  const auth=authMetadata(env.GROK_HOME);
  if(!['missing','present_owner_only'].includes(auth.status))
    throw blockedError('auth','Review unsafe login-file metadata before signing in.',{auth});
  // A new workspace avoids project-local setup. The CLI may still discover
  // user-level compatible tooling; this is not a sandbox.
  const cwd=fs.mkdtempSync(path.join(os.tmpdir(),'grok-login-'));
  try{
    probeVersion(candidate.realpath,cwd,env);
    const invocation=loginInvocation(candidate.realpath,input,device,cwd);
    const result=spawnSync(invocation.bin,invocation.args,invocation.options);
    if(result.error||result.status!==0)throw blockedError('login','Interactive login did not complete: '+(result.error?.code||'exit '+result.status));
    return {state:'login_command_completed',home:selectedHome(input),model_prompt_submitted:false,
      next:'Run normal preflight, then the authorized smoke test; account access is not yet verified.'};
  }finally{fs.rmSync(cwd,{recursive:true,force:true});}
}

async function main() {
  const [action='check',...args]=process.argv.slice(2);
  if(!['check','install','login'].includes(action)||args.some(a=>a!=='--device-auth')||
      (args.length&&(action!=='login'||args.length!==1)))
    throw new Error('Usage: node grok-setup.mjs check|install|login [--device-auth for login only]');
  let result;
  if(action==='check'){result=check();if(result.blockers.length)process.exitCode=1;}
  else if(action==='login')result=login(process.env,args.includes('--device-auth'));
  else {
    const controller=new AbortController();
    const cancel=()=>controller.abort(new Error('Installation interrupted.'));
    process.on('SIGINT',cancel);process.on('SIGTERM',cancel);
    try{result=await installPinned(setupInfo(),undefined,controller.signal);}
    finally{process.off('SIGINT',cancel);process.off('SIGTERM',cancel);}
  }
  console.log(JSON.stringify(result,null,2));
}
if(process.argv[1]&&fs.existsSync(process.argv[1])&&fs.realpathSync(fileURLToPath(import.meta.url))===fs.realpathSync(process.argv[1]))
  main().catch(e=>{console.error(JSON.stringify(blockedResult(e),null,2));process.exitCode=1;});

