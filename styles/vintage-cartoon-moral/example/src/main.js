// Vintage Cartoon Moral engine boot: font -> script + timing -> captions -> shots.
// window.OP is the API driven by tools/capture.mjs: ready, bootError, duration(), draw(t), frame(t, q), cues(), shots().
import { W, H, setCtx, ctx, clamp, eo, eio } from './core/lib.js';
import { T, loadTiming } from './core/timing.js';
import { buildCaptions, drawCaption, captionList } from './core/captions.js';
import { applyVintagePostEffects, drawIris } from './core/kit.js';
import { buildShots } from './shots.js';

const cv = document.getElementById('cv');
setCtx(cv.getContext('2d'));
const OP = (window.OP = { ready: false });

function draw(t) {
  t = clamp(t, 0, T.dur - 1e-4);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.letterSpacing = '0px';
  ctx.fillStyle = '#0B0C0E';
  ctx.fillRect(0, 0, W, H);

  const S = OP._shots;
  let i = S.length - 1;
  while (i > 0 && S[i].at > t) i--;
  const sh = S[i];
  const end = i < S.length - 1 ? S[i + 1].at : T.dur;
  const d = end - sh.at;
  const lt = t - sh.at;

  // Ken Burns camera motion: slow push-in (1.0 -> 1.12) or gentle pan
  const zoomFactor = sh.zoom ?? 0.12;
  const drift = 1 + zoomFactor * eio(clamp(lt / d));
  const [cx, cy] = sh.cam || [540, 960];
  const panX = (sh.panX ?? 0) * (lt / d);
  const panY = (sh.panY ?? 0) * (lt / d);

  ctx.save();
  ctx.translate(cx + panX, cy + panY);
  ctx.scale(drift, drift);
  ctx.translate(-cx, -cy);

  // Render scene visuals
  sh.draw(lt, d, t);
  ctx.restore();

  // Transitions: oval iris or fade
  if (sh.transition === 'iris-in' && lt < 0.45) {
    drawIris(lt / 0.45, 'in', cx, cy);
  } else if (sh.transition === 'iris-out' && lt > d - 0.45) {
    drawIris((d - lt) / 0.45, 'out', cx, cy);
  } else if (sh.transition === 'fade-black') {
    if (lt < 0.35) {
      ctx.fillStyle = '#000';
      ctx.globalAlpha = 1 - lt / 0.35;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    }
  }

  // Global start/end fades
  const globalFade = Math.min(clamp(t / 0.3), clamp((T.dur - t) / 0.4));
  if (globalFade < 1) {
    ctx.fillStyle = '#000';
    ctx.globalAlpha = 1 - globalFade;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }

  // 1930s Film Post-Effects (Scanlines, Film Grain, Dust, Vignette, Flicker)
  applyVintagePostEffects(t, sh.mood || 'warm');

  // Burn-in Captions (Bold white with heavy ink outline, bottom third)
  drawCaption(t);
}

(async () => {
  try {
    await document.fonts.load('900 100px Inter');
    const script = await (await fetch('script.json', { cache: 'no-store' })).json();
    await loadTiming();
    buildCaptions(script);
    const { shots, cues } = buildShots();
    shots.sort((a, b) => a.at - b.at);
    OP._shots = shots;
    OP.script = script;
    OP.duration = () => T.dur;
    OP.draw = draw;
    OP.frame = (t, q = 0.92) => {
      draw(t);
      return cv.toDataURL('image/jpeg', q);
    };
    OP.shots = () =>
      shots.map((s, i) => ({
        id: s.id,
        at: +s.at.toFixed(3),
        end: +(i < shots.length - 1 ? shots[i + 1].at : T.dur).toFixed(3),
        note: s.note || ''
      }));
    OP.captions = () =>
      captionList().map((c) => ({
        s: +c.s.toFixed(3),
        e: +c.e.toFixed(3),
        text: c.words.map((w) => (w.hi ? '*' : '') + w.txt).join(' ')
      }));
    OP.cues = () => cues.slice().sort((a, b) => a.t - b.t);
    OP.ready = true;

    // Preview mode (not capture): play in real time
    const q = new URLSearchParams(location.search);
    if (!q.has('capture')) {
      if (q.has('t')) draw(+q.get('t'));
      else {
        const audio = new Audio('data/mix.wav');
        let t0 = null;
        const btn = document.getElementById('play');
        if (btn) {
          btn.hidden = false;
          btn.onclick = () => {
            btn.hidden = true;
            t0 = performance.now();
            audio.currentTime = 0;
            audio.play().catch(() => {});
          };
        }
        const loop = (now) => {
          const t = t0 == null ? 0 : (now - t0) / 1000;
          draw(t0 == null ? 0 : t);
          if (t0 != null && t > T.dur) {
            t0 = null;
            if (btn) btn.hidden = false;
          }
          requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      }
    }
  } catch (e) {
    OP.bootError = String((e && e.stack) || e);
    console.error(e);
  }
})();
