import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STYLES_DIR = path.join(ROOT, 'styles', 'village2d');

const CHROME = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome'
].find(p => p && fs.existsSync(p));

const sleep = ms => new Promise(r => setTimeout(r, ms));

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, r) => {
      const u = decodeURIComponent(req.url.split('?')[0]);
      let f = path.join(ROOT, u === '/' ? 'styles/village2d/sheet.html' : u);
      if (!fs.existsSync(f)) {
        f = path.join(STYLES_DIR, u);
      }
      if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        r.writeHead(404);
        r.end();
        return;
      }
      r.writeHead(200, {
        'Content-Type': MIME[path.extname(f)] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      fs.createReadStream(f).pipe(r);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

async function main() {
  const srv = await serve();
  const port = srv.address().port;
  console.log(`Server listening on port ${port}...`);

  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'v2d-sheet-'));
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${prof}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    '--window-size=1920,1080',
    '--ignore-gpu-blocklist',
    '--enable-unsafe-swiftshader',
    'about:blank'
  ], { stdio: 'ignore' });

  let dbg;
  for (let i = 0; i < 200 && !dbg; i++) {
    try {
      dbg = fs.readFileSync(path.join(prof, 'DevToolsActivePort'), 'utf8').split('\n')[0].trim();
    } catch {
      await sleep(100);
    }
  }
  if (!dbg) throw new Error('Failed to start headless Chrome');

  const pageUrl = `http://127.0.0.1:${port}/styles/village2d/sheet.html`;
  const r = await fetch(`http://127.0.0.1:${dbg}/json/new?${encodeURIComponent(pageUrl)}`, { method: 'PUT' });
  const target = await r.json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pend = new Map();
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) {
      const p = pend.get(m.id);
      pend.delete(m.id);
      m.error ? p.rej(new Error(m.error.message)) : p.res(m.result);
    }
  };

  const send = (method, params = {}) => new Promise((res, rej) => {
    const i = ++id;
    pend.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method, params }));
  });

  const ev = async expr => {
    const x = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return x.result?.value;
  };

  for (let i = 0; i < 200; i++) {
    const ready = await ev('window.SHEET_READY === true').catch(() => false);
    if (ready === true) break;
    await sleep(100);
  }

  // Capture screenshot of the full 1920x1080 page
  const snap = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const buf = Buffer.from(snap.data, 'base64');

  const outSheetPath = path.join(STYLES_DIR, 'style-sheet.png');
  fs.writeFileSync(outSheetPath, buf);
  console.log(`Saved style sheet to: ${outSheetPath} (${buf.length} bytes)`);

  // Copy to projects
  const projSheetPath = path.join(ROOT, 'projects', 'tea-stall-prophet', 'style-sheet.png');
  fs.writeFileSync(projSheetPath, buf);
  console.log(`Copied to: ${projSheetPath}`);

  ws.close();
  chrome.kill('SIGKILL');
  srv.close();
  setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} }, 400);
}

main().catch(e => {
  console.error('Sheet generation error:', e);
  process.exit(1);
});
