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

export function setupInfo(home=os.homedir(), arch=process.arch, platform=process.platform) {
  if(platform!=='darwin'||!BINARY_SHA256_BY_ARCH[arch])
    throw blockedError('platform','Grok requires a reviewed macOS arm64/x64 binary; no provider fallback.');
  return {release:RELEASE,architecture:arch,expected_sha256:BINARY_SHA256_BY_ARCH[arch],
    official_url:'https://x.ai/cli/grok-'+RELEASE+'-macos-'+(arch==='arm64'?'aarch64':'x86_64')+'.gz',
    install_target:path.join(home,'.local/share/grok-build',RELEASE,'grok')};
}

export function blockedError(stage,message,details={}) {
  return Object.assign(new Error(message),{stage,details});
}
export function blockedResult(error) {
  return {state:'blocked',error:error.message,fallback:'none',...(error.stage?{stage:error.stage,model_prompt_submitted:false}:{}),...error.details};
}

export function grokCandidates(input=process.env,home=os.homedir()) {
  if(input.GROK_CLI_PATH)return [path.resolve(input.GROK_CLI_PATH)];
  return [...new Set([path.join(home,'.local/share/grok-build',RELEASE,'grok'),
    path.join(home,'.grok/bin/grok'),
    ...(input.PATH||'').split(path.delimiter).filter(Boolean).map(dir=>path.resolve(dir,'grok'))])];
}

// Reading a candidate never executes it. The production callers supply only
// the fixed architecture pin; the explicit hash parameter supports offline fixtures.
export function inspectCandidates(candidates,expectedHash) {
  return candidates.map(file=>{
    const entry={path:file};
    try {
      fs.lstatSync(file);
      entry.realpath=fs.realpathSync(file);
      if(!fs.statSync(entry.realpath).isFile())return {...entry,status:'not_regular_file'};
      entry.sha256=hash(fs.readFileSync(entry.realpath));
      if(entry.sha256!==expectedHash)return {...entry,status:'checksum_mismatch'};
      try{fs.accessSync(entry.realpath,fs.constants.X_OK);}catch{return {...entry,status:'not_executable'};}
      return {...entry,status:'verified'};
    }catch(e){
      // Distinguish a missing pathname from an existing broken symlink.
      let exists=false;try{fs.lstatSync(file);exists=true;}catch{}
      return {...entry,status:e.code==='ENOENT'&&!exists?'absent':'unreadable',reason:e.code||'read_failed'};
    }
  });
}

export function selectedHome(input=process.env,home=os.homedir()) {
  if(input.GROK_HOME)return {path:path.resolve(input.GROK_HOME),source:'GROK_HOME'};
  const dedicated=path.join(home,'.grok-build-agent');
  return fs.existsSync(path.join(dedicated,'auth.json')) ?
    {path:dedicated,source:'existing_dedicated_login'} : {path:path.join(home,'.grok'),source:'standard_home'};
}

export function authMetadata(home) {
  const file=path.join(home,'auth.json');
  try {
    const st=fs.lstatSync(file);
    return {path:file,status:st.isFile()&&!st.isSymbolicLink()&&(st.mode&0o077)===0&&st.uid===process.getuid()?'present_owner_only':'unsafe_metadata',token_contents_read:false};
  }catch(e){return {path:file,status:e.code==='ENOENT'?'missing':'unreadable',token_contents_read:false};}
}

export function pythonCandidates(input=process.env) {
  if(input.STARTER_KIT_PYTHON)return [input.STARTER_KIT_PYTHON];
  const dirs=[...new Set([...(input.PATH||'').split(path.delimiter).filter(Boolean),'/opt/homebrew/bin','/usr/local/bin'])];
  const candidates=['python3'];
  for(const dir of dirs){
    let names=[];try{names=fs.readdirSync(dir);}catch{continue;}
    names=names.filter(n=>/^python3\.\d+$/.test(n)&&Number(n.split('.')[1])>=11)
      .sort((a,b)=>Number(b.split('.')[1])-Number(a.split('.')[1]));
    candidates.push(...names.map(n=>path.resolve(dir,n)));
  }
  return [...new Set(candidates)];
}

export function selectPython(input=process.env, candidates=pythonCandidates(input), probe=spawnSync) {
  const attempts=[];
  const seen=new Set();
  // An explicit override is authoritative even if an injected candidate list is supplied.
  if(input.STARTER_KIT_PYTHON)candidates=[input.STARTER_KIT_PYTHON];
  for(const executable of candidates){
    const located=executable.includes(path.sep)?executable:(input.PATH||'').split(path.delimiter).map(dir=>path.join(dir,executable)).find(file=>{try{fs.accessSync(file,fs.constants.X_OK);return true;}catch{return false;}});
    let resolved=executable;try{resolved=fs.realpathSync(located);}catch{}
    if(seen.has(resolved))continue;seen.add(resolved);
    const code='import sys,json\ntry:\n import tomllib\n capable=True\nexcept ImportError: capable=False\nprint(json.dumps({"version":list(sys.version_info[:3]),"executable":sys.executable,"tomllib":capable}))';
    const r=probe(executable,['-I','-c',code],
      {env:input,encoding:'utf8',timeout:15000,maxBuffer:1024*1024});
    let data;try{data=JSON.parse(r.stdout);}catch{}
    const valid=!r.error&&r.status===0&&data?.tomllib===true&&Array.isArray(data.version)&&data.version[0]===3&&data.version[1]>=11&&typeof data.executable==='string'&&path.isAbsolute(data.executable);
    attempts.push({executable,status:valid?'compatible':'unavailable_or_incompatible',...(data?.version?{version:data.version,tomllib:data.tomllib}:{}),...(r.error?{reason:r.error.code}: {})});
    if(valid)return {status:'ready',executable:data.executable,version:data.version,source:input.STARTER_KIT_PYTHON?'STARTER_KIT_PYTHON':'discovery',attempts};
  }
  return {status:'unavailable',source:input.STARTER_KIT_PYTHON?'STARTER_KIT_PYTHON':'discovery',attempts,
    remedy:'Set STARTER_KIT_PYTHON to a working Python 3.11+ executable with tomllib; an explicit override is never replaced.'};
}


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
  env.GROK_HOME=selectedHome(input).path;
  env.GROK_DISABLE_AUTOUPDATER='1';
  return env;
}

export function checkConfigText(text, label, python=selectPython()) {
  if(python.status!=='ready')throw blockedError('python',python.remedy,{python});
  // Parse TOML rather than matching spelling: dotted keys, quoted tables and
  // inline tables must not evade the consumer-auth boundary. Values stay local.
  const code=`import sys,tomllib,json\ntry: x=tomllib.loads(sys.stdin.read())\nexcept tomllib.TOMLDecodeError: sys.exit(3)\npaths=[]\ndef walk(v,p=[]):\n if isinstance(v,dict):\n  for k,w in v.items():\n   q=p+[k]; paths.append(q); walk(w,q)\n elif isinstance(v,list):\n  for w in v: walk(w,p)\nwalk(x)\nprint(json.dumps(paths))`;
  const r=spawnSync(python.executable,['-I','-c',code],{input:text,encoding:'utf8',timeout:15000,maxBuffer:4*1024*1024});
  if(!r.error&&r.status===3)throw blockedError('config_invalid',`Invalid Grok TOML configuration: ${label}`);
  if(r.error||r.status!==0)throw blockedError('python',`Configuration parser failed using ${python.executable}: ${label}`);
  const paths=JSON.parse(r.stdout);
  const authKeys=new Set(['api_key','env_key','auth_provider_command','base_url','proxy_url','deployment_key','oauth2','oidc','grok_ws_url','grok_ws_origin']);
  if(paths.some(parts=>parts.some(k=>authKeys.has(k)) ||
      (parts.length>1 && ['auth','grok_com_config','model','models','endpoints','managed','deployment'].includes(parts[0]))))
    throw blockedError('config_policy',`Custom auth/model/endpoint configuration requires review: ${label}`);
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
  const r=spawnSync(bin,args,{...opts,encoding:'utf8',timeout:15000,maxBuffer:16*1024*1024});
  if(r.error || r.status!==0)throw blockedError(args[0]==='--version'?'version':'inspect',
    'Grok local '+args[0]+' probe failed: '+(r.error?.code||'exit '+r.status));
  return r.stdout;
}

export function probeVersion(bin,cwd,env) {
  const version=capture(bin,['--version'],{cwd,env}).trim();
  if(!version.startsWith('grok '+RELEASE+' '))throw blockedError('version','Unexpected Grok version for the reviewed binary.');
  return version;
}

export function preflight(cwd,env,input=process.env) {
  const setup=setupInfo();
  const home=selectedHome(input);
  const candidates=inspectCandidates(grokCandidates(input),setup.expected_sha256);
  const python=selectPython(input);
  const auth=authMetadata(env.GROK_HOME);
  const details={setup,candidates,python,home:{...home,path:env.GROK_HOME},auth};
  try {
    const candidate=candidates.find(c=>c.status==='verified');
    if(!candidate)throw blockedError('binary','No usable pinned Grok binary. See candidates for missing, checksum or permission failures; use Kit Setup.');
    // Missing login permits local probes; unsafe existing credentials must be
    // rejected before the CLI can read them, as in the execution boundary.
    if(!['missing','present_owner_only'].includes(auth.status))
      throw blockedError('auth','Grok login must be a regular owner-only file owned by this user; inspect its metadata without reading tokens.');
    const bin=candidate.realpath;
    const version=probeVersion(bin,cwd,env);
    details.binary={status:'verified',path:bin,version,sha256:setup.expected_sha256};
    if(python.status!=='ready')throw blockedError('python',python.remedy);
    let inspection;
    try{inspection=JSON.parse(capture(bin,['inspect','--json'],{cwd,env}));}
    catch(e){if(e.stage)throw e;throw blockedError('inspect','Grok returned invalid configuration inspection JSON.');}
    if(!Array.isArray(inspection.configSources?.layers))throw blockedError('inspect','Unknown Grok config-inspection schema.');
    const checked=[];
    for(const layer of inspection.configSources.layers){
      if(typeof layer.path!=='string')throw blockedError('config','Uninspectable configuration layer.');
      if(!fs.existsSync(layer.path)){checked.push({path:layer.path,present:false});continue;}
      let bytes;try{bytes=fs.readFileSync(layer.path);}catch{throw blockedError('config','Cannot read configuration layer: '+layer.path);}
      checkConfigText(bytes.toString('utf8'),layer.path,python);
      checked.push({path:layer.path,present:true,sha256:hash(bytes)});
    }
    details.config_layers=checked;
    if(auth.status!=='present_owner_only')
      throw blockedError('auth',auth.status==='missing'?
        'Grok login is missing in the selected home. Use the verified setup login command, then retry.':
        'Grok login must be a regular owner-only file owned by this user; inspect its metadata without reading tokens.');
    return {...details,bin,version,binary_sha256:setup.expected_sha256,binary_architecture:process.arch,
      auth_source:home.source+'; consumer OAuth file metadata only, authentication unverified',inspection};
  }catch(e){
    if(!e.stage)e=blockedError('preflight',e.message);
    e.details={...details,...e.details};throw e;
  }
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
  if(r.text.trim())save('response.md',r.text+'\n');
  const state=r.successful&&!spawnError&&!malformed?(warnings.length?'succeeded_with_warnings':'succeeded'):(r.text.trim()?'available_with_failure':'failed');
  Object.assign(receipt,{state,submission:r.end?'completed_run':events.length?'observed_output':'unknown',observed_models:observed,model_observation_scope:'aggregate_root_and_subagent_usage; not root-served-model proof',root_served_model:null,finished_at:new Date().toISOString(),exit_code:terminal.code,signal:terminal.signal,spawn_error:spawnError,session_id:r.end?.sessionId||receipt.session_id,usage:r.end?.usage||null,model_usage:r.end?.modelUsage||null,reported_inference_cost_usd:r.end?.total_cost_usd??null,usage_is_incomplete:r.end?.usage_is_incomplete??null,warnings,errors:r.errors,tool_events:r.tools,raw_sha256:hash(bytes),available_report:r.text.trim()?path.join(out,'response.md'):null,report_sha256:r.text.trim()?hash(r.text+'\n'):null});
  save('result.json',json(receipt));
  console.log(json({state,output_dir:out,result:path.join(out,'result.json'),report:receipt.available_report,session_id:receipt.session_id,warnings}));
  if(!state.startsWith('succeeded'))process.exitCode=1;
}

// Resolve both paths: Dropbox may be a directory alias on the other Mac.
if(process.argv[1]&&fs.existsSync(process.argv[1])&&fs.realpathSync(fileURLToPath(import.meta.url))===fs.realpathSync(process.argv[1])){main().catch(e=>{console.error(json(blockedResult(e)));process.exitCode=1;});}
