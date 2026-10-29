#!/usr/bin/env python3
"""Scan public source and release ZIP bytes; never print matched private contents."""
import argparse
from pathlib import Path
import re
import subprocess
import sys
import zipfile

PATTERNS = {
    'personal-home-path': r'/Users/(?!\[|<|your[-_ ]|username\b|example\b)[A-Za-z0-9_.-]+/',
    'private-workspace': r'Dropbox/(?:Codex|AI_Projects|Research & Writing|Claude/(?:Settings|Projects))|Proposal_Resources|HPP-Blattman',
    'private-service-id': r'Label_[0-9]+|[a-z0-9]{6,}@(g\.us|lid)|[a-z0-9]{16,}@group\.calendar\.google\.com|uchicago-bfi-blattman|PVT[A-Za-z]*_[A-Za-z0-9]+|\.granola-api-key',
    'personal-email': r'[A-Z0-9._%+-]+@(?:gmail\.com|uchicago\.edu)',
    'private-key': r'-----BEGIN (?:OPENSSH |RSA |EC |DSA |ENCRYPTED )?PRIVATE KEY-----',
    'credential': r'\b(?:sk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}|xai-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{20,})\b',
    'credential-assignment': r'''(?:api_key|client_secret|password)\s*[:=]\s*["'][A-Za-z0-9_+/=-]{16,}["']''',
    'research-id': r'\bIRB[- ]?[0-9]{3,}',
}
# This maintainer guide teaches the patterns themselves. Credential payloads and
# actual private keys still scan everywhere. Do not allowlist installable files.
GUIDE_EXAMPLES = {'personal-home-path','private-workspace','private-service-id','personal-email','research-id'}


def scan_bytes(label, data, blocks=()):
    issues=[]
    if b'\x00' in data:
        # Binary assets can contain ASCII secrets; latin1 is lossless for scanning.
        text=data.decode('latin1')
    else:
        try:text=data.decode('utf-8')
        except UnicodeDecodeError:text=data.decode('latin1')
    # Public site mailboxes and visibly generic teaching addresses only.
    allowed_emails = {'yourname@gmail.com','your-email@gmail.com','yourself+todo@gmail.com',
                      'you+todo@gmail.com','you@gmail.com','your-email+todo@gmail.com','your-assistant@gmail.com'}
    if label.startswith('docs/') or label == 'overrides/main.html':
        allowed_emails.update({'claudeblattman+feedback@gmail.com','claudeblattman+privacy@gmail.com'})
    for category, pattern in PATTERNS.items():
        if label == 'scripts/scan-public.py' and category in {'private-workspace','private-service-id','personal-email'}:
            continue
        if category == 'personal-email':
            if any(match.group(0).lower() not in allowed_emails for match in re.finditer(pattern,text,re.I)):
                issues.append((label,category))
            continue
        if label == 'CONTRIBUTING.md' and category in GUIDE_EXAMPLES:
            continue
        if re.search(pattern,text,re.I):issues.append((label,category))
    for pattern in blocks:
        if pattern.search(text):issues.append((label,'private-local-blocklist'));break
    return issues


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--archive',type=Path,action='append',default=[])
    args=parser.parse_args()
    root=Path(__file__).resolve().parents[1]
    blocks=[]
    for name in ('.sanitize-names.local','.sanitize-private-blocklist.local'):
        file=root/name
        if file.exists():
            blocks.extend(re.compile(line,re.I) for line in file.read_text().splitlines() if line.strip())
    issues=[];count=0
    if not args.archive:
        result=subprocess.run(['git','ls-files','-z','--cached','--others','--exclude-standard'],cwd=root,check=True,stdout=subprocess.PIPE)
        for raw in sorted(set(result.stdout.split(b'\0'))-{b''}):
            name=raw.decode('utf-8');file=root/name
            # Deleted tracked files are absent from the proposed release.
            if not file.exists() and not file.is_symlink():continue
            if file.is_symlink():issues.append((name,'symlink-not-allowed'));continue
            try:issues.extend(scan_bytes(name,file.read_bytes(),blocks));count+=1
            except OSError:issues.append((name,'unreadable-file'))
    for archive in args.archive:
        with zipfile.ZipFile(archive) as zipped:
            for entry in zipped.infolist():
                if entry.is_dir():continue
                if entry.filename.startswith('/') or '..' in Path(entry.filename).parts or (entry.external_attr >> 16) & 0o170000 == 0o120000:
                    issues.append((str(archive),'unsafe-archive-entry'));continue
                issues.extend(scan_bytes(entry.filename,zipped.read(entry),blocks));count+=1
    for label,category in issues:print(f'BLOCKED {label}: {category}',file=sys.stderr)
    print(f'Scanned {count} files; {len(issues)} findings. Private local blocklists: {"loaded" if blocks else "not supplied"}.')
    return bool(issues)


if __name__=='__main__':
    try:sys.exit(main())
    except (OSError,ValueError,re.error,subprocess.CalledProcessError,zipfile.BadZipFile) as error:
        print(f'Scan failed closed: {type(error).__name__}',file=sys.stderr);sys.exit(1)
