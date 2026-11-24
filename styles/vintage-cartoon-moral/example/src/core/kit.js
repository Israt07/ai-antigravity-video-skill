// 1930s Vintage Cartoon Moral style kit
// Rubber-hose characters: The Fox (Tavern Keeper tempter) & The Rabbit (Traveler victim)
// Warm Crossroads Inn vs Cold Highway Diner & Train Platform
// Iris transitions, Ken Burns motion, and authentic post-effects (scanlines, grain, dust, vignette, flicker).
import { ctx, W, H, C as BaseC, clamp, lerp, seg, eo, eio, eob } from './lib.js';

export const C = {
  ...BaseC,
  ink: '#111215',
  charcoal: '#22242A',
  charcoalDark: '#16171C',
  grey: '#4E525E',
  lightGrey: '#989EA9',
  cream: '#F5EEDB',
  sepiaParchment: '#E6D7B3',
  sepiaDark: '#3A2A1C',

  // Warm Inn palette
  warmBg: '#1C130D',
  warmWood: '#362113',
  warmCounter: '#442A18',
  amberLamp: '#E89F30',
  amberGlow: 'rgba(232, 159, 48, 0.28)',
  stewGold: '#C97D20',
  stewBroth: '#6E3C12',
  moon: '#FFF3CF',

  // Cold Regret & Diner palette
  coldBg: '#0F141D',
  coldDinerWall: '#1A2330',
  coldCounter: '#273242',
  coldGlow: 'rgba(80, 150, 195, 0.22)',
  fluorescentTube: '#CFE6F2',
  phoneCyan: '#6AD1E3',
  phoneGlow: 'rgba(106, 209, 227, 0.35)',

  // Fox Tavern Keeper Accents
  foxFur: '#A34F23',
  foxFurDark: '#6E3012',
  foxMuzzle: '#F6EEDB',
  foxVest: '#272930',
  foxVestStripe: '#3A3E48',
  foxApron: '#E5DDC9',
  foxApronStain: '#9E7E5A',
  foxBowler: '#1B1C22',
  foxBowlerBand: '#8B2C2C',

  // Rabbit Traveler Accents
  rabbitFur: '#ECDDC4',
  rabbitEarInner: '#D99898',
  rabbitCoat: '#46553F',
  rabbitCoatPatch: '#637859',
  rabbitScarf: '#A03232',
  rabbitBag: '#5E3D24',
  rabbitBagStrap: '#422A17'
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
  const p = clamp(progress, 0, 1);
  const maxR = Math.hypot(W, H) * 0.65;
  const radius = type === 'in' ? eio(p) * maxR : (1 - eio(p)) * maxR;

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#0B0C0E';
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
  ctx.ellipse(cx, cy, Math.max(0.1, radius * 0.9), Math.max(0.1, radius * 1.15), 0, Math.PI * 2, 0, true);
  ctx.fill();

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
// 1930s RUBBER-HOSE CHARACTERS: The Fox & The Rabbit
// ---------------------------------------------------------------------------

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
  ctx.ellipse(0, 18, 22, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Palm
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Fingers
  if (pointing) {
    ctx.beginPath();
    ctx.roundRect(10, -10, 36, 15, 8);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-8, -12, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    [-11, 0, 11].forEach((fx) => {
      ctx.beginPath();
      ctx.ellipse(fx, -20, 8, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.ellipse(-20, -4, 10, 13, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // 3 Black Darts on back of glove
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 4;
  [-8, 0, 8].forEach((dx) => {
    ctx.beginPath();
    ctx.moveTo(dx, 4);
    ctx.lineTo(dx * 1.1, -9);
    ctx.stroke();
  });

  ctx.restore();
}

/**
 * Draw The Fox (Tavern Keeper Tempter)
 * Bowler hat, vest, apron, sly smirk with canine teeth, large readable pie-eyes
 */
export function drawFox(x, y, scale = 1.0, opts = {}) {
  const {
    pose = 'stand', // 'stand', 'lean', 'polish', 'slide', 'point'
    eyeDir = 0,    // -1, 0, 1
    wink = false,
    teeth = true,
    mouth = 'grin', // 'grin', 'smirk', 'speak'
    headTilt = 0,
    armL = 0,
    armR = 0
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // 1. Torso & Vest
  ctx.fillStyle = C.foxVest;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 10;

  ctx.beginPath();
  ctx.moveTo(-60, 50);
  ctx.quadraticCurveTo(-85, 200, -55, 290);
  ctx.lineTo(55, 290);
  ctx.quadraticCurveTo(85, 200, 60, 50);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Tavern Keeper Linen Apron (tied around waist)
  ctx.fillStyle = C.foxApron;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-50, 110);
  ctx.lineTo(50, 110);
  ctx.lineTo(58, 295);
  ctx.lineTo(-58, 295);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Apron front pocket
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 6;
  ctx.strokeRect(-32, 175, 64, 55);

  // 2. Head with tilt
  ctx.save();
  ctx.translate(0, 20);
  ctx.rotate(headTilt);

  // Fox Ears (tall, triangular with dark tips)
  ctx.fillStyle = C.foxFur;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 9;

  // Left ear
  ctx.beginPath();
  ctx.moveTo(-50, -60);
  ctx.lineTo(-95, -170);
  ctx.lineTo(-20, -110);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Dark ear tip
  ctx.fillStyle = C.foxBowler;
  ctx.beginPath();
  ctx.moveTo(-75, -135);
  ctx.lineTo(-95, -170);
  ctx.lineTo(-50, -145);
  ctx.closePath();
  ctx.fill();

  // Inner ear fluff
  ctx.fillStyle = C.cream;
  ctx.beginPath();
  ctx.moveTo(-45, -75);
  ctx.lineTo(-75, -125);
  ctx.lineTo(-30, -100);
  ctx.fill();

  // Right ear
  ctx.fillStyle = C.foxFur;
  ctx.strokeStyle = C.ink;
  ctx.beginPath();
  ctx.moveTo(50, -60);
  ctx.lineTo(95, -170);
  ctx.lineTo(20, -110);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = C.foxBowler;
  ctx.beginPath();
  ctx.moveTo(75, -135);
  ctx.lineTo(95, -170);
  ctx.lineTo(50, -145);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = C.cream;
  ctx.beginPath();
  ctx.moveTo(45, -75);
  ctx.lineTo(75, -125);
  ctx.lineTo(30, -100);
  ctx.fill();

  // Main Head Base (Rust Fox Fur)
  ctx.fillStyle = C.foxFur;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.ellipse(0, -35, 68, 60, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // White Cheeks Fur
  ctx.fillStyle = C.foxMuzzle;
  ctx.beginPath();
  ctx.moveTo(-60, -25);
  ctx.quadraticCurveTo(-95, 10, -50, 35);
  ctx.quadraticCurveTo(-20, 45, 0, 40);
  ctx.quadraticCurveTo(20, 45, 50, 35);
  ctx.quadraticCurveTo(95, 10, 60, -25);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Sharp Fox Snout
  ctx.fillStyle = C.foxFur;
  ctx.beginPath();
  ctx.moveTo(-28, -20);
  ctx.lineTo(0, 18);
  ctx.lineTo(28, -20);
  ctx.closePath();
  ctx.fill();

  // Black button nose
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.ellipse(0, 18, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mouth: Grinning with sharp canine teeth
  ctx.fillStyle = C.ink;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-45, 25);
  ctx.quadraticCurveTo(0, 65, 50, 22);
  ctx.quadraticCurveTo(0, 35, -45, 25);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  if (teeth) {
    ctx.fillStyle = C.cream;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 3;
    // Top sharp canines
    [-30, -15, 0, 15, 30].forEach((tx) => {
      ctx.beginPath();
      ctx.moveTo(tx - 6, 28);
      ctx.lineTo(tx, 40);
      ctx.lineTo(tx + 6, 28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }

  // Large Expressive 1930s Pie-Eyes
  ctx.fillStyle = C.cream;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;

  // Left Eye
  ctx.beginPath();
  ctx.ellipse(-26, -55, 18, 26, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Left Pupil with pie cutout
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.arc(-24 + eyeDir * 4, -55, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.cream;
  ctx.beginPath();
  ctx.moveTo(-24 + eyeDir * 4, -55);
  ctx.lineTo(-24 + eyeDir * 4 - 11, -64);
  ctx.lineTo(-24 + eyeDir * 4 - 4, -68);
  ctx.closePath();
  ctx.fill();

  // Right Eye (or Wink)
  if (wink) {
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(26, -55, 16, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
  } else {
    ctx.fillStyle = C.cream;
    ctx.strokeStyle = C.ink;
    ctx.beginPath();
    ctx.ellipse(26, -55, 18, 26, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = C.ink;
    ctx.beginPath();
    ctx.arc(26 + eyeDir * 4, -55, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.cream;
    ctx.beginPath();
    ctx.moveTo(26 + eyeDir * 4, -55);
    ctx.lineTo(26 + eyeDir * 4 - 11, -64);
    ctx.lineTo(26 + eyeDir * 4 - 4, -68);
    ctx.closePath();
    ctx.fill();
  }

  // Cunning angled eyebrows
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-44, -88);
  ctx.lineTo(-12, -76);
  ctx.moveTo(12, -76);
  ctx.lineTo(44, -88);
  ctx.stroke();

  // Black Bowler Hat sitting atop head
  ctx.fillStyle = C.foxBowler;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;

  // Hat Brim (curled ends)
  ctx.beginPath();
  ctx.ellipse(0, -90, 75, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Hat Dome
  ctx.beginPath();
  ctx.arc(0, -120, 48, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Red Hat Ribbon Band
  ctx.fillStyle = C.foxBowlerBand;
  ctx.fillRect(-48, -114, 96, 18);

  ctx.restore(); // restore head tilt

  // 3. Arms & White 3-Dart Gloves
  ctx.strokeStyle = C.foxVest;
  ctx.lineWidth = 26;

  // Left Arm
  ctx.beginPath();
  ctx.moveTo(-50, 90);
  ctx.quadraticCurveTo(-110, 140 + armL * 25, -125, 210 + armL * 30);
  ctx.stroke();
  drawCartoonGlove(-125, 210 + armL * 30, 0.9, 0.3);

  // Right Arm
  ctx.beginPath();
  ctx.moveTo(50, 90);
  if (pose === 'point') {
    ctx.quadraticCurveTo(120, 120, 175, 150);
  } else if (pose === 'slide') {
    ctx.quadraticCurveTo(110, 160, 130, 230);
  } else {
    ctx.quadraticCurveTo(110, 140 + armR * 25, 125, 210 + armR * 30);
  }
  ctx.stroke();

  if (pose === 'point') {
    drawCartoonGlove(175, 150, 1.0, -0.6, true);
  } else {
    drawCartoonGlove(125, 210 + armR * 30, 0.9, -0.3);
  }

  ctx.restore();
}

/**
 * Draw The Rabbit (Traveler Victim)
 * Large floppy ears, red knit scarf, patched olive coat, travel bag, expressive pie-eyes
 */
export function drawRabbit(x, y, scale = 1.0, opts = {}) {
  const {
    pose = 'stand', // 'stand', 'shiver', 'sit', 'clutch', 'slump'
    mood = 'normal', // 'normal', 'cold', 'worried', 'tired', 'determined'
    eyeDir = 0,
    headTilt = 0,
    armL = 0,
    armR = 0,
    hasBag = true
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // 1. Torso: Olive Green Travel Coat with Patches
  ctx.fillStyle = C.rabbitCoat;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 9;

  ctx.beginPath();
  ctx.moveTo(-48, 40);
  ctx.quadraticCurveTo(-65, 150, -42, 220);
  ctx.lineTo(42, 220);
  ctx.quadraticCurveTo(65, 150, 48, 40);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Coat stitches & patch
  ctx.fillStyle = C.rabbitCoatPatch;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(14, 130, 26, 28, 4);
  ctx.fill();
  ctx.stroke();

  // Brass buttons down coat
  ctx.fillStyle = '#C89A38';
  ctx.lineWidth = 3;
  [85, 125, 165, 200].forEach((by) => {
    ctx.beginPath();
    ctx.arc(0, by, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // Knitted Crimson Red Scarf
  ctx.fillStyle = C.rabbitScarf;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;

  // Scarf loop around neck
  ctx.beginPath();
  ctx.ellipse(0, 32, 54, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Scarf trailing tail hanging down
  ctx.beginPath();
  ctx.roundRect(-22, 38, 22, 95, 8);
  ctx.fill();
  ctx.stroke();

  // Travel Satchel strap crossing chest
  if (hasBag) {
    ctx.strokeStyle = C.rabbitBagStrap;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(-45, 45);
    ctx.lineTo(40, 180);
    ctx.stroke();
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  // 2. Rabbit Head & Long Ears
  ctx.save();
  ctx.translate(0, 5);
  ctx.rotate(headTilt);

  // Long Rabbit Ears
  ctx.fillStyle = C.rabbitFur;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 9;

  // Left ear (floppy curve)
  ctx.beginPath();
  ctx.moveTo(-35, -45);
  if (mood === 'cold' || mood === 'tired' || mood === 'worried') {
    ctx.quadraticCurveTo(-90, -110, -75, -180);
    ctx.quadraticCurveTo(-45, -195, -20, -120);
  } else {
    ctx.quadraticCurveTo(-75, -130, -55, -210);
    ctx.quadraticCurveTo(-25, -215, -15, -130);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Left Inner Pink Ear
  ctx.fillStyle = C.rabbitEarInner;
  ctx.beginPath();
  ctx.moveTo(-32, -60);
  ctx.quadraticCurveTo(-70, -120, -60, -165);
  ctx.quadraticCurveTo(-38, -170, -22, -115);
  ctx.fill();

  // Right ear
  ctx.fillStyle = C.rabbitFur;
  ctx.strokeStyle = C.ink;
  ctx.beginPath();
  ctx.moveTo(35, -45);
  if (mood === 'cold' || mood === 'tired') {
    ctx.quadraticCurveTo(80, -100, 65, -170);
    ctx.quadraticCurveTo(38, -180, 20, -115);
  } else {
    ctx.quadraticCurveTo(75, -130, 55, -210);
    ctx.quadraticCurveTo(25, -215, 15, -130);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right Inner Pink Ear
  ctx.fillStyle = C.rabbitEarInner;
  ctx.beginPath();
  ctx.moveTo(32, -60);
  ctx.quadraticCurveTo(68, -115, 52, -160);
  ctx.quadraticCurveTo(32, -165, 20, -110);
  ctx.fill();

  // Main Head Circle (Cream / Tan Fur)
  ctx.fillStyle = C.rabbitFur;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.ellipse(0, -30, 58, 52, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Cute Whiskers (3 on each side)
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 4;
  [-1, 0, 1].forEach((k) => {
    ctx.beginPath();
    ctx.moveTo(-28, -6 + k * 8);
    ctx.lineTo(-75, -12 + k * 14);
    ctx.moveTo(28, -6 + k * 8);
    ctx.lineTo(75, -12 + k * 14);
    ctx.stroke();
  });

  // Snout / Muzzle
  ctx.fillStyle = C.cream;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, -8, 30, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Pink button nose
  ctx.fillStyle = C.rabbitEarInner;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(0, -18, 11, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Mouth Expression
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (mood === 'worried' || mood === 'cold') {
    ctx.moveTo(-14, 2);
    ctx.quadraticCurveTo(0, -4, 14, 2); // Wobbly straight line
  } else if (mood === 'tired') {
    ctx.arc(0, 10, 14, Math.PI * 1.15, Math.PI * 1.85); // Drooping frown
  } else if (mood === 'determined') {
    ctx.moveTo(-16, 4);
    ctx.lineTo(16, 0); // Firm straight mouth
  } else {
    ctx.arc(0, -4, 14, Math.PI * 0.15, Math.PI * 0.85); // Gentle smile
  }
  ctx.stroke();

  // Large Expressive Pie-Eyes
  ctx.fillStyle = C.cream;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;

  // Left eye
  ctx.beginPath();
  ctx.ellipse(-20, -38, 17, 24, -0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Right eye
  ctx.beginPath();
  ctx.ellipse(20, -38, 17, 24, 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Pupils (with pie cutout)
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.arc(-20 + eyeDir * 3, -38, 11, 0, Math.PI * 2);
  ctx.arc(20 + eyeDir * 3, -38, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = C.cream;
  [-20 + eyeDir * 3, 20 + eyeDir * 3].forEach((px) => {
    ctx.beginPath();
    ctx.moveTo(px, -38);
    ctx.lineTo(px - 10, -46);
    ctx.lineTo(px - 3, -50);
    ctx.closePath();
    ctx.fill();
  });

  // Tired Eye Bags (for 20 years later scenes)
  if (mood === 'tired') {
    ctx.strokeStyle = 'rgba(25, 20, 20, 0.7)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(-20, -22, 14, Math.PI * 0.1, Math.PI * 0.9);
    ctx.arc(20, -22, 14, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();
  }

  // Eyebrows
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 6;
  ctx.beginPath();
  if (mood === 'worried' || mood === 'cold') {
    ctx.moveTo(-32, -62);
    ctx.lineTo(-10, -70);
    ctx.moveTo(32, -62);
    ctx.lineTo(10, -70);
  } else if (mood === 'determined') {
    ctx.moveTo(-32, -68);
    ctx.lineTo(-12, -60);
    ctx.moveTo(32, -68);
    ctx.lineTo(12, -60);
  } else {
    ctx.moveTo(-30, -66);
    ctx.quadraticCurveTo(-20, -74, -10, -66);
    ctx.moveTo(10, -66);
    ctx.quadraticCurveTo(20, -74, 30, -66);
  }
  ctx.stroke();

  ctx.restore(); // restore head tilt

  // 3. Arms & White Gloves
  ctx.strokeStyle = C.rabbitCoat;
  ctx.lineWidth = 22;

  if (pose === 'clutch') {
    // Clutching travel bag in front
    ctx.beginPath();
    ctx.moveTo(-42, 60);
    ctx.quadraticCurveTo(-65, 110, -10, 140);
    ctx.moveTo(42, 60);
    ctx.quadraticCurveTo(65, 110, 10, 140);
    ctx.stroke();
    drawCartoonGlove(-10, 140, 0.85, 0.3);
    drawCartoonGlove(10, 140, 0.85, -0.3);
  } else if (pose === 'shiver') {
    // Shivering arms hugged across chest
    const shiverX = Math.sin(opts.shiverT || 0) * 3;
    ctx.beginPath();
    ctx.moveTo(-42, 60);
    ctx.quadraticCurveTo(-30 + shiverX, 115, 20, 110);
    ctx.moveTo(42, 60);
    ctx.quadraticCurveTo(30 - shiverX, 115, -20, 110);
    ctx.stroke();
    drawCartoonGlove(20, 110, 0.8, -0.2);
    drawCartoonGlove(-20, 110, 0.8, 0.2);
  } else {
    // Natural resting / walking arms
    ctx.beginPath();
    ctx.moveTo(-42, 60);
    ctx.quadraticCurveTo(-65, 110, -50, 160 + armL * 20);
    ctx.moveTo(42, 60);
    ctx.quadraticCurveTo(65, 110, 50, 160 + armR * 20);
    ctx.stroke();
    drawCartoonGlove(-50, 160 + armL * 20, 0.8, 0);
    drawCartoonGlove(50, 160 + armR * 20, 0.8, 0);
  }

  // Draw Satchel on hip
  if (hasBag) {
    ctx.save();
    ctx.translate(55, 150);
    ctx.fillStyle = C.rabbitBag;
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.roundRect(-25, -20, 50, 44, 8);
    ctx.fill();
    ctx.stroke();
    // Satchel flap
    ctx.beginPath();
    ctx.moveTo(-25, -10);
    ctx.lineTo(25, -10);
    ctx.lineTo(18, 12);
    ctx.lineTo(-18, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Buckle
    ctx.fillStyle = '#C89A38';
    ctx.fillRect(-6, 8, 12, 10);
    ctx.restore();
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// ENVIRONMENTS: Crossroads Inn, Diner, Train Platform, Props
// ---------------------------------------------------------------------------

/**
 * Scene: Crossroads Inn Exterior in Winter Blizzard
 */
export function drawCrossroadsInnExterior(t) {
  // Dark cold mountain sky
  ctx.fillStyle = '#0B0F17';
  ctx.fillRect(0, 0, W, H);

  // Distant snow mountains & dark pine silhouettes
  ctx.fillStyle = '#151C28';
  ctx.beginPath();
  ctx.moveTo(0, 1000);
  ctx.lineTo(220, 680);
  ctx.lineTo(540, 880);
  ctx.lineTo(840, 640);
  ctx.lineTo(W, 1000);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Inn wooden cabin building silhouette
  ctx.fillStyle = '#201610';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(140, 1300);
  ctx.lineTo(140, 780);
  ctx.lineTo(540, 520);
  ctx.lineTo(940, 780);
  ctx.lineTo(940, 1300);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Heavy snow drifts on roof
  ctx.fillStyle = '#E8EDF5';
  ctx.beginPath();
  ctx.moveTo(110, 790);
  ctx.lineTo(540, 500);
  ctx.lineTo(970, 790);
  ctx.lineTo(940, 830);
  ctx.lineTo(540, 545);
  ctx.lineTo(140, 830);
  ctx.closePath();
  ctx.fill();

  // Warm Amber Glowing Window in the inn
  const winX = 540, winY = 820;
  const wGlow = ctx.createRadialGradient(winX, winY, 20, winX, winY, 520);
  wGlow.addColorStop(0, 'rgba(238, 168, 52, 0.55)');
  wGlow.addColorStop(0.4, 'rgba(232, 159, 48, 0.22)');
  wGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = wGlow;
  ctx.beginPath();
  ctx.arc(winX, winY, 540, 0, Math.PI * 2);
  ctx.fill();

  // Window pane
  ctx.fillStyle = C.amberLamp;
  ctx.strokeStyle = '#321D0E';
  ctx.lineWidth = 12;
  ctx.fillRect(winX - 110, winY - 90, 220, 180);
  ctx.strokeRect(winX - 110, winY - 90, 220, 180);
  // Mullions
  ctx.beginPath();
  ctx.moveTo(winX, winY - 90);
  ctx.lineTo(winX, winY + 90);
  ctx.moveTo(winX - 110, winY);
  ctx.lineTo(winX + 110, winY);
  ctx.stroke();

  // Hanging Wooden Inn Sign: "CROSSROADS INN"
  ctx.fillStyle = '#3E2716';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  ctx.save();
  ctx.translate(290, 940);
  ctx.rotate(Math.sin(t * 1.5) * 0.05); // slight wind sway
  ctx.beginPath();
  ctx.roundRect(-100, -45, 200, 90, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = C.cream;
  ctx.font = '900 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CROSSROADS', 0, -8);
  ctx.fillText('INN', 0, 22);
  ctx.restore();

  // Swirling Snowflakes in Blizzard
  ctx.fillStyle = 'rgba(245, 248, 255, 0.75)';
  for (let i = 0; i < 45; i++) {
    const sx = ((i * 73 + t * 450) % (W + 200)) - 100;
    const sy = ((i * 127 + t * 320) % (H + 100));
    ctx.beginPath();
    ctx.arc(sx, sy, 2.5 + (i % 3) * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Scene: Warm Crossroads Inn Interior
 */
export function drawWarmInnInterior(t) {
  // Deep warm wood walls
  ctx.fillStyle = C.warmBg;
  ctx.fillRect(0, 0, W, H);

  // Vertical timber wall planks
  ctx.strokeStyle = '#271910';
  ctx.lineWidth = 6;
  for (let x = 0; x < W; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1260);
    ctx.stroke();
  }

  // Antique hanging brass oil lamp at top
  const lampX = 540, lampY = 320;
  const cone = ctx.createRadialGradient(lampX, lampY, 30, lampX, lampY, 820);
  cone.addColorStop(0, 'rgba(238, 168, 52, 0.45)');
  cone.addColorStop(0.4, 'rgba(232, 159, 48, 0.22)');
  cone.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.arc(lampX, lampY, 850, 0, Math.PI * 2);
  ctx.fill();

  // Lamp hardware & glass shade
  ctx.fillStyle = '#6E491A';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(lampX, 0);
  ctx.lineTo(lampX, lampY - 40);
  ctx.stroke();

  ctx.fillStyle = C.amberLamp;
  ctx.beginPath();
  ctx.ellipse(lampX, lampY, 60, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Tavern Bar Counter at bottom
  ctx.fillStyle = C.warmCounter;
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

  // Polished bar top highlight line
  ctx.strokeStyle = 'rgba(240, 180, 80, 0.25)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, 1272);
  ctx.lineTo(W, 1272);
  ctx.stroke();
}

/**
 * Prop: Steaming Bowl of Stew with Spoon
 */
export function drawSteamingStew(x, y, scale = 1.0, t = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Stoneware Bowl Base
  ctx.fillStyle = '#4E382A';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.ellipse(0, 30, 110, 52, 0, 0, Math.PI);
  ctx.fill();
  ctx.stroke();

  // Bowl Rim
  ctx.fillStyle = '#684A35';
  ctx.beginPath();
  ctx.ellipse(0, 30, 110, 32, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Golden Hot Stew Broth
  ctx.fillStyle = C.stewGold;
  ctx.beginPath();
  ctx.ellipse(0, 30, 94, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wooden Spoon handle sticking out
  ctx.fillStyle = '#9C6E42';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(40, -45, 18, 90, 7);
  ctx.fill();
  ctx.stroke();

  // Animated Steam Wisps curling upward
  ctx.strokeStyle = 'rgba(245, 235, 215, 0.45)';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  [-40, 0, 35].forEach((sx, idx) => {
    const stOff = t * 4 + idx * 2.1;
    ctx.beginPath();
    ctx.moveTo(sx, 10);
    ctx.quadraticCurveTo(
      sx + Math.sin(stOff) * 25,
      -40,
      sx + Math.cos(stOff * 1.2) * 20,
      -100
    );
    ctx.stroke();
  });

  ctx.restore();
}

/**
 * Prop: Rabbit's Packed Travel Bag
 */
export function drawTravelBag(x, y, scale = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = C.rabbitBag;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 9;

  // Bag Body
  ctx.beginPath();
  ctx.roundRect(-80, -60, 160, 120, 18);
  ctx.fill();
  ctx.stroke();

  // Handle
  ctx.beginPath();
  ctx.arc(0, -60, 32, Math.PI, 0);
  ctx.stroke();

  // Brass Buckles
  ctx.fillStyle = '#C89A38';
  ctx.fillRect(-50, -10, 20, 24);
  ctx.fillRect(30, -10, 20, 24);

  // Attached Paper Luggage Tag
  ctx.fillStyle = C.cream;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 4;
  ctx.save();
  ctx.translate(45, -35);
  ctx.rotate(0.35);
  ctx.fillRect(0, 0, 38, 55);
  ctx.strokeRect(0, 0, 38, 55);
  ctx.restore();

  ctx.restore();
}

/**
 * Scene: Cold Highway Diner 20 Years Later
 */
export function drawColdDiner(t) {
  // Desolate cold blue-gray background
  ctx.fillStyle = C.coldBg;
  ctx.fillRect(0, 0, W, H);

  // Grimy diner tiled wall
  ctx.fillStyle = C.coldDinerWall;
  ctx.fillRect(80, 250, W - 160, 1010);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 10;
  ctx.strokeRect(80, 250, W - 160, 1010);

  // Flickering fluorescent tube overhead
  const tubeFlicker = Math.sin(t * 45) > 0.94 ? 0.4 : 1.0;
  ctx.fillStyle = C.fluorescentTube;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.roundRect(280, 140, 520, 34, 10);
  ctx.fill();
  ctx.stroke();

  // Harsh cold light cone
  const cone = ctx.createLinearGradient(540, 170, 540, 1260);
  cone.addColorStop(0, `rgba(180, 220, 245, ${0.32 * tubeFlicker})`);
  cone.addColorStop(0.6, `rgba(120, 170, 205, ${0.1 * tubeFlicker})`);
  cone.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(300, 175);
  ctx.lineTo(80, 1260);
  ctx.lineTo(1000, 1260);
  ctx.lineTo(780, 175);
  ctx.closePath();
  ctx.fill();

  // Formica diner counter
  ctx.fillStyle = C.coldCounter;
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

  // Dirty rag on counter
  ctx.fillStyle = '#5A6372';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(320, 1290, 45, 20, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

/**
 * Scene: Train Platform (Midnight Train Rolling Away in Freezing Fog)
 */
export function drawTrainPlatform(t) {
  // Midnight fog sky
  ctx.fillStyle = '#0B1019';
  ctx.fillRect(0, 0, W, H);

  // Platform canopy pillars (rusted iron)
  ctx.fillStyle = '#1D2533';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 10;
  ctx.fillRect(100, 200, 45, 1060);
  ctx.strokeRect(100, 200, 45, 1060);

  // Swinging cold platform lantern
  const swing = Math.sin(t * 2.0) * 0.12;
  ctx.save();
  ctx.translate(122, 380);
  ctx.rotate(swing);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 50);
  ctx.stroke();
  ctx.fillStyle = '#445163';
  ctx.fillRect(-22, 50, 44, 55);
  ctx.strokeRect(-22, 50, 44, 55);
  // Lantern yellow glow
  ctx.fillStyle = '#D6B864';
  ctx.fillRect(-14, 58, 28, 38);
  ctx.restore();

  // Train tracks receding in snow
  ctx.strokeStyle = '#2A3649';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(380, 720);
  ctx.lineTo(240, 1260);
  ctx.moveTo(560, 720);
  ctx.lineTo(760, 1260);
  ctx.stroke();

  // Wooden rail ties
  for (let y = 740; y < 1260; y += 45) {
    const x1 = lerp(380, 240, (y - 740) / 520) - 30;
    const x2 = lerp(560, 760, (y - 740) / 520) + 30;
    ctx.strokeStyle = '#181F2B';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }

  // Steam Locomotive / Caboose pulling away into dark distance
  const trainDist = clamp(t * 22, 0, 160);
  const trainX = 520 + trainDist * 0.4;
  const trainY = 660 - trainDist * 0.3;
  const trainSc = 1.0 - trainDist * 0.003;

  ctx.save();
  ctx.translate(trainX, trainY);
  ctx.scale(trainSc, trainSc);

  // Train rear silhouette
  ctx.fillStyle = '#11151E';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.roundRect(-90, -110, 180, 170, 14);
  ctx.fill();
  ctx.stroke();

  // Glowing Red Marker Lantern on rear of train
  const rGlow = ctx.createRadialGradient(0, -20, 5, 0, -20, 110);
  rGlow.addColorStop(0, 'rgba(235, 50, 50, 0.85)');
  rGlow.addColorStop(0.5, 'rgba(200, 30, 30, 0.28)');
  rGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = rGlow;
  ctx.beginPath();
  ctx.arc(0, -20, 120, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FF4545';
  ctx.beginPath();
  ctx.arc(0, -20, 16, 0, Math.PI * 2);
  ctx.fill();

  // Billowing clouds of locomotive steam & smoke rolling into fog
  ctx.fillStyle = 'rgba(215, 225, 238, 0.22)';
  for (let i = 0; i < 8; i++) {
    const bOff = (t * 2.5 + i * 1.3) % 6;
    const bx = -40 + Math.sin(bOff * 2 + i) * 60;
    const by = -120 - bOff * 45;
    const br = 40 + bOff * 25;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Dense foreground cold fog layers
  ctx.fillStyle = 'rgba(20, 28, 42, 0.45)';
  ctx.fillRect(0, 1100, W, H - 1100);
}

/**
 * Prop: 3:00 AM Wall Clock
 */
export function drawClock3AM(x, y, scale = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Clock frame
  ctx.fillStyle = '#1D2533';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(0, 0, 160, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Clock face
  ctx.fillStyle = '#E8EFF5';
  ctx.beginPath();
  ctx.arc(0, 0, 142, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Hour numerals (Roman or dots)
  ctx.fillStyle = C.ink;
  ctx.font = '900 32px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('12', 0, -108);
  ctx.fillText('3', 108, 0);
  ctx.fillText('6', 0, 108);
  ctx.fillText('9', -108, 0);

  // Hour Hand pointing at 3
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 12;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(80, 0);
  ctx.stroke();

  // Minute Hand pointing straight up at 12
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -100);
  ctx.stroke();

  // Center pin
  ctx.fillStyle = '#BD3030';
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Prop / Insert: Extreme Close-Up of Yellowed Train Ticket in Paws
 */
export function drawTicketCloseUp(x, y, scale = 1.0, opts = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Aged yellowed railway ticket
  ctx.fillStyle = C.sepiaParchment;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.roundRect(-220, -130, 440, 260, 14);
  ctx.fill();
  ctx.stroke();

  // Ornate 1930s border line
  ctx.strokeStyle = C.sepiaDark;
  ctx.lineWidth = 4;
  ctx.strokeRect(-205, -115, 410, 230);

  // Ticket text
  ctx.fillStyle = C.sepiaDark;
  ctx.font = '900 26px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('NORTHERN RAILWAY', 0, -75);
  ctx.font = '700 20px monospace';
  ctx.fillText('★ ONE WAY TICKET ★', 0, -42);

  ctx.font = '900 36px monospace';
  ctx.fillText('CAPITAL CITY', 0, 10);

  ctx.font = '700 20px monospace';
  ctx.fillText('MIDNIGHT EXPRESS · CAR 4', 0, 55);

  // Red stamped date: "DEC 1934"
  ctx.save();
  ctx.rotate(-0.15);
  ctx.strokeStyle = 'rgba(175, 40, 40, 0.85)';
  ctx.lineWidth = 5;
  ctx.strokeRect(-90, -10, 180, 45);
  ctx.fillStyle = 'rgba(175, 40, 40, 0.85)';
  ctx.font = '900 24px monospace';
  ctx.fillText('DEC 1934', 0, 14);
  ctx.restore();

  // Ticket punch hole at edge
  ctx.fillStyle = C.coldBg;
  ctx.beginPath();
  ctx.arc(205, 0, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Two white gloved paws holding the ticket edges
  drawCartoonGlove(-230, 30, 1.15, 0.4);
  drawCartoonGlove(230, 30, 1.15, -0.4);

  ctx.restore();
}
