#!/usr/bin/env python3
"""Regression tests use fake, assembled markers; never real private information."""
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
import zipfile

SCANNER=Path(__file__).resolve().with_name('scan-public.py')

class ReleaseScanner(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.root=Path(self.temp.name)
        (self.root/'scripts').mkdir()
        self.scanner=self.root/'scripts/scan-public.py'
        shutil.copy2(SCANNER,self.scanner)
        subprocess.run(['git','init','-q',str(self.root)],check=True)

    def tearDown(self):self.temp.cleanup()

    def scan(self,*args):
        return subprocess.run([sys.executable,str(self.scanner),*map(str,args)],capture_output=True,text=True)

    def test_spaces_newlines_and_general_personal_paths_block(self):
        for name in ('canary.txt','canary with spaces.txt','canary\nnewline.txt'):
            file=self.root/name
            file.write_text('/'+'Users/'+'fixture-person/private-project')
            result=self.scan()
            self.assertNotEqual(result.returncode,0)
            self.assertIn('personal-home-path',result.stderr)
            self.assertNotIn('fixture-person',result.stderr)
            file.unlink()
        self.assertEqual(self.scan().returncode,0)

    def test_private_key_header_blocks_without_echoing_value(self):
        file=self.root/'fake-key.txt'
        file.write_text('-----BEGIN '+'OPENSSH '+'PRIVATE KEY-----')
        result=self.scan()
        self.assertNotEqual(result.returncode,0)
        self.assertIn('private-key',result.stderr)
        self.assertNotIn('BEGIN',result.stderr)

    def test_symlink_fails_closed(self):
        (self.root/'link').symlink_to(self.root/'missing')
        result=self.scan()
        self.assertNotEqual(result.returncode,0)
        self.assertIn('symlink',result.stderr)

    def test_clean_and_contaminated_archives(self):
        archive=self.root/'fixture.zip'
        with zipfile.ZipFile(archive,'w') as z:z.writestr('plugin/skills/hello/SKILL.md','A generic workflow.')
        self.assertEqual(self.scan('--archive',archive).returncode,0)
        with zipfile.ZipFile(archive,'w') as z:z.writestr('plugin/secret file.txt','-----BEGIN '+'RSA '+'PRIVATE KEY-----')
        self.assertNotEqual(self.scan('--archive',archive).returncode,0)
        with zipfile.ZipFile(archive,'w') as z:z.writestr('../escape','content')
        self.assertNotEqual(self.scan('--archive',archive).returncode,0)

    def test_invalid_private_blocklist_fails_closed(self):
        (self.root/'.sanitize-names.local').write_text('[')
        self.assertNotEqual(self.scan().returncode,0)

    def test_local_blocklist_is_applied(self):
        (self.root/'.gitignore').write_text('.sanitize-names.local\n')
        (self.root/'.sanitize-names.local').write_text('Fixture Confidential Phrase')
        (self.root/'content').write_text('Fixture Confidential Phrase')
        result=self.scan()
        self.assertNotEqual(result.returncode,0)
        self.assertIn('private-local-blocklist',result.stderr)

if __name__=='__main__':unittest.main(verbosity=2)
