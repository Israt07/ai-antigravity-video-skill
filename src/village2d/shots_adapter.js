// Shots Adapter for Village 2D Style
// Maps every script line into a full village2d scene (background, characters, speech bubble, animations, grain, vignette).

import { ctx, clamp } from '../core/lib.js';
import { L, Le, T } from '../core/timing.js';
import { buildSceneSVG, animate } from './renderer.js';

export function buildVillage2dShots(script) {
  const S = [];
  const CUES = [];
  const add = o => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = i => (i === 0 ? 0 : L(i) - 0.06);

  const lines = script.lines || [];
  const totalLines = lines.length;

  // Offscreen helper image for rasterizing SVG onto 2D canvas
  const imgCache = new Map();

  for (let i = 0; i < totalLines; i++) {
    const line = lines[i];
    const st = cut(i);
    const end = i < totalLines - 1 ? cut(i + 1) : T.dur;
    const dur = end - st;
    const shotId = `scene_${String(i + 1).padStart(2, '0')}`;

    // Select background
    const bgName = line.scene?.background || line.background || (i % 2 === 0 ? 'house' : 'tea-stall');

    // Default characters if not custom configured
    const characters = line.scene?.characters || [
      {
        id: 'old_woman',
        age: 'elder',
        outfit: 'saree',
        hat: 'pallu',
        shirt: '#F8F9FA',
        pants: '#C62828',
        blouse: '#D4A373',
        glasses: true,
        baby: true,
        expr: line.expr || 'happy',
        anim: 'idle',
        x: 70,
        y: 880,
        scale: 2.3
      },
      {
        id: 'young_man',
        age: 'adult',
        outfit: 'shirt',
        shirt: i % 2 === 0 ? '#1E88E5' : '#43A047',
        pants: '#37474F',
        style: 'short',
        expr: line.expr || 'happy',
        anim: 'talk-still',
        x: 480,
        y: 880,
        scale: 2.35
      }
    ];

    const speakerId = line.speaker || (i % 2 === 0 ? 'young_man' : 'old_woman');
    const speakerX = speakerId === 'young_man' ? 720 : 320;
    const speakerY = speakerId === 'young_man' ? 1140 : 1160;

    // Register shot
    add({
      id: shotId,
      at: st,
      note: `Village 2D: ${line.text?.slice(0, 40) || ''}`,
      draw(lt, d, t, blit) {
        // Set animation states based on speech
        const activeLine = t >= L(i) && t <= Le(i);
        const charsForFrame = characters.map(c => ({
          ...c,
          anim: (c.id === speakerId && activeLine) ? 'talk-still' : 'idle'
        }));

        const dialogue = activeLine ? {
          text: line.text,
          speakerX,
          speakerY,
          start: L(i),
          end: Le(i),
          fontSize: 42
        } : null;

        const svgMarkup = buildSceneSVG({
          background: bgName,
          characters: charsForFrame,
          dialogue,
          t: lt,
          duration: d,
          grain: true,
          vignette: true,
          dissolveDuration: 0.18
        });

        // Draw directly to 2D canvas via SVG Image
        let img = imgCache.get(shotId);
        if (!img) {
          img = new Image();
          imgCache.set(shotId, img);
        }

        // SVG data URI
        const blobUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgMarkup);
        img.src = blobUrl;
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, 0, 0, 1080, 1920);
        }
      }
    });

    // Sound cues
    cue(st + 0.02, 'whoosh', { gain: 0.4 });
    if (line.text) {
      cue(L(i), 'pop', { gain: 0.5 });
    }
  }

  return { shots: S, cues: CUES };
}
