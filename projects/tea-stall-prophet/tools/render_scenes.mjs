import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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
      let f = path.join(ROOT, u === '/' ? 'render_view.html' : u);
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
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'v2d-prophet-'));
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

  const pageUrl = `http://127.0.0.1:${port}/render_view.html`;
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

async function renderScene(P, sceneJsonPath, outMp4Path) {
  const sceneData = JSON.parse(fs.readFileSync(sceneJsonPath, 'utf-8'));
  const dur = sceneData.duration;
  const audioPath = path.resolve(ROOT, sceneData.audio);
  const totalFrames = Math.round(dur * FPS);

  console.log(`\nRendering ${sceneData.id}: ${dur}s (${totalFrames} frames) -> ${outMp4Path}`);

  // Initialize scene inside Chrome
  const spec = {
    ...sceneData.visuals,
    duration: dur
  };
  await P.ev(`window.initScene(${JSON.stringify(spec)})`);

  // Setup ffmpeg process
  const ff = spawn('ffmpeg', [
    '-v', 'error', '-y',
    '-f', 'image2pipe',
    '-framerate', String(FPS),
    '-i', '-',
    '-i', audioPath,
    '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    '-movflags', '+faststart',
    outMp4Path
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  const donePromise = new Promise((resolve, reject) => {
    ff.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  const writeFrame = b => new Promise(r => {
    if (!ff.stdin.write(b)) ff.stdin.once('drain', r);
    else process.nextTick(r);
  });

  for (let i = 0; i < totalFrames; i++) {
    const t = i / FPS;
    const dataUri = await P.ev(`window.OP.draw(${t})`);
    await writeFrame(jpg(dataUri));
    if (i % 25 === 0 || i === totalFrames - 1) {
      process.stdout.write(`\r  Frame ${i + 1}/${totalFrames}`);
    }
  }
  process.stdout.write('\n');
  ff.stdin.end();
  await donePromise;
  console.log(`  Finished ${sceneData.id}.`);
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'scenes', 'manifest.json'), 'utf-8'));
  const srv = await serve();
  const port = srv.address().port;
  console.log(`Server listening on port ${port}...`);

  const P = await openPage(port);
  try {
    for (const item of manifest) {
      const jsonPath = path.join(ROOT, 'scenes', `${item.id}.json`);
      const mp4Path = path.join(ROOT, item.clip);
      fs.mkdirSync(path.dirname(mp4Path), { recursive: true });
      await renderScene(P, jsonPath, mp4Path);
    }
    console.log(`\nAll ${manifest.length} scene clips rendered successfully!`);
  } finally {
    P.close();
    srv.close();
  }
}

main().catch(e => {
  console.error('Fatal render error:', e);
  process.exit(1);
});
