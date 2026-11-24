// Timing: everything on screen is placed on the narration's clock.
//   data/lines.json  { duration, lines: [{ i, text, start, end }] }   (voice.py, or estimate.py for captions-only)
//   data/words.json  [{ w, line, s, e }]                                (words.py, or estimate.py)
// L(i) = line i start · Le(i) = line i end · Wd(word, line) = start of matching word (falls back gracefully)
export const T = { dur: 0, lines: [], words: [] };
const norm = (w) => String(w).toLowerCase().replace(/[^a-z0-9']+/g, '');

export async function loadTiming() {
  const get = async (f) => {
    const r = await fetch(f, { cache: 'no-store' });
    if (!r.ok) throw new Error('missing ' + f + ': run voice.py + words.py');
    return r.json();
  };
  const lines = await get('data/lines.json'), words = await get('data/words.json');
  T.lines = lines.lines || [];
  T.words = words || [];
  T.dur = lines.duration || 0;
  return T;
}

export const L = (i) => {
  if (!T.lines || T.lines.length === 0) return Math.max(0, i * 2);
  if (i < 0) return 0;
  if (i < T.lines.length) return T.lines[i].start;
  const last = T.lines[T.lines.length - 1];
  const base = last ? last.end : 0;
  return base + (i - T.lines.length + 1) * 0.5;
};

export const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);

export const Le = (i) => {
  if (!T.lines || T.lines.length === 0) return Math.max(0.5, (i + 1) * 2);
  if (i < 0) return 0;
  if (i < T.lines.length) return T.lines[i].end;
  return L(i) + 0.5;
};

export function Wd(word, line, which = 's') {
  const n = norm(word);
  const hit = (T.words || []).find((w) => (line == null || w.line === line) && norm(w.w).startsWith(n));
  if (hit) return hit[which];
  const anyHit = (T.words || []).find((w) => norm(w.w).startsWith(n));
  if (anyHit) return anyHit[which];
  if (line != null && T.lines && T.lines[line]) {
    const l = T.lines[line];
    return which === 'e' ? l.end : l.start + (l.end - l.start) * 0.5;
  }
  return L(line == null ? 0 : line) + 0.2;
}

export const lineWords = (i) => (T.words || []).filter((w) => w.line === i);
