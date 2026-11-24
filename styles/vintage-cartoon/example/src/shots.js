// THE TEN YEAR DEAL: Vintage Cartoon shot list.
// 1930s rubber-hose ink cartoon look with dark grey/sepia/navy palette, one warm lamp, moonlight, two-tone shadows.
// Camera zooms and pans on layered scenes: wide, over-the-shoulder, close-up, phone insert, mirror.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, bigText } from './core/lib.js';
import { L, Le, Wd, T, cut } from './core/timing.js';
import * as K from './core/kit.js';

export function buildShots() {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });

  // ── 1 · HOOK: What if ten years from now... (Wide Study) ─────────────────
  {
    const st = cut(0);
    add({
      id: 'S01',
      at: st,
      cam: [540, 960],
      zoom: 0.08,
      note: 'Wide study: moonlit window, warm banker lamp, Wolf and Pup across desk',
      draw(lt, d, t) {
        K.sceneWideStudy(t);
        K.drawContract(540, 1280, 0.75, false);
        // Wolf at left leaning in
        const wolfBlink = Math.sin(lt * 2.2) > 0.94 ? 1 : 0;
        K.drawWolf({ x: 340, y: 840, s: 1.35, pose: 'lean', blink: wolfBlink, eyeDir: 1 });
        // Pup at right looking across
        const pupBlink = Math.sin(lt * 2.7) > 0.94 ? 1 : 0;
        K.drawPup({ x: 740, y: 1040, s: 1.25, pose: 'stand', blink: pupBlink, eyeDir: -1 });
      }
    });
    cue(st + 0.1, 'whoosh', { gain: 0.6 });
    cue(st + 0.2, 'clock', { dur: 3.5, gain: 0.7 });
  }

  // ── 2 · OVER-THE-SHOULDER: Wolf slides golden pen ────────────────────────
  {
    const st = cut(1), penSlide = Wd('slides', 1) - st;
    add({
      id: 'S02',
      at: st,
      cam: [540, 1050],
      zoom: 0.12,
      note: 'OTS: Over pup shoulder, glowing contract, wolf slides pen',
      draw(lt, d, t) {
        K.sceneWideStudy(t);
        const slideP = clamp((lt - penSlide) / 1.4, 0, 1);
        const penX = lerp(420, 560, eo(slideP));
        K.drawContract(540, 1140, 1.2, false);

        // Wolf leaning across desk
        const wolfTalk = Math.abs(Math.sin(lt * 10)) * (lt > penSlide ? 1 : 0);
        K.drawWolf({ x: 380, y: 820, s: 1.5, pose: 'slide', talk: wolfTalk, eyeDir: 1 });

        // Foreground dark over-the-shoulder silhouette
        ctx.save();
        ctx.translate(880, 1420);
        ctx.scale(1.8, 1.8);
        ctx.fillStyle = C.shadowNavy;
        ctx.strokeStyle = C.ink;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.roundRect(-80, -120, 160, 240, 36);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    });
    cue(st + penSlide, 'slide', { dur: 0.8, gain: 0.8 });
  }

  // ── 3 · CLOSE-UP WOLF: 'An easy road. No struggle.' ──────────────────────
  {
    const st = cut(2);
    add({
      id: 'S03',
      at: st,
      cam: [540, 720],
      zoom: 0.20,
      note: 'Close-up: Wolf toothy grin, talking mouth, subtle blink',
      draw(lt, d, t) {
        ctx.fillStyle = C.darkGrey;
        ctx.fillRect(-200, -200, W + 400, H + 400);

        // Warm amber spotlight on Wolf
        const spot = ctx.createRadialGradient(540, 700, 30, 540, 700, 640);
        spot.addColorStop(0, 'rgba(238, 168, 52, 0.38)');
        spot.addColorStop(0.5, 'rgba(232, 159, 48, 0.15)');
        spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spot;
        ctx.beginPath();
        ctx.arc(540, 700, 680, 0, Math.PI * 2);
        ctx.fill();

        const wolfBlink = Math.sin(lt * 3) > 0.95 ? 1 : 0;
        const wolfTalk = Math.abs(Math.sin(lt * 12));
        K.drawWolf({ x: 540, y: 780, s: 2.2, pose: 'stand', blink: wolfBlink, talk: wolfTalk, eyeDir: 0, mouth: 'toothy' });
      }
    });
    cue(st + 0.1, 'tock', { gain: 0.6 });
  }

  // ── 4 · CLOSE-UP PUP: 'Is there really no catch?' ────────────────────────
  {
    const st = cut(3);
    add({
      id: 'S04',
      at: st,
      cam: [540, 740],
      zoom: 0.22,
      note: 'Close-up: Pup worried pie-eyes, clutching ears, talking mouth',
      draw(lt, d, t) {
        ctx.fillStyle = C.navyDark;
        ctx.fillRect(-200, -200, W + 400, H + 400);

        // Soft warm amber fill from lamp at left
        const glow = ctx.createRadialGradient(380, 720, 20, 380, 720, 580);
        glow.addColorStop(0, 'rgba(238, 168, 52, 0.25)');
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(380, 720, 600, 0, Math.PI * 2);
        ctx.fill();

        const pupBlink = Math.sin(lt * 2.8) > 0.95 ? 1 : 0;
        const pupTalk = Math.abs(Math.sin(lt * 11));
        const earWiggle = Math.sin(lt * 4) * 0.05;
        K.drawPup({ x: 540, y: 780, s: 2.2, pose: 'hesitate', blink: pupBlink, talk: pupTalk, mouth: 'worried', headTilt: earWiggle });
      }
    });
    cue(st + 0.1, 'whoosh', { gain: 0.5 });
  }

  // ── 5 · CLOSE-UP WOLF: 'Just sign your twenties away' ────────────────────
  {
    const st = cut(4);
    add({
      id: 'S05',
      at: st,
      cam: [540, 700],
      zoom: 0.26,
      note: 'Extreme close-up: Wolf sly wink & grinning sharp teeth',
      draw(lt, d, t) {
        ctx.fillStyle = C.darkGrey;
        ctx.fillRect(-200, -200, W + 400, H + 400);

        const spot = ctx.createRadialGradient(540, 680, 30, 540, 680, 640);
        spot.addColorStop(0, 'rgba(238, 168, 52, 0.35)');
        spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spot;
        ctx.beginPath();
        ctx.arc(540, 680, 660, 0, Math.PI * 2);
        ctx.fill();

        const isWink = lt > 0.6 && lt < 2.0 ? 1 : 0;
        const wolfTalk = Math.abs(Math.sin(lt * 13)) * (lt < 2.0 ? 1 : 0.2);
        K.drawWolf({ x: 540, y: 760, s: 2.6, pose: 'stand', blink: isWink, talk: wolfTalk, eyeDir: 0, mouth: 'grin' });
      }
    });
  }

  // ── 6 · SIGNING: Trembling paw signs + room fades to black ───────────────
  {
    const st = cut(5), signMoment = Wd('signs', 5) - st;
    add({
      id: 'S06',
      at: st,
      cam: [540, 1060],
      zoom: 0.14,
      note: 'Close on parchment, trembling gloved paw signs, darkness falls',
      draw(lt, d, t) {
        K.sceneWideStudy(t);
        const signed = lt > signMoment;
        K.drawContract(540, 1040, 1.4, signed);

        const tremble = Math.sin(lt * 35) * 3;
        K.drawGlove(680 + tremble, 1160, 1.2, -0.4);

        if (lt > signMoment + 0.3) {
          ctx.fillStyle = C.ink;
          ctx.globalAlpha = clamp((lt - (signMoment + 0.3)) * 2.2);
          ctx.fillRect(-200, -200, W + 400, H + 400);
          ctx.globalAlpha = 1;
        }
      }
    });
    cue(st + signMoment, 'pen', { dur: 0.8, gain: 0.85 });
    cue(st + signMoment + 0.4, 'slam', { gain: 0.8 });
  }

  // ── 7 · PHONE INSERT: 3:00 AM dead blue screen glare ─────────────────────
  {
    const st = cut(6);
    add({
      id: 'S07',
      at: st,
      cam: [540, 940],
      zoom: 0.10,
      capY: 340, // caption placed at top so phone and paws remain visible
      note: 'Phone insert: 3 AM clock, cyan screen glare, tired eyes',
      draw(lt, d, t) {
        K.scenePhoneInsert(t);
        // Tired pup face illuminated in cyan glow above phone
        const blink = Math.sin(lt * 2.5) > 0.95 ? 1 : 0;
        K.drawPup({ x: 540, y: 740, s: 1.6, pose: 'stand', blink, mouth: 'sad', eyeDir: 0 });
      }
    });
    cue(st + 0.1, 'tock', { gain: 0.7 });
  }

  // ── 8 · MIRROR: Dusty mirror reflection & old photo ──────────────────────
  {
    const st = cut(7);
    add({
      id: 'S08',
      at: st,
      cam: [540, 780],
      zoom: 0.12,
      note: 'Mirror: Dusty bathroom mirror reflection holding vintage photo',
      draw(lt, d, t) {
        K.sceneMirror(t);
        // Older pup reflection
        const blink = Math.sin(lt * 2.2) > 0.95 ? 1 : 0;
        K.drawPup({ x: 540, y: 680, s: 1.5, pose: 'stand', blink, mouth: 'sad', tear: true });
      }
    });
    cue(st + 0.2, 'paper', { dur: 0.7, gain: 0.7 });
  }

  // ── 9 · WIDE RETURN: Snapped back to warm room, unsigned contract ─────────
  {
    const st = cut(8);
    add({
      id: 'S09',
      at: st,
      cam: [540, 960],
      zoom: 0.08,
      note: 'Wide study returns: warm amber lamp, unsigned contract',
      draw(lt, d, t) {
        K.sceneWideStudy(t);
        K.drawContract(540, 1280, 0.75, false);
        K.drawWolf({ x: 340, y: 840, s: 1.35, pose: 'stand', eyeDir: 1 });
        K.drawPup({ x: 740, y: 1040, s: 1.25, pose: 'stand', eyeDir: -1, mouth: 'worried' });
      }
    });
    cue(st + 0.1, 'whoosh', { dur: 0.6, gain: 0.8 });
  }

  // ── 10 · MORAL: Ten years handed back. What will you choose? ─────────────
  {
    const st = cut(9);
    add({
      id: 'S10',
      at: st,
      cam: [540, 840],
      zoom: 0.15,
      note: 'Resolute pup stands tall, pushes pen away',
      draw(lt, d, t) {
        K.sceneWideStudy(t);
        K.drawContract(540, 1280, 0.75, false);
        // Pup standing confident and upright in center
        const talk = Math.abs(Math.sin(lt * 10)) * (lt < 2.0 ? 1 : 0);
        K.drawPup({ x: 540, y: 860, s: 1.8, pose: 'stand', talk, mouth: 'normal', eyeDir: 0 });
      }
    });
    cue(st + 0.1, 'slide', { dur: 0.6, gain: 0.7 });
    cue(st + 1.2, 'pop', { gain: 0.6 });
  }

  return { shots: S, cues: CUES };
}
