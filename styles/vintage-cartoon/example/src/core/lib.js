// Vintage Cartoon engine: canvas, palette, math and drawing primitives.
// 1930s rubber-hose ink cartoon look: dark grey/sepia/navy palette, two-tone shadows, warm lamp, moonlight.
export const W = 1080, H = 1920, FPS = 30;
export let ctx = null;
export function setCtx(c) { ctx = c; }

// 1930s Vintage Cartoon Palette
export const C = {
  ink: '#111216',
  white: '#FFFFFF',
  yellow: '#FFD43B', // keyword caption
  // Dark grey / sepia / navy palette
  darkGrey: '#181A22',
  darkGreyShade: '#101117',
  midGrey: '#323544',
  lightGrey: '#7E8597',
  sepiaCream: '#F2EBD9',
  sepiaPaper: '#E5D7B7',
  sepiaShade: '#B8A480',
  sepiaDark: '#3A2B1B',
  navyDark: '#0D131F',
  navyMid: '#1A2438',
  navyLight: '#2C3B59',
  // Warm lamp light
  lampAmber: '#E89D30',
  lampGlow: 'rgba(232, 157, 48, 0.32)',
  lampLight: '#FFE196',
  // Moonlit night window
  moonlight: '#E6EFFF',
  moonGlow: 'rgba(230, 239, 255, 0.22)',
  // Two-tone shadow tones
  shadowNavy: '#0A0F18',
  shadowGrey: '#14151B',
  // Wolf pinstripe suit
  wolfSuit: '#20222A',
  wolfSuitShade: '#16171E',
  wolfPinstripe: '#383B47',
  wolfTie: '#942D2D',
  wolfTieShade: '#6B1E1E',
  // Pup sweater & overalls
  pupCream: '#EDE5D0',
  pupStripe: '#A23434',
  pupStripeShade: '#782222',
  pupOveralls: '#34465E',
  pupOverallsShade: '#243245',
  pupBrass: '#C49438'
};

// ---------- math ----------
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));
export const eo = (t) => 1 - Math.pow(1 - t, 3);
export const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const eob = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const TAU = Math.PI * 2;

// ---------- primitives ----------
export function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
export function circle(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = fill; ctx.fill(); }
export function ell(x, y, rx, ry, fill, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); ctx.fillStyle = fill; ctx.fill(); }
export function line(pts, color, w) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
}
export function fillAll(color) { ctx.fillStyle = color; ctx.fillRect(-300, -300, W + 600, H + 600); }
export function bigText(text, x, y, size, fill = C.white, rot = 0, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.font = `900 ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.2; ctx.strokeStyle = C.ink; ctx.strokeText(text, 0, 0); ctx.fillStyle = fill; ctx.fillText(text, 0, 0);
  ctx.restore();
}
