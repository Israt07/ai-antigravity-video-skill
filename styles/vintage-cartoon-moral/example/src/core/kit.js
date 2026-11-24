// 1930s Vintage Cartoon Moral style kit
// Rubber-hose characters (Wolf tempter, Pup victim), warm deal vs cold regret rooms,
// iris transitions, Ken Burns motion, and authentic post-effects (scanlines, grain, dust, vignette, flicker).
import { ctx, W, H, C as BaseC, clamp, lerp, seg, eo, eio, eob } from './lib.js';

export const C = {
  ...BaseC,
  ink: '#111215',
  charcoal: '#22242A',
  charcoalDark: '#17181D',
  grey: '#4E525E',
  lightGrey: '#959AA7',
  cream: '#F4EEDB',
  sepiaParchment: '#E8D8B5',
  sepiaDark: '#3A2B1E',
  // Warm Deal palette
  warmBg: '#1B140E',
  warmDesk: '#382212',
  amberLamp: '#E89F30',
  amberGlow: 'rgba(232, 159, 48, 0.28)',
  moon: '#FFF4CF',
  // Cold Regret palette
  coldBg: '#10151E',
  coldDesk: '#232C3A',
  coldWall: '#1A212E',
  coldGlow: 'rgba(84, 154, 196, 0.22)',
  phoneCyan: '#6AD1E3',
  phoneGlow: 'rgba(106, 209, 227, 0.35)',
  // Character Accents
  wolfSuit: '#202228',
  wolfPinstripe: '#363944',
  wolfTie: '#9E3232',
  pupSweaterCream: '#EDE4CA',
  pupSweaterStripe: '#A43838',
  pupOveralls: '#3D5068',
  pupOverallsBrass: '#C49339'
};

// ---------------------------------------------------------------------------
// POST EFFECTS: Scanlines, Film Grain, Dust Specks, Vignette, Flicker, Color Tint
// ---------------------------------------------------------------------------
export function applyVintagePostEffects(t, mood = 'warm') {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // 1. Subtle brightness flicker (±3%)
  const flicker = 1.0 + (Math.sin(t * 73.1) * 0.018 + Math.cos(t * 127.3) * 0.014);
  if (Math.abs(flicker - 1.0) > 0.005) {
    ctx.fillStyle = flicker > 1.0 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
    ctx.fillRect(0, 0, W, H);
  }

  // 2. Horizontal scanlines overlay (subtle low opacity)
  ctx.fillStyle = 'rgba(10, 12, 16, 0.07)';
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 1.5);
  }

  // 3. Procedural Film Grain & Dust / Hair fibers
  const frameSeed = Math.floor(t * 24); // 24fps jitter
  const pseudoRand = (n) => {
    const x = Math.sin(frameSeed * 91.34 + n * 47.12) * 43758.5453;
    return x - Math.floor(x);
  };

  // 4-6 random dust specks per frame
  for (let i = 0; i < 5; i++) {
    const dx = pseudoRand(i * 3 + 1) * W;
    const dy = pseudoRand(i * 3 + 2) * H;
    const size = 1.2 + pseudoRand(i * 3 + 3) * 2.8;
    ctx.fillStyle = pseudoRand(i) > 0.35 ? 'rgba(240, 235, 220, 0.22)' : 'rgba(15, 15, 15, 0.3)';
    ctx.beginPath();
    ctx.arc(dx, dy, size, 0, Math.PI * 2);
    ctx.fill();
    // Occasional tiny hair scratch
    if (i === 0 && pseudoRand(99) > 0.5) {
      ctx.strokeStyle = 'rgba(235, 230, 215, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx + (pseudoRand(10) - 0.5) * 40, dy + pseudoRand(11) * 35);
      ctx.stroke();
    }
  }

  // 4. Mood Color Grade Tint
  if (mood === 'warm') {
    ctx.fillStyle = 'rgba(220, 150, 45, 0.055)';
    ctx.fillRect(0, 0, W, H);
  } else if (mood === 'cold') {
    ctx.fillStyle = 'rgba(45, 85, 135, 0.085)';
    ctx.fillRect(0, 0, W, H);
  }

  // 5. Strong Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.28, W / 2, H / 2, H * 0.72);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(0.7, 'rgba(12, 10, 8, 0.38)');
  vig.addColorStop(1, 'rgba(6, 5, 4, 0.82)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// TRANSITIONS: Oval Iris-In, Iris-Out, Fade to Black
// ---------------------------------------------------------------------------
export function drawIris(progress, type = 'in', cx = 540, cy = 960) {
  // progress: 0 -> 1.
  // 'in': starts tiny around subject and expands outward to reveal scene.
  // 'out': starts huge and shrinks down to darkness.
  const p = clamp(progress, 0, 1);
  const maxR = Math.hypot(W, H) * 0.65;
  const radius = type === 'in' ? eio(p) * maxR : (1 - eio(p)) * maxR;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#0B0C0E';
  ctx.beginPath();
  // Outer fullscreen rect
  ctx.rect(0, 0, W, H);
  // Inner oval hole (anticlockwise to cutout)
  ctx.ellipse(cx, cy, Math.max(0.1, radius * 0.9), Math.max(0.1, radius * 1.15), 0, Math.PI * 2, 0, true);
  ctx.fill();

  // Ink ring around iris boundary
  if (radius > 5 && radius < maxR * 0.98) {
    ctx.strokeStyle = '#181A20';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 0.9, radius * 1.15, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// 1930s RUBBER-HOSE CHARACTERS: The Wolf (Tempter) & The Pup (Victim)
// ---------------------------------------------------------------------------

/**
 * Draw The Wolf (Tempter) in 1930s rubber-hose style
 * Pinstripe suit, red tie, sharp muzzle, cunning pie-eyes, toothy grin, white 3-dart gloves
 */
export function drawWolf(x, y, scale = 1.0, opts = {}) {
  const {
    pose = 'stand', // 'stand', 'lean', 'point', 'whisper', 'grin-close'
    eyeDir = 0,    // -1 (left), 0 (center), 1 (right)
    teeth = true,
    wink = false,
    armL = 0,
    armR = 0
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // 1. Torso & Suit Coat (Charcoal Pinstripe)
  ctx.fillStyle = C.wolfSuit;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 10;

  // Body curved rubber-hose lean
  ctx.beginPath();
  ctx.moveTo(-50, 40);
  ctx.quadraticCurveTo(-70, 180, -45, 260);
  ctx.lineTo(45, 260);
  ctx.quadraticCurveTo(70, 180, 50, 40);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Subtle pinstripes
  ctx.strokeStyle = C.wolfPinstripe;
  ctx.lineWidth = 3;
  for (let px = -35; px <= 35; px += 18) {
    ctx.beginPath();
    ctx.moveTo(px * 0.9, 45);
    ctx.quadraticCurveTo(px * 1.1, 150, px, 255);
    ctx.stroke();
  }

  // White collared shirt V
  ctx.fillStyle = C.cream;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-25, 40);
  ctx.lineTo(0, 100);
  ctx.lineTo(25, 40);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Muted red tie
  ctx.fillStyle = C.wolfTie;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-8, 55);
  ctx.lineTo(8, 55);
  ctx.lineTo(14, 140);
  ctx.lineTo(0, 165);
  ctx.lineTo(-14, 140);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Tie knot
  ctx.beginPath();
  ctx.arc(0, 58, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 2. Head & Wolf Ears
  // Pointed wolf ears
  ctx.fillStyle = C.wolfSuit;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 9;
  // Left ear
  ctx.beginPath();
  ctx.moveTo(-45, -50);
  ctx.quadraticCurveTo(-95, -120, -75, -165);
  ctx.quadraticCurveTo(-30, -135, -20, -70);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Inner left ear
  ctx.fillStyle = '#423838';
  ctx.beginPath();
  ctx.moveTo(-45, -60);
  ctx.quadraticCurveTo(-75, -120, -65, -145);
  ctx.quadraticCurveTo(-35, -125, -28, -75);
  ctx.fill();

  // Right ear
  ctx.fillStyle = C.wolfSuit;
  ctx.beginPath();
  ctx.moveTo(45, -50);
  ctx.quadraticCurveTo(95, -120, 75, -165);
  ctx.quadraticCurveTo(30, -135, 20, -70);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Inner right ear
  ctx.fillStyle = '#423838';
  ctx.beginPath();
  ctx.moveTo(45, -60);
  ctx.quadraticCurveTo(75, -120, 65, -145);
  ctx.quadraticCurveTo(35, -125, 28, -75);
  ctx.fill();

  // Main Head Shape (Sharp jaw, prominent muzzle)
  ctx.fillStyle = C.wolfSuit;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.ellipse(0, -35, 58, 52, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Cheek fur tufts (vintage rubber-hose sharp tufts)
  ctx.beginPath();
  ctx.moveTo(-52, -20);
  ctx.lineTo(-85, -10);
  ctx.lineTo(-54, 5);
  ctx.lineTo(-78, 18);
  ctx.lineTo(-45, 30);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(52, -20);
  ctx.lineTo(85, -10);
  ctx.lineTo(54, 5);
  ctx.lineTo(78, 18);
  ctx.lineTo(45, 30);
  ctx.stroke();

  // Long sharp wolf muzzle / snout
  ctx.fillStyle = C.charcoal;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-35, -10);
  ctx.quadraticCurveTo(0, -35, 45, -10);
  ctx.quadraticCurveTo(65, 25, 30, 45);
  ctx.quadraticCurveTo(0, 52, -25, 45);
  ctx.quadraticCurveTo(-50, 20, -35, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Black nose tip
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.ellipse(5, 5, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Wide Grinning Mouth with Sharp Teeth
  ctx.fillStyle = C.ink;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-45, 18);
  ctx.quadraticCurveTo(5, 75, 55, 18);
  ctx.quadraticCurveTo(5, 32, -45, 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  if (teeth) {
    // Sharp triangle teeth along top and bottom
    ctx.fillStyle = C.cream;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 3;
    const toothXs = [-30, -15, 0, 15, 30, 45];
    toothXs.forEach((tx) => {
      // Top teeth
      ctx.beginPath();
      ctx.moveTo(tx - 6, 22);
      ctx.lineTo(tx, 34);
      ctx.lineTo(tx + 6, 22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Bottom teeth
      ctx.beginPath();
      ctx.moveTo(tx - 5, 52);
      ctx.lineTo(tx, 40);
      ctx.lineTo(tx + 5, 52);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }

  // 4. Vintage Pie-Eyes (Pac-Man 1930s slit)
  ctx.fillStyle = C.cream;
  ctx.lineWidth = 7;

  // Left Eye
  ctx.beginPath();
  ctx.ellipse(-24, -45, 15, 22, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Left Pupil with pie wedge cutout
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.arc(-22 + eyeDir * 3, -45, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.cream;
  ctx.beginPath();
  ctx.moveTo(-22 + eyeDir * 3, -45);
  ctx.lineTo(-22 + eyeDir * 3 - 9, -52);
  ctx.lineTo(-22 + eyeDir * 3 - 3, -56);
  ctx.closePath();
  ctx.fill();

  // Right Eye (or Wink)
  if (wink) {
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(24, -45, 14, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
  } else {
    ctx.fillStyle = C.cream;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.ellipse(24, -45, 15, 22, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = C.ink;
    ctx.beginPath();
    ctx.arc(24 + eyeDir * 3, -45, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.cream;
    ctx.beginPath();
    ctx.moveTo(24 + eyeDir * 3, -45);
    ctx.lineTo(24 + eyeDir * 3 - 9, -52);
    ctx.lineTo(24 + eyeDir * 3 - 3, -56);
    ctx.closePath();
    ctx.fill();
  }

  // Cunning angled eyebrows
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-38, -72);
  ctx.lineTo(-12, -62);
  ctx.moveTo(12, -62);
  ctx.lineTo(38, -72);
  ctx.stroke();

  // 5. Rubber-Hose Arms & 3-Dart Cartoon Gloves
  ctx.strokeStyle = C.wolfSuit;
  ctx.lineWidth = 26;

  // Left arm
  ctx.beginPath();
  ctx.moveTo(-45, 80);
  ctx.quadraticCurveTo(-110, 130 + armL * 20, -120, 200 + armL * 30);
  ctx.stroke();

  // Right arm (often pointing or gesturing forward)
  ctx.beginPath();
  ctx.moveTo(45, 80);
  if (pose === 'point') {
    ctx.quadraticCurveTo(110, 110, 160, 140);
  } else {
    ctx.quadraticCurveTo(110, 130 + armR * 20, 120, 200 + armR * 30);
  }
  ctx.stroke();

  // Cartoon White Gloves
  drawCartoonGlove(-120, 200 + armL * 30, 0.85, 0.3);
  if (pose === 'point') {
    drawCartoonGlove(160, 140, 0.95, -0.6, true);
  } else {
    drawCartoonGlove(120, 200 + armR * 30, 0.85, -0.3);
  }

  ctx.restore();
}

/**
 * Draw The Pup (Victim) in 1930s rubber-hose style
 * Floppy ears, cream & muted red striped sweater, denim blue overalls, round pie-eyes
 */
export function drawPup(x, y, scale = 1.0, opts = {}) {
  const {
    pose = 'sit',    // 'sit', 'hesitate', 'sign', 'tired', 'slump', 'awake-phone'
    mood = 'normal', // 'normal', 'worried', 'sad', 'exhausted'
    eyeDir = 0,
    headTilt = 0
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // 1. Torso: Striped Sweater + Overalls
  // Sweater base
  ctx.fillStyle = C.pupSweaterCream;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(-42, 20, 84, 110, 24);
  ctx.fill();
  ctx.stroke();

  // Muted red horizontal stripes
  ctx.fillStyle = C.pupSweaterStripe;
  [38, 62, 86, 110].forEach((sy) => {
    ctx.fillRect(-38, sy, 76, 12);
  });

  // Denim Blue Overalls (bib + pants)
  ctx.fillStyle = C.pupOveralls;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-36, 75);
  ctx.lineTo(36, 75);
  ctx.lineTo(44, 175);
  ctx.lineTo(-44, 175);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Shoulder straps with brass buttons
  ctx.lineWidth = 14;
  ctx.strokeStyle = C.pupOveralls;
  ctx.beginPath();
  ctx.moveTo(-28, 25);
  ctx.lineTo(-24, 80);
  ctx.moveTo(28, 25);
  ctx.lineTo(24, 80);
  ctx.stroke();

  // Brass buttons
  ctx.fillStyle = C.pupOverallsBrass;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(-24, 76, 6, 0, Math.PI * 2);
  ctx.arc(24, 76, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 2. Head with tilt
  ctx.save();
  ctx.translate(0, 10);
  ctx.rotate(headTilt);

  // Floppy hound ears (drooping down on both sides)
  ctx.fillStyle = '#2A2522';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  // Left ear
  ctx.beginPath();
  ctx.moveTo(-36, -30);
  ctx.quadraticCurveTo(-80, 0, -68, 70);
  ctx.quadraticCurveTo(-45, 75, -34, 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Right ear
  ctx.beginPath();
  ctx.moveTo(36, -30);
  ctx.quadraticCurveTo(80, 0, 68, 70);
  ctx.quadraticCurveTo(45, 75, 34, 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Round Pup Head
  ctx.fillStyle = C.cream;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.ellipse(0, -25, 48, 44, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Soft brown ear patches / face patch
  ctx.fillStyle = '#5A4638';
  ctx.beginPath();
  ctx.arc(-26, -40, 20, 0, Math.PI * 2);
  ctx.arc(32, -36, 16, 0, Math.PI * 2);
  ctx.fill();

  // Snout / Muzzle
  ctx.fillStyle = '#FFF8EB';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, -6, 26, 19, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Small black button nose
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.ellipse(0, -14, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.lineWidth = 5;
  ctx.strokeStyle = C.ink;
  ctx.beginPath();
  if (mood === 'sad' || mood === 'exhausted') {
    ctx.arc(0, 8, 12, Math.PI * 1.15, Math.PI * 1.85); // Downturned frown
  } else if (mood === 'worried') {
    ctx.moveTo(-12, 2);
    ctx.quadraticCurveTo(0, -3, 12, 2); // Wobbly straight line
  } else {
    ctx.arc(0, -4, 12, Math.PI * 0.15, Math.PI * 0.85); // Gentle smile
  }
  ctx.stroke();

  // 3. Eyes: Expressive 1930s Pie-Eyes
  ctx.fillStyle = C.cream;
  ctx.lineWidth = 7;
  // Left eye
  ctx.beginPath();
  ctx.ellipse(-18, -32, 14, 19, -0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Right eye
  ctx.beginPath();
  ctx.ellipse(18, -32, 14, 19, 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Pupils (with pie cutout)
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.arc(-18 + eyeDir * 3, -32, 9, 0, Math.PI * 2);
  ctx.arc(18 + eyeDir * 3, -32, 9, 0, Math.PI * 2);
  ctx.fill();

  // Pie cutouts
  ctx.fillStyle = C.cream;
  [-18 + eyeDir * 3, 18 + eyeDir * 3].forEach((px) => {
    ctx.beginPath();
    ctx.moveTo(px, -32);
    ctx.lineTo(px - 8, -38);
    ctx.lineTo(px - 3, -41);
    ctx.closePath();
    ctx.fill();
  });

  // Tired / Hollow Eye Bags (for Cold Regret scenes)
  if (mood === 'exhausted' || mood === 'sad') {
    ctx.strokeStyle = 'rgba(25, 20, 20, 0.65)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(-18, -19, 12, Math.PI * 0.1, Math.PI * 0.9);
    ctx.arc(18, -19, 12, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();
  }

  // Eyebrows
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (mood === 'worried' || mood === 'sad') {
    ctx.moveTo(-28, -50);
    ctx.lineTo(-10, -56);
    ctx.moveTo(28, -50);
    ctx.lineTo(10, -56);
  } else {
    ctx.moveTo(-26, -54);
    ctx.quadraticCurveTo(-18, -60, -10, -54);
    ctx.moveTo(10, -54);
    ctx.quadraticCurveTo(18, -60, 26, -54);
  }
  ctx.stroke();

  ctx.restore(); // Head restore

  // 4. Arms & Cartoon Gloves
  ctx.strokeStyle = C.pupSweaterCream;
  ctx.lineWidth = 20;

  if (pose === 'hesitate') {
    // Hands clutched together or clutching ear
    ctx.beginPath();
    ctx.moveTo(-35, 45);
    ctx.quadraticCurveTo(-65, 80, -15, 105);
    ctx.moveTo(35, 45);
    ctx.quadraticCurveTo(65, 80, 15, 105);
    ctx.stroke();
    drawCartoonGlove(0, 110, 0.8, 0);
  } else if (pose === 'sign') {
    // Left hand holding paper, right hand holding quill/pen
    ctx.beginPath();
    ctx.moveTo(-35, 45);
    ctx.quadraticCurveTo(-60, 95, -45, 130);
    ctx.moveTo(35, 45);
    ctx.quadraticCurveTo(60, 95, 45, 130);
    ctx.stroke();
    drawCartoonGlove(-45, 130, 0.8, -0.4);
    drawCartoonGlove(45, 130, 0.8, 0.4);
  } else {
    // Default resting arms
    ctx.beginPath();
    ctx.moveTo(-35, 45);
    ctx.quadraticCurveTo(-55, 95, -40, 140);
    ctx.moveTo(35, 45);
    ctx.quadraticCurveTo(55, 95, 40, 140);
    ctx.stroke();
    drawCartoonGlove(-40, 140, 0.75, 0);
    drawCartoonGlove(40, 140, 0.75, 0);
  }

  ctx.restore();
}

/**
 * Standard 1930s 3-Dart Cartoon White Glove
 */
export function drawCartoonGlove(x, y, scale = 1.0, rot = 0, pointing = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(scale, scale);

  ctx.fillStyle = C.cream;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 7;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Glove cuff / wrist roll
  ctx.beginPath();
  ctx.ellipse(0, 18, 20, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Palm
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Fingers
  if (pointing) {
    // Extended index finger
    ctx.beginPath();
    ctx.roundRect(10, -10, 32, 14, 7);
    ctx.fill();
    ctx.stroke();
    // Curled thumb & fingers
    ctx.beginPath();
    ctx.arc(-8, -12, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    // Rounded mitten fingers
    [-10, 0, 10].forEach((fx) => {
      ctx.beginPath();
      ctx.ellipse(fx, -18, 7, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    // Thumb
    ctx.beginPath();
    ctx.ellipse(-18, -4, 9, 12, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // 3 Black Darts on back of glove
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 4;
  [-7, 0, 7].forEach((dx) => {
    ctx.beginPath();
    ctx.moveTo(dx, 4);
    ctx.lineTo(dx * 1.1, -8);
    ctx.stroke();
  });

  ctx.restore();
}

// ---------------------------------------------------------------------------
// ENVIRONMENTS: Warm Deal Room, Cold Office, Cold Bedroom Phone, Mirror
// ---------------------------------------------------------------------------

/**
 * Scene 1 / Deal: Dark study with warm amber desk lamp & crescent moon window
 */
export function drawWarmDealRoom(t, opts = {}) {
  // Deep dark warm brown background
  ctx.fillStyle = C.warmBg;
  ctx.fillRect(0, 0, W, H);

  // Arched antique window at top right
  ctx.save();
  ctx.fillStyle = '#0E131E';
  ctx.strokeStyle = '#2A1E14';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(680, 520);
  ctx.lineTo(680, 260);
  ctx.arc(810, 260, 130, Math.PI, 0);
  ctx.lineTo(940, 520);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Golden crescent moon in window
  ctx.fillStyle = C.moon;
  ctx.beginPath();
  ctx.arc(810, 240, 48, 0, Math.PI * 2);
  ctx.fill();
  // Cutout for crescent
  ctx.fillStyle = '#0E131E';
  ctx.beginPath();
  ctx.arc(825, 232, 45, 0, Math.PI * 2);
  ctx.fill();

  // Window mullions
  ctx.strokeStyle = '#2A1E14';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(810, 130);
  ctx.lineTo(810, 520);
  ctx.moveTo(680, 320);
  ctx.lineTo(940, 320);
  ctx.stroke();
  ctx.restore();

  // Heavy mahogany desk surface at bottom
  ctx.fillStyle = C.warmDesk;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(-20, 1260);
  ctx.lineTo(W + 20, 1260);
  ctx.lineTo(W + 20, H + 20);
  ctx.lineTo(-20, H + 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Banker's Brass Oil Lamp with warm amber radial cone
  const lampX = 220, lampY = 980;
  const cone = ctx.createRadialGradient(lampX, lampY, 30, lampX, lampY, 780);
  cone.addColorStop(0, 'rgba(238, 168, 52, 0.42)');
  cone.addColorStop(0.4, 'rgba(232, 159, 48, 0.22)');
  cone.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.arc(lampX, lampY, 820, 0, Math.PI * 2);
  ctx.fill();

  // Lamp hardware
  ctx.fillStyle = '#7A5418';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.ellipse(lampX, 1260, 48, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(lampX, 1260);
  ctx.lineTo(lampX, lampY + 30);
  ctx.stroke();
  // Glass shade
  ctx.fillStyle = C.amberLamp;
  ctx.beginPath();
  ctx.ellipse(lampX, lampY, 54, 32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

/**
 * Close-up of Parchment Contract & Pen on Desk
 */
export function drawContract(x, y, scale = 1.0, signed = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Aged yellowed parchment with curled corners
  ctx.fillStyle = C.sepiaParchment;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-180, -220);
  ctx.lineTo(170, -230);
  ctx.lineTo(190, 210);
  ctx.lineTo(-170, 230);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Scribbled contract text lines
  ctx.fillStyle = C.sepiaDark;
  ctx.fillRect(-140, -180, 260, 10);
  ctx.fillRect(-140, -150, 240, 7);
  ctx.fillRect(-140, -125, 270, 7);
  ctx.fillRect(-140, -100, 230, 7);
  ctx.fillRect(-140, -75, 250, 7);
  ctx.fillRect(-140, -50, 180, 7);

  // Red wax seal at bottom left
  ctx.fillStyle = '#8B2525';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(-90, 140, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Signature line
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 150);
  ctx.lineTo(140, 150);
  ctx.stroke();

  ctx.fillStyle = C.charcoal;
  ctx.font = '700 24px monospace';
  ctx.fillText('X ____________', -10, 144);

  // Signature in ink
  if (signed) {
    ctx.strokeStyle = '#12162A';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(20, 140);
    ctx.quadraticCurveTo(45, 115, 60, 142);
    ctx.quadraticCurveTo(80, 120, 115, 138);
    ctx.stroke();
  }

  // Golden fountain pen
  ctx.fillStyle = '#C89632';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 6;
  ctx.save();
  ctx.translate(110, 60);
  ctx.rotate(-0.65);
  ctx.beginPath();
  ctx.roundRect(-8, -90, 16, 120, 6);
  ctx.fill();
  ctx.stroke();
  // Gold nib
  ctx.fillStyle = '#E8BD52';
  ctx.beginPath();
  ctx.moveTo(-7, 30);
  ctx.lineTo(0, 52);
  ctx.lineTo(7, 30);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

/**
 * Scene: Cold Regret Office Cubicle
 */
export function drawColdOffice(t, opts = {}) {
  ctx.fillStyle = C.coldBg;
  ctx.fillRect(0, 0, W, H);

  // Cold drab office cubicle partition walls
  ctx.fillStyle = C.coldWall;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 10;
  ctx.fillRect(100, 300, 880, 960);
  ctx.strokeRect(100, 300, 880, 960);

  // Overhead buzzing fluorescent tube
  ctx.fillStyle = '#CFE5F0';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(320, 140, 440, 32, 10);
  ctx.fill();
  ctx.stroke();

  // Fluorescent cold cone
  const cone = ctx.createLinearGradient(540, 160, 540, 1200);
  cone.addColorStop(0, 'rgba(160, 210, 235, 0.25)');
  cone.addColorStop(0.6, 'rgba(130, 180, 210, 0.08)');
  cone.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(340, 172);
  ctx.lineTo(120, 1260);
  ctx.lineTo(960, 1260);
  ctx.lineTo(740, 172);
  ctx.closePath();
  ctx.fill();

  // Gray metal desk with towering paperwork stacks
  ctx.fillStyle = C.coldDesk;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, 1260);
  ctx.lineTo(W, 1260);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Paperwork towers
  ctx.fillStyle = '#C2C8D2';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 6;
  for (let i = 0; i < 9; i++) {
    ctx.strokeRect(180 + (i % 2) * 8, 1240 - i * 22, 190, 20);
    ctx.fillRect(180 + (i % 2) * 8, 1240 - i * 22, 190, 20);
  }
}

/**
 * Scene: Cold Bedroom Screen Glow (Late Night Phone)
 */
export function drawColdBedroomPhone(t, opts = {}) {
  ctx.fillStyle = '#090C12';
  ctx.fillRect(0, 0, W, H);

  // Digital clock showing 03:00 in red
  ctx.fillStyle = 'rgba(190, 40, 40, 0.85)';
  ctx.font = '700 48px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('03:00 AM', 820, 380);

  // Bed pillows and blanket
  ctx.fillStyle = '#181F2A';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.ellipse(540, 1160, 380, 140, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glowing smartphone in hands casting cyan cone
  const phoneX = 540, phoneY = 960;
  const pGlow = ctx.createRadialGradient(phoneX, phoneY, 15, phoneX, phoneY, 440);
  pGlow.addColorStop(0, C.phoneGlow);
  pGlow.addColorStop(0.5, 'rgba(106, 209, 227, 0.12)');
  pGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = pGlow;
  ctx.beginPath();
  ctx.arc(phoneX, phoneY, 460, 0, Math.PI * 2);
  ctx.fill();

  // Smartphone body
  ctx.fillStyle = '#0F131A';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.roundRect(phoneX - 60, phoneY - 100, 120, 200, 16);
  ctx.fill();
  ctx.stroke();

  // Screen
  ctx.fillStyle = C.phoneCyan;
  ctx.beginPath();
  ctx.roundRect(phoneX - 52, phoneY - 90, 104, 180, 8);
  ctx.fill();
}

/**
 * Scene: Mirror & Vintage Yellowed Photograph
 */
export function drawMirrorWithPhoto(t, opts = {}) {
  ctx.fillStyle = C.coldBg;
  ctx.fillRect(0, 0, W, H);

  // Antique oval bathroom mirror frame
  ctx.fillStyle = '#1A212E';
  ctx.strokeStyle = '#323C4C';
  ctx.lineWidth = 28;
  ctx.beginPath();
  ctx.ellipse(540, 720, 360, 460, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glass reflection
  ctx.fillStyle = '#222A38';
  ctx.beginPath();
  ctx.ellipse(540, 720, 340, 440, 0, 0, Math.PI * 2);
  ctx.fill();

  // Small sepia photograph held in hand
  ctx.save();
  ctx.translate(540, 1260);
  ctx.rotate(-0.08);

  ctx.fillStyle = '#FAF5E8';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(-150, -190, 300, 380, 12);
  ctx.fill();
  ctx.stroke();

  // Photo image area (Sepia)
  ctx.fillStyle = '#E4D5B4';
  ctx.fillRect(-130, -170, 260, 300);

  // Smiling mini pup portrait inside photo
  drawPup(0, -20, 0.95, { pose: 'stand', mood: 'normal' });

  ctx.restore();
}
