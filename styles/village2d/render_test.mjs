// Render runner for village2d test scene -> out/village2d_test.mp4
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STYLES_DIR = path.join(ROOT, 'styles', 'village2d');
const FPS = 30;

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
      let f = path.join(ROOT, u === '/' ? 'styles/village2d/render_view.html' : u);
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

async function openPage(port) {
  if (!CHROME) throw new Error('Chrome binary not found');
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'v2d-chrome-'));
  const chrome = spawn(CHROME, [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${prof}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    '--window-size=1080,1920',
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

  const pageUrl = `http://127.0.0.1:${port}/styles/village2d/render_view.html`;
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
    if (x.exceptionDetails) throw new Error(x.exceptionDetails.exception?.description || x.exceptionDetails.text);
    return x.result.value;
  };

  await send('Runtime.enable');

  // Wait for OP.ready
  for (let i = 0; i < 200; i++) {
    const ready = await ev('window.OP ? window.OP.ready : false').catch(() => false);
    if (ready === true) break;
    await sleep(100);
  }

  const close = () => {
    try { ws.close(); } catch {}
    chrome.kill('SIGKILL');
    setTimeout(() => { try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} }, 400);
  };

  return { ev, close };
}

const jpg = d => Buffer.from(d.slice(d.indexOf(',') + 1), 'base64');

async function main() {
  const outPath = path.resolve(ROOT, 'out', 'village2d_test.mp4');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const srv = await serve();
  const port = srv.address().port;
  console.log(`Server listening on port ${port}...`);

  const P = await openPage(port);
  try {
    const dur = await P.ev('window.OP.duration()');
    const totalFrames = Math.round(dur * FPS);
    console.log(`Rendering Village 2D test scene: ${dur}s (${totalFrames} frames) -> ${outPath}`);

    const ff = spawn('ffmpeg', [
      '-v', 'error', '-y',
      '-f', 'image2pipe',
      '-framerate', String(FPS),
      '-i', '-',
      '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
      '-map', '0:v', '-map', '1:a',
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '18',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-shortest',
      '-movflags', '+faststart',
      outPath
    ], { stdio: ['pipe', 'inherit', 'inherit'] });

    for (let i = 0; i < totalFrames; i++) {
      const t = i / FPS;
      const dataUrl = await P.ev(`window.OP.frame(${t})`);
      const buf = jpg(dataUrl);
      if (!ff.stdin.write(buf)) {
        await new Promise(r => ff.stdin.once('drain', r));
      }
      if (i % 25 === 0 || i === totalFrames - 1) {
        process.stdout.write(`\rRendered ${i + 1}/${totalFrames} frames`);
      }
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log(`\nComplete: ${outPath}`);

    // Also copy to emu-war/out/village2d_test.mp4 if directory exists
    const altOut = 'C:/Users/israt/faceless-shorts/emu-war/out/village2d_test.mp4';
    if (fs.existsSync(path.dirname(altOut))) {
      fs.copyFileSync(outPath, altOut);
      console.log(`Also copied to ${altOut}`);
    }
  } finally {
    P.close();
    srv.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
