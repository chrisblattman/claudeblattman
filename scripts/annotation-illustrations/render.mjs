// From repository root: node scripts/annotation-illustrations/render.mjs
// Reconstructed UI illustrations based on the five user-supplied Nov 16 screenshots.
// Uses the optional local design-tools Puppeteer installation; no source screenshots are published.
import puppeteer from '../../design-tools/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {mkdirSync} from 'node:fs';
mkdirSync('docs/images/annotation-examples', {recursive:true});
const browser=await puppeteer.launch({headless:true});
try {
 const page=await browser.newPage();
 await page.setViewport({width:1600,height:1000,deviceScaleFactor:1.5});
 await page.goto(pathToFileURL(resolve('scripts/annotation-illustrations/index.html')).href);
 await page.evaluate(()=>document.fonts.ready);
 // Keep the gallery background out of the rounded window corners.
 await page.addStyleTag({content:'body { background: transparent; }'});
 for(const id of ['codex-browser','claude-reply','claude-markdown','adobe-widget','google-docs']) {
  await (await page.$('#'+id+' .window')).screenshot({path:resolve('docs/images/annotation-examples/'+id+'.png'),omitBackground:true});
 }
} finally {await browser.close();}
