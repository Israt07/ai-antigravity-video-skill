// Vintage Cartoon Component Zoo: 1930s rubber-hose characters, layered scenes, and optical film overlays.
// Characters: Wolf in pinstripe suit & Pup in striped sweater and overalls with expressions, blink, and talking mouth.
import { ctx, W, H, C, clamp, lerp, seg, eo, eio, eob, TAU } from './lib.js';

// ---------------------------------------------------------------------------
// 1930s OPTICAL FILM OVERLAYS (Grain, Scanlines, Vignette, Flicker)
// ---------------------------------------------------------------------------
export function applyVintageOverlays(t) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // 1. Projector flicker (±2.5% brightness)
  const flick = 1.0 + (Math.sin(t * 78.3) * 0.016 + Math.cos(t * 131.7) * 0.012);
  if (Math.abs(flick - 1.0) > 0.005) {
    ctx.fillStyle = flick > 1.0 ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.025)';
    ctx.fillRect(0, 0, W, H);
  }

  // 2. Horizontal scanlines (subtle low-opacity raster)
  ctx.fillStyle = 'rgba(8, 10, 14, 0.065)';
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 1.5);
  }

  // 3. Film Grain & Dust specks / hair scratches
  const frameSeed = Math.floor(t * 24);
  const pseudoRand = (n) => {
    const x = Math.sin(frameSeed * 91.34 + n * 47.12) * 43758.5453;
    return x - Math.floor(x);
  };

  for (let i = 0; i < 5; i++) {
    const dx = pseudoRand(i * 3 + 1) * W;
    const dy = pseudoRand(i * 3 + 2) * H;
    const size = 1.2 + pseudoRand(i * 3 + 3) * 2.5;
    ctx.fillStyle = pseudoRand(i) > 0.35 ? 'rgba(240, 235, 220, 0.22)' : 'rgba(12, 12, 14, 0.28)';
    ctx.beginPath();
    ctx.arc(dx, dy, size, 0, TAU);
    ctx.fill();
    if (i === 0 && pseudoRand(99) > 0.5) {
      ctx.strokeStyle = 'rgba(235, 230, 215, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx + (pseudoRand(10) - 0.5) * 40, dy + pseudoRand(11) * 35);
      ctx.stroke();
    }
  }

  // 4. Heavy Radial Vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.72);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(0.7, 'rgba(8, 9, 12, 0.35)');
  vig.addColorStop(1, 'rgba(5, 5, 8, 0.82)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// 1930s GLOVE
// ---------------------------------------------------------------------------
export function drawGlove(x, y, s = 1.0, rot = 0, pointing = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(s, s);

  ctx.fillStyle = C.sepiaCream;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Cuff roll
  ctx.beginPath();
  ctx.ellipse(0, 18, 22, 9, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Palm
  ctx.beginPath();
  ctx.ellipse(0, 0, 24, 22, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Fingers
  if (pointing) {
    ctx.beginPath();
    ctx.roundRect(10, -10, 36, 15, 8);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-8, -12, 11, 0, TAU);
    ctx.fill();
    ctx.stroke();
  } else {
    [-11, 0, 11].forEach((fx) => {
      ctx.beginPath();
      ctx.ellipse(fx, -20, 8, 14, 0, 0, TAU);
      ctx.fill();
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.ellipse(-20, -4, 10, 13, -0.5, 0, TAU);
    ctx.fill();
    ctx.stroke();
  }

  // 3 Black Darts
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

// ---------------------------------------------------------------------------
// CHARACTER 1: THE WOLF (Tempter in Pinstripe Suit)
// ---------------------------------------------------------------------------
export function drawWolf(opts = {}) {
  const {
    x = 540,
    y = 960,
    s = 1.0,
    pose = 'stand', // 'stand', 'lean', 'slide', 'whisper'
    blink = 0,      // 0 = open, 1 = closed eyelid
    talk = 0,       // 0..1 mouth opening
    mouth = 'grin', // 'grin', 'toothy', 'open', 'closed'
    eyeDir = 0,     // -1, 0, 1
    headTilt = 0,
    armL = 0,
    armR = 0
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // 1. Torso: Pinstripe Suit Coat with Two-Tone Cel Shading
  ctx.fillStyle = C.wolfSuit;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 10;

  ctx.beginPath();
  ctx.moveTo(-55, 45);
  ctx.quadraticCurveTo(-75, 180, -48, 270);
  ctx.lineTo(48, 270);
  ctx.quadraticCurveTo(75, 180, 55, 45);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Two-tone shadow on right side
  ctx.fillStyle = C.wolfSuitShade;
  ctx.beginPath();
  ctx.moveTo(10, 48);
  ctx.quadraticCurveTo(45, 180, 48, 270);
  ctx.lineTo(15, 270);
  ctx.quadraticCurveTo(15, 160, 5, 48);
  ctx.closePath();
  ctx.fill();

  // Pinstripes
  ctx.strokeStyle = C.wolfPinstripe;
  ctx.lineWidth = 3;
  for (let px = -35; px <= 35; px += 18) {
    ctx.beginPath();
    ctx.moveTo(px * 0.9, 50);
    ctx.quadraticCurveTo(px * 1.1, 160, px, 265);
    ctx.stroke();
  }

  // White Collar V
  ctx.fillStyle = C.sepiaCream;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-24, 45);
  ctx.lineTo(0, 105);
  ctx.lineTo(24, 45);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Crimson Red Necktie
  ctx.fillStyle = C.wolfTie;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-8, 60);
  ctx.lineTo(8, 60);
  ctx.lineTo(14, 145);
  ctx.lineTo(0, 170);
  ctx.lineTo(-14, 145);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 2. Head with Tilt
  ctx.save();
  ctx.translate(0, 20);
  ctx.rotate(headTilt);

  // Pointed Wolf Ears with two-tone inner shadow
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

  // Inner ear dark tone
  ctx.fillStyle = C.wolfSuitShade;
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

  ctx.fillStyle = C.wolfSuitShade;
  ctx.beginPath();
  ctx.moveTo(45, -60);
  ctx.quadraticCurveTo(75, -120, 65, -145);
  ctx.quadraticCurveTo(35, -125, 28, -75);
  ctx.fill();

  // Main Head Shape
  ctx.fillStyle = C.wolfSuit;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.ellipse(0, -35, 62, 54, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Two-tone shadow on right side of head
  ctx.fillStyle = C.wolfSuitShade;
  ctx.beginPath();
  ctx.arc(0, -35, 61, -Math.PI * 0.25, Math.PI * 0.45);
  ctx.quadraticCurveTo(15, -20, 0, -35);
  ctx.fill();

  // Sharp Wolf Muzzle
  ctx.fillStyle = C.midGrey;
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

  // Black Nose Tip
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.ellipse(5, 5, 14, 10, 0, 0, TAU);
  ctx.fill();

  // 3. Mouth & Talking Teeth Animation
  const mouthOpen = Math.max(talk * 18, mouth === 'open' ? 14 : 0);
  ctx.fillStyle = C.ink;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-45, 18);
  ctx.quadraticCurveTo(5, 75 + mouthOpen, 55, 18);
  ctx.quadraticCurveTo(5, 30 - mouthOpen * 0.3, -45, 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Sharp White Canine Teeth
  ctx.fillStyle = C.sepiaCream;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 3;
  [-30, -15, 0, 15, 30, 45].forEach((tx) => {
    // Top teeth
    ctx.beginPath();
    ctx.moveTo(tx - 6, 22);
    ctx.lineTo(tx, 34);
    ctx.lineTo(tx + 6, 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Bottom teeth (if mouth open)
    if (mouthOpen > 6) {
      ctx.beginPath();
      ctx.moveTo(tx - 5, 52 + mouthOpen);
      ctx.lineTo(tx, 40 + mouthOpen * 0.5);
      ctx.lineTo(tx + 5, 52 + mouthOpen);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  });

  // 4. Pie-Eyes with Animated Blink
  ctx.fillStyle = C.sepiaCream;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 7;

  // Left Eye
  const eyeH = 22 * (1 - blink);
  if (eyeH > 2) {
    ctx.beginPath();
    ctx.ellipse(-24, -45, 15, eyeH, -0.1, 0, TAU);
    ctx.fill();
    ctx.stroke();
    // Pupil
    ctx.fillStyle = C.ink;
    ctx.beginPath();
    ctx.arc(-22 + eyeDir * 3, -45, Math.min(10, eyeH), 0, TAU);
    ctx.fill();
    // Pacman wedge
    ctx.fillStyle = C.sepiaCream;
    ctx.beginPath();
    ctx.moveTo(-22 + eyeDir * 3, -45);
    ctx.lineTo(-22 + eyeDir * 3 - 9, -52);
    ctx.lineTo(-22 + eyeDir * 3 - 3, -56);
    ctx.closePath();
    ctx.fill();
  } else {
    // Closed eyelid slit
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-38, -45);
    ctx.lineTo(-10, -45);
    ctx.stroke();
  }

  // Right Eye
  if (eyeH > 2) {
    ctx.fillStyle = C.sepiaCream;
    ctx.strokeStyle = C.ink;
    ctx.beginPath();
    ctx.ellipse(24, -45, 15, eyeH, 0.1, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = C.ink;
    ctx.beginPath();
    ctx.arc(24 + eyeDir * 3, -45, Math.min(10, eyeH), 0, TAU);
    ctx.fill();
    ctx.fillStyle = C.sepiaCream;
    ctx.beginPath();
    ctx.moveTo(24 + eyeDir * 3, -45);
    ctx.lineTo(24 + eyeDir * 3 - 9, -52);
    ctx.lineTo(24 + eyeDir * 3 - 3, -56);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(10, -45);
    ctx.lineTo(38, -45);
    ctx.stroke();
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

  ctx.restore(); // restore head tilt

  // 5. Rubber-Hose Arms & Gloves
  ctx.strokeStyle = C.wolfSuit;
  ctx.lineWidth = 26;

  // Left Arm
  ctx.beginPath();
  ctx.moveTo(-45, 80);
  ctx.quadraticCurveTo(-110, 130 + armL * 20, -120, 200 + armL * 30);
  ctx.stroke();
  drawGlove(-120, 200 + armL * 30, 0.85, 0.3);

  // Right Arm
  ctx.beginPath();
  ctx.moveTo(45, 80);
  if (pose === 'slide') {
    ctx.quadraticCurveTo(110, 130, 150, 180);
  } else {
    ctx.quadraticCurveTo(110, 130 + armR * 20, 120, 200 + armR * 30);
  }
  ctx.stroke();

  if (pose === 'slide') {
    drawGlove(150, 180, 0.95, -0.4, true);
  } else {
    drawGlove(120, 200 + armR * 30, 0.85, -0.3);
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// CHARACTER 2: THE PUP (Victim in Striped Sweater & Overalls)
// ---------------------------------------------------------------------------
export function drawPup(opts = {}) {
  const {
    x = 540,
    y = 960,
    s = 1.0,
    pose = 'stand', // 'stand', 'hesitate', 'sign', 'slump', 'awake-phone'
    blink = 0,
    talk = 0,
    mouth = 'normal', // 'normal', 'worried', 'sad', 'gasp'
    eyeDir = 0,
    headTilt = 0,
    armL = 0,
    armR = 0,
    tear = false
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // 1. Torso: Striped Sweater + Denim Overalls
  ctx.fillStyle = C.pupCream;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(-42, 20, 84, 110, 24);
  ctx.fill();
  ctx.stroke();

  // Muted Red Horizontal Stripes with two-tone shade
  ctx.fillStyle = C.pupStripe;
  [38, 62, 86, 110].forEach((sy) => {
    ctx.fillRect(-38, sy, 76, 12);
  });

  // Denim Blue Overalls
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

  // Two-tone shadow on overalls
  ctx.fillStyle = C.pupOverallsShade;
  ctx.fillRect(8, 76, 32, 98);

  // Straps with Brass Buttons
  ctx.lineWidth = 14;
  ctx.strokeStyle = C.pupOveralls;
  ctx.beginPath();
  ctx.moveTo(-28, 25);
  ctx.lineTo(-24, 80);
  ctx.moveTo(28, 25);
  ctx.lineTo(24, 80);
  ctx.stroke();

  ctx.fillStyle = C.pupBrass;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(-24, 76, 6, 0, TAU);
  ctx.arc(24, 76, 6, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // 2. Head with Tilt
  ctx.save();
  ctx.translate(0, 10);
  ctx.rotate(headTilt);

  // Floppy Hound Ears
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

  // Head Circle
  ctx.fillStyle = C.pupCream;
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.ellipse(0, -25, 48, 44, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Brown face patches
  ctx.fillStyle = '#5A4638';
  ctx.beginPath();
  ctx.arc(-26, -40, 20, 0, TAU);
  ctx.arc(32, -36, 16, 0, TAU);
  ctx.fill();

  // Snout
  ctx.fillStyle = '#FFF8EB';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, -6, 26, 19, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Black button nose
  ctx.fillStyle = C.ink;
  ctx.beginPath();
  ctx.ellipse(0, -14, 9, 7, 0, 0, TAU);
  ctx.fill();

  // Mouth & Talking Animation
  const mouthMove = Math.max(talk * 14, mouth === 'gasp' ? 12 : 0);
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (mouthMove > 4) {
    ctx.arc(0, 4, 8 + mouthMove * 0.4, 0, TAU);
    ctx.fillStyle = C.ink;
    ctx.fill();
  } else if (mouth === 'sad') {
    ctx.arc(0, 8, 12, Math.PI * 1.15, Math.PI * 1.85); // frown
  } else if (mouth === 'worried') {
    ctx.moveTo(-12, 2);
    ctx.quadraticCurveTo(0, -3, 12, 2);
  } else {
    ctx.arc(0, -4, 12, Math.PI * 0.15, Math.PI * 0.85); // smile
  }
  ctx.stroke();

  // Tear drop (for mirror regret)
  if (tear) {
    ctx.fillStyle = '#6AD1E3';
    ctx.beginPath();
    ctx.arc(22, 10, 5, 0, TAU);
    ctx.fill();
  }

  // Pie-Eyes with Animated Blink
  const eyeH = 19 * (1 - blink);
  ctx.fillStyle = C.sepiaCream;
  ctx.lineWidth = 7;

  if (eyeH > 2) {
    // Left eye
    ctx.beginPath();
    ctx.ellipse(-18, -32, 14, eyeH, -0.05, 0, TAU);
    ctx.fill();
    ctx.stroke();
    // Right eye
    ctx.beginPath();
    ctx.ellipse(18, -32, 14, eyeH, 0.05, 0, TAU);
    ctx.fill();
    ctx.stroke();

    // Pupils
    ctx.fillStyle = C.ink;
    ctx.beginPath();
    ctx.arc(-18 + eyeDir * 3, -32, Math.min(9, eyeH), 0, TAU);
    ctx.arc(18 + eyeDir * 3, -32, Math.min(9, eyeH), 0, TAU);
    ctx.fill();

    // Pie cutouts
    ctx.fillStyle = C.sepiaCream;
    [-18 + eyeDir * 3, 18 + eyeDir * 3].forEach((px) => {
      ctx.beginPath();
      ctx.moveTo(px, -32);
      ctx.lineTo(px - 8, -38);
      ctx.lineTo(px - 3, -41);
      ctx.closePath();
      ctx.fill();
    });
  } else {
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-30, -32);
    ctx.lineTo(-6, -32);
    ctx.moveTo(6, -32);
    ctx.lineTo(30, -32);
    ctx.stroke();
  }

  // Eyebrows
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (mouth === 'worried' || mouth === 'sad') {
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

  ctx.restore(); // restore head tilt

  // 3. Arms & Gloves
  ctx.strokeStyle = C.pupCream;
  ctx.lineWidth = 20;

  if (pose === 'hesitate') {
    ctx.beginPath();
    ctx.moveTo(-35, 45);
    ctx.quadraticCurveTo(-65, 80, -15, 105);
    ctx.moveTo(35, 45);
    ctx.quadraticCurveTo(65, 80, 15, 105);
    ctx.stroke();
    drawGlove(0, 110, 0.8, 0);
  } else {
    ctx.beginPath();
    ctx.moveTo(-35, 45);
    ctx.quadraticCurveTo(-55, 95, -40, 140);
    ctx.moveTo(35, 45);
    ctx.quadraticCurveTo(55, 95, 40, 140);
    ctx.stroke();
    drawGlove(-40, 140, 0.75, 0);
    drawGlove(40, 140, 0.75, 0);
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// LAYERED SCENES (Wide, OTS, Close-up, Phone Insert, Mirror)
// ---------------------------------------------------------------------------

/**
 * 1. WIDE STUDY SCENE: Dark room, moonlit window, banker's lamp, mahogany desk
 */
export function sceneWideStudy(t, opts = {}) {
  // Deep navy/charcoal background
  ctx.fillStyle = C.darkGrey;
  ctx.fillRect(-200, -200, W + 400, H + 400);

  // Arched Antique Window with Moonlit Night Sky
  ctx.save();
  ctx.fillStyle = C.navyDark;
  ctx.strokeStyle = '#221914';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(680, 520);
  ctx.lineTo(680, 260);
  ctx.arc(810, 260, 130, Math.PI, 0);
  ctx.lineTo(940, 520);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Crescent Moon
  ctx.fillStyle = C.moonlight;
  ctx.beginPath();
  ctx.arc(810, 240, 48, 0, TAU);
  ctx.fill();
  ctx.fillStyle = C.navyDark;
  ctx.beginPath();
  ctx.arc(825, 232, 45, 0, TAU);
  ctx.fill();

  // Window mullions
  ctx.strokeStyle = '#221914';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(810, 130);
  ctx.lineTo(810, 520);
  ctx.moveTo(680, 320);
  ctx.lineTo(940, 320);
  ctx.stroke();
  ctx.restore();

  // Heavy Mahogany Desk Surface
  ctx.fillStyle = '#362114';
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

  // Two-tone desk edge shadow
  ctx.fillStyle = '#22140B';
  ctx.fillRect(-20, 1280, W + 40, H - 1260);

  // Banker's Brass Oil Lamp with Warm Amber Cone
  const lampX = 220, lampY = 980;
  const cone = ctx.createRadialGradient(lampX, lampY, 30, lampX, lampY, 820);
  cone.addColorStop(0, 'rgba(238, 168, 52, 0.44)');
  cone.addColorStop(0.4, 'rgba(232, 159, 48, 0.22)');
  cone.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.arc(lampX, lampY, 840, 0, TAU);
  ctx.fill();

  // Lamp hardware
  ctx.fillStyle = '#6E4E18';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.ellipse(lampX, 1260, 48, 16, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(lampX, 1260);
  ctx.lineTo(lampX, lampY + 30);
  ctx.stroke();

  ctx.fillStyle = C.lampAmber;
  ctx.beginPath();
  ctx.ellipse(lampX, lampY, 56, 32, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();
}

/**
 * Parchment Contract on Desk
 */
export function drawContract(x, y, s = 1.0, signed = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  ctx.fillStyle = C.sepiaPaper;
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

  // Contract scribble lines
  ctx.fillStyle = C.sepiaDark;
  ctx.fillRect(-140, -180, 260, 10);
  ctx.fillRect(-140, -150, 240, 7);
  ctx.fillRect(-140, -125, 270, 7);
  ctx.fillRect(-140, -100, 230, 7);
  ctx.fillRect(-140, -75, 250, 7);

  // Red wax seal
  ctx.fillStyle = '#8B2525';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(-90, 140, 36, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Signature line
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 150);
  ctx.lineTo(140, 150);
  ctx.stroke();

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
  ctx.restore();

  ctx.restore();
}

/**
 * 2. OVER-THE-SHOULDER SCENE: Foreground Pup shoulder, glowing desk, Wolf in background
 */
export function sceneOTS(t, opts = {}) {
  sceneWideStudy(t, opts);
  drawContract(540, 1240, 1.1, false);

  // Wolf in midground leaning across desk
  const wolfBlink = Math.sin(t * 1.7) > 0.94 ? 1 : 0;
  const wolfTalk = Math.abs(Math.sin(t * 8)) * (opts.wolfTalk ? 1 : 0);
  drawWolf({ x: 380, y: 840, s: 1.45, pose: 'lean', blink: wolfBlink, talk: wolfTalk, eyeDir: 1 });

  // Foreground Pup shoulder silhouette (darkened over-the-shoulder look)
  ctx.save();
  ctx.translate(880, 1450);
  ctx.scale(1.9, 1.9);
  ctx.fillStyle = '#181B24';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.roundRect(-80, -120, 160, 240, 40);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/**
 * 3. PHONE INSERT SCENE: 3:00 AM dark bedroom with cyan screen glow on tired Pup
 */
export function scenePhoneInsert(t, opts = {}) {
  // Cold dark navy/slate room
  ctx.fillStyle = '#080B12';
  ctx.fillRect(-200, -200, W + 400, H + 400);

  // Digital clock showing 03:00 in red
  ctx.fillStyle = 'rgba(195, 45, 45, 0.85)';
  ctx.font = '700 48px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('03:00 AM', 820, 360);

  // Glowing smartphone in hands casting cyan cone
  const phoneX = 540, phoneY = 960;
  const pGlow = ctx.createRadialGradient(phoneX, phoneY, 15, phoneX, phoneY, 440);
  pGlow.addColorStop(0, 'rgba(106, 209, 227, 0.38)');
  pGlow.addColorStop(0.5, 'rgba(106, 209, 227, 0.12)');
  pGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = pGlow;
  ctx.beginPath();
  ctx.arc(phoneX, phoneY, 460, 0, TAU);
  ctx.fill();

  // Smartphone body
  ctx.fillStyle = '#0E131C';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.roundRect(phoneX - 60, phoneY - 100, 120, 200, 16);
  ctx.fill();
  ctx.stroke();

  // Screen
  ctx.fillStyle = '#6AD1E3';
  ctx.beginPath();
  ctx.roundRect(phoneX - 52, phoneY - 90, 104, 180, 8);
  ctx.fill();

  // Two white gloved paws holding phone
  drawGlove(phoneX - 70, phoneY + 40, 0.9, 0.4);
  drawGlove(phoneX + 70, phoneY + 40, 0.9, -0.4);
}

/**
 * 4. MIRROR SCENE: Bathroom mirror reflection holding old vintage photo
 */
export function sceneMirror(t, opts = {}) {
  ctx.fillStyle = C.navyDark;
  ctx.fillRect(-200, -200, W + 400, H + 400);

  // Oval Antique Mirror Frame
  ctx.fillStyle = '#19202E';
  ctx.strokeStyle = '#323E54';
  ctx.lineWidth = 26;
  ctx.beginPath();
  ctx.ellipse(540, 720, 360, 460, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Glass Reflection
  ctx.fillStyle = '#202938';
  ctx.beginPath();
  ctx.ellipse(540, 720, 340, 440, 0, 0, TAU);
  ctx.fill();

  // Sepia photograph held in hand
  ctx.save();
  ctx.translate(540, 1280);
  ctx.rotate(-0.06);

  ctx.fillStyle = '#FAF5E8';
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(-150, -190, 300, 380, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = C.sepiaPaper;
  ctx.fillRect(-130, -170, 260, 300);

  // Mini smiling pup portrait inside photo
  drawPup({ x: 0, y: -20, s: 0.95, pose: 'stand', mouth: 'normal' });

  ctx.restore();
}
