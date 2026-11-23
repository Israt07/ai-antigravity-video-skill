// Faceless Shorts Studio – Express backend with SSE pipeline progress
import express from 'express';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Paths ──────────────────────────────────────────────────────────────────
const SKILL   = path.resolve(__dirname, '..');                        // ai-antigravity-video-skill root
const STYLES  = path.join(SKILL, 'styles');
const SCRIPTS = path.join(SKILL, 'scripts');
const PYTHON  = process.env.PYTHON || path.join(process.env.USERPROFILE || process.env.HOME, '.faceless-shorts', 'venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const PROJECTS_ROOT = path.join(process.env.USERPROFILE || process.env.HOME, 'faceless-shorts');

// ── In-memory project state (per-session) ──────────────────────────────────
const projects = new Map();   // id → { id, name, style, status, steps[], dir }
const sseClients = new Map(); // id → Set<res>

function broadcast(projectId, event, data) {
  const clients = sseClients.get(projectId);
  if (!clients) return;
  for (const res of clients) {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }
}

// ── API: list styles ──────────────────────────────────────────────────────
app.get('/api/styles', (_req, res) => {
  try {
    const dirs = fs.readdirSync(STYLES).filter(d => fs.statSync(path.join(STYLES, d)).isDirectory());
    const styles = dirs.map(d => {
      const mdPath = path.join(STYLES, d, 'STYLE.md');
      let desc = d;
      if (fs.existsSync(mdPath)) {
        const md = fs.readFileSync(mdPath, 'utf8');
        const m = md.match(/^#\s+(.+)/m);
        if (m) desc = m[1];
      }
      const thumb = path.join(STYLES, d, 'style-sheet.png');
      return { id: d, name: desc, hasThumb: fs.existsSync(thumb) };
    });
    res.json(styles);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// serve style thumbnails
app.get('/api/styles/:id/thumb', (req, res) => {
  const f = path.join(STYLES, req.params.id, 'style-sheet.png');
  if (!fs.existsSync(f)) return res.status(404).end();
  res.type('image/png').sendFile(f);
});

// ── API: list existing projects ────────────────────────────────────────────
app.get('/api/projects', (_req, res) => {
  try {
    if (!fs.existsSync(PROJECTS_ROOT)) return res.json([]);
    const dirs = fs.readdirSync(PROJECTS_ROOT).filter(d => {
      const p = path.join(PROJECTS_ROOT, d, 'script.json');
      return fs.existsSync(p);
    });
    const list = dirs.map(d => {
      const scriptPath = path.join(PROJECTS_ROOT, d, 'script.json');
      let title = d;
      try { title = JSON.parse(fs.readFileSync(scriptPath, 'utf8')).title || d; } catch {}
      const videoPath = path.join(PROJECTS_ROOT, d, 'renders');
      let hasVideo = false;
      if (fs.existsSync(videoPath)) hasVideo = fs.readdirSync(videoPath).some(f => f.endsWith('.mp4'));
      return { name: d, title, hasVideo, dir: path.join(PROJECTS_ROOT, d) };
    });
    res.json(list);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── API: read project artifacts ───────────────────────────────────────────
app.get('/api/projects/:name/script', (req, res) => {
  const f = path.join(PROJECTS_ROOT, req.params.name, 'script.json');
  if (!fs.existsSync(f)) return res.status(404).json({ error: 'not found' });
  res.json(JSON.parse(fs.readFileSync(f, 'utf8')));
});
app.get('/api/projects/:name/lines', (req, res) => {
  const f = path.join(PROJECTS_ROOT, req.params.name, 'data', 'lines.json');
  if (!fs.existsSync(f)) return res.status(404).json({ error: 'not found' });
  res.json(JSON.parse(fs.readFileSync(f, 'utf8')));
});
app.get('/api/projects/:name/words', (req, res) => {
  const f = path.join(PROJECTS_ROOT, req.params.name, 'data', 'words.json');
  if (!fs.existsSync(f)) return res.status(404).json({ error: 'not found' });
  res.json(JSON.parse(fs.readFileSync(f, 'utf8')));
});
app.get('/api/projects/:name/cues', (req, res) => {
  const f = path.join(PROJECTS_ROOT, req.params.name, 'data', 'cues.json');
  if (!fs.existsSync(f)) return res.status(404).json({ error: 'not found' });
  res.json(JSON.parse(fs.readFileSync(f, 'utf8')));
});
app.get('/api/projects/:name/shots', (req, res) => {
  const f = path.join(PROJECTS_ROOT, req.params.name, 'src', 'shots.js');
  if (!fs.existsSync(f)) return res.status(404).json({ error: 'not found' });
  res.type('text/javascript').send(fs.readFileSync(f, 'utf8'));
});
app.get('/api/projects/:name/sheet', (req, res) => {
  const f = path.join(PROJECTS_ROOT, req.params.name, 'renders', 'sheet.png');
  if (!fs.existsSync(f)) return res.status(404).json({ error: 'not found' });
  res.type('image/png').sendFile(f);
});
app.get('/api/projects/:name/video', (req, res) => {
  const dir = path.join(PROJECTS_ROOT, req.params.name, 'renders');
  if (!fs.existsSync(dir)) return res.status(404).end();
  const mp4 = fs.readdirSync(dir).find(f => f.endsWith('.mp4'));
  if (!mp4) return res.status(404).end();
  res.type('video/mp4').sendFile(path.join(dir, mp4));
});

// ── API: save script.json ─────────────────────────────────────────────────
app.put('/api/projects/:name/script', (req, res) => {
  const dir = path.join(PROJECTS_ROOT, req.params.name);
  if (!fs.existsSync(dir)) return res.status(404).json({ error: 'project not found' });
  fs.writeFileSync(path.join(dir, 'script.json'), JSON.stringify(req.body, null, 2));
  res.json({ ok: true });
});

// ── API: save shots.js ───────────────────────────────────────────────────
app.put('/api/projects/:name/shots', (req, res) => {
  const dir = path.join(PROJECTS_ROOT, req.params.name);
  if (!fs.existsSync(dir)) return res.status(404).json({ error: 'project not found' });
  fs.writeFileSync(path.join(dir, 'src', 'shots.js'), req.body.code);
  res.json({ ok: true });
});

// ── SSE endpoint ──────────────────────────────────────────────────────────
app.get('/api/projects/:id/stream', (req, res) => {
  const id = req.params.id;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache',
    'Connection': 'keep-alive', 'X-Accel-Buffering': 'no',
  });
  res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
  if (!sseClients.has(id)) sseClients.set(id, new Set());
  sseClients.get(id).add(res);
  req.on('close', () => { sseClients.get(id)?.delete(res); });
});

// ── Helpers: run a command and stream output ──────────────────────────────
function runStep(projectId, stepName, cmd, args, cwd, opts = {}) {
  return new Promise((resolve, reject) => {
    broadcast(projectId, 'step', { step: stepName, status: 'running', detail: `${path.basename(cmd)} ${args.join(' ')}` });
    const proc = spawn(cmd, args, {
      cwd, stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
      ...(opts.env ? { env: { ...process.env, ...opts.env } } : {}),
    });
    let out = '', err = '';
    proc.stdout.on('data', d => {
      out += d.toString();
      broadcast(projectId, 'log', { step: stepName, text: d.toString() });
    });
    proc.stderr.on('data', d => {
      err += d.toString();
      broadcast(projectId, 'log', { step: stepName, text: d.toString() });
    });
    proc.on('close', code => {
      if (code === 0) {
        broadcast(projectId, 'step', { step: stepName, status: 'done', detail: out.split('\n').filter(Boolean).pop() || 'done' });
        resolve(out);
      } else {
        broadcast(projectId, 'step', { step: stepName, status: 'error', detail: err || out || `exit code ${code}` });
        reject(new Error(`${stepName} failed (exit ${code}): ${err || out}`));
      }
    });
    proc.on('error', e => {
      broadcast(projectId, 'step', { step: stepName, status: 'error', detail: e.message });
      reject(e);
    });
  });
}

// ── API: create project (copy template) ──────────────────────────────────
app.post('/api/projects', async (req, res) => {
  const { name, style } = req.body;
  if (!name || !style) return res.status(400).json({ error: 'name and style required' });
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const dir = path.join(PROJECTS_ROOT, slug);
  const src = path.join(STYLES, style, 'example');
  if (!fs.existsSync(src)) return res.status(400).json({ error: `style '${style}' not found` });
  if (fs.existsSync(dir)) return res.status(409).json({ error: `project '${slug}' already exists` });

  // copy template
  fs.mkdirSync(dir, { recursive: true });
  copyDirSync(src, dir);
  fs.mkdirSync(path.join(dir, 'renders'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'review'), { recursive: true });
  // remove old generated data
  for (const f of ['data/narration.wav', 'data/mix.wav']) {
    const fp = path.join(dir, f);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  res.json({ slug, dir });
});

function copyDirSync(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDirSync(s, d);
    else fs.copyFileSync(s, d);
  }
}

// ── API: run pipeline step by step ────────────────────────────────────────
app.post('/api/projects/:name/run/:step', async (req, res) => {
  const { name, step } = req.params;
  const dir = path.join(PROJECTS_ROOT, name);
  if (!fs.existsSync(dir)) return res.status(404).json({ error: 'project not found' });

  res.json({ started: true, step });

  try {
    switch (step) {
      case 'narration': {
        await runStep(name, 'narration', PYTHON,
          [path.join(SCRIPTS, 'voice.py'), dir], dir);
        break;
      }
      case 'alignment': {
        await runStep(name, 'alignment', PYTHON,
          [path.join(SCRIPTS, 'words.py'), dir], dir);
        break;
      }
      case 'check': {
        await runStep(name, 'check', 'node',
          [path.join(dir, 'tools', 'capture.mjs'), 'check'], dir);
        break;
      }
      case 'cues': {
        await runStep(name, 'cues', 'node',
          [path.join(dir, 'tools', 'capture.mjs'), 'cues'], dir);
        break;
      }
      case 'mix': {
        await runStep(name, 'mix', PYTHON,
          [path.join(dir, 'tools', 'mix.py'), '.'], dir);
        break;
      }
      case 'sheet': {
        await runStep(name, 'sheet', 'node',
          [path.join(dir, 'tools', 'capture.mjs'), 'sheet', 'renders/sheet.png'], dir);
        break;
      }
      case 'render': {
        await runStep(name, 'render', 'node',
          [path.join(dir, 'tools', 'capture.mjs'), 'video', `renders/${name}.mp4`], dir);
        break;
      }
      default:
        broadcast(name, 'step', { step, status: 'error', detail: `unknown step: ${step}` });
    }
  } catch (e) {
    console.error(`Pipeline step '${step}' failed for '${name}':`, e.message);
  }
});

// ── API: run full pipeline ────────────────────────────────────────────────
app.post('/api/projects/:name/run-all', async (req, res) => {
  const { name } = req.params;
  const dir = path.join(PROJECTS_ROOT, name);
  if (!fs.existsSync(dir)) return res.status(404).json({ error: 'project not found' });

  const steps = ['narration', 'alignment', 'check', 'cues', 'mix', 'sheet', 'render'];
  res.json({ started: true, steps });

  broadcast(name, 'pipeline', { status: 'running', steps });

  try {
    // 1. Narration
    await runStep(name, 'narration', PYTHON,
      [path.join(SCRIPTS, 'voice.py'), dir], dir);

    // 2. Word alignment
    await runStep(name, 'alignment', PYTHON,
      [path.join(SCRIPTS, 'words.py'), dir], dir);

    // 3. Check shots
    await runStep(name, 'check', 'node',
      [path.join(dir, 'tools', 'capture.mjs'), 'check'], dir);

    // 4. Sound cues
    await runStep(name, 'cues', 'node',
      [path.join(dir, 'tools', 'capture.mjs'), 'cues'], dir);

    // 5. Audio mix
    await runStep(name, 'mix', PYTHON,
      [path.join(dir, 'tools', 'mix.py'), '.'], dir);

    // 6. Contact sheet
    await runStep(name, 'sheet', 'node',
      [path.join(dir, 'tools', 'capture.mjs'), 'sheet', 'renders/sheet.png'], dir);

    // 7. Render video
    await runStep(name, 'render', 'node',
      [path.join(dir, 'tools', 'capture.mjs'), 'video', `renders/${name}.mp4`], dir);

    broadcast(name, 'pipeline', { status: 'done' });
  } catch (e) {
    broadcast(name, 'pipeline', { status: 'error', detail: e.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3847;
app.listen(PORT, () => {
  console.log(`\n  🎬 Faceless Shorts Studio → http://localhost:${PORT}\n`);
});
