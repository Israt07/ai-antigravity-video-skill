// Shots for The Ten Year Deal (1930s Vintage Cartoon Moral)
// 10 scenes alternating warm deal vs cold regret, Ken Burns camera push-in, and rubber-hose characters.
import { ctx, W, H, C as BaseC, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { T, cut, Wd } from './core/timing.js';
import {
  C,
  drawWolf,
  drawPup,
  drawWarmDealRoom,
  drawContract,
  drawColdOffice,
  drawColdBedroomPhone,
  drawMirrorWithPhoto
} from './core/kit.js';

export function buildShots() {
  const shots = [];
  const cues = [];

  // Scene 1: Hook ("What if ten years from now...")
  // Warm Deal room: Wolf leaning over desk grinning, young pup seated looking up.
  shots.push({
    id: 's1',
    at: cut(0),
    note: 'Warm room intro: Wolf tempter and young pup',
    mood: 'warm',
    cam: [540, 960],
    zoom: 0.12,
    transition: 'iris-in',
    draw(lt, d, t) {
      drawWarmDealRoom(t);
      // Desk items
      drawContract(540, 1290, 0.75, false);
      // Wolf standing at left/center leaning in
      drawWolf(360, 820, 1.35, { pose: 'lean', eyeDir: 1, teeth: true });
      // Pup seated at right listening
      drawPup(760, 1080, 1.25, { pose: 'sit', mood: 'normal', eyeDir: -1, headTilt: -0.08 });
    }
  });

  // Scene 2: The Offer ("The wolf slides a golden pen...")
  // Close-up on desk: Wolf's white-gloved hand sliding the gold pen & contract
  shots.push({
    id: 's2',
    at: cut(1),
    note: 'Desk close-up: Wolf sliding pen and contract',
    mood: 'warm',
    cam: [540, 1050],
    zoom: 0.11,
    transition: 'none',
    draw(lt, d, t) {
      drawWarmDealRoom(t);
      // Sliding motion
      const slideP = clamp(lt / 1.8, 0, 1);
      const penX = lerp(420, 560, eo(slideP));
      drawContract(540, 1140, 1.25, false);
      // Wolf's arm and pointing glove in foreground
      ctx.save();
      ctx.translate(penX - 80, 1050);
      drawWolf(0, -220, 1.6, { pose: 'point', eyeDir: 1, armR: 0.5 });
      ctx.restore();
    }
  });

  // Scene 3: Hesitation ("The young pup hesitates...")
  // Over-the-shoulder shot on the worried pup clutching ears
  shots.push({
    id: 's3',
    at: cut(2),
    note: 'Pup hesitating over the contract',
    mood: 'warm',
    cam: [540, 880],
    zoom: 0.12,
    transition: 'none',
    draw(lt, d, t) {
      drawWarmDealRoom(t);
      drawContract(540, 1280, 0.85, false);
      // Worried pup front and center
      const earWiggle = Math.sin(lt * 4) * 0.04;
      drawPup(540, 940, 1.55, { pose: 'hesitate', mood: 'worried', eyeDir: 0, headTilt: earWiggle });
    }
  });

  // Scene 4: Wolf Pressure ("'None at all,' the wolf whispers with a sly wink...")
  // Macro close-up on Wolf's toothy grin and winking pie-eye
  shots.push({
    id: 's4',
    at: cut(3),
    note: 'Wolf menacing close-up wink',
    mood: 'warm',
    cam: [540, 780],
    zoom: 0.14,
    transition: 'none',
    draw(lt, d, t) {
      // Dark room background
      ctx.fillStyle = C.warmBg;
      ctx.fillRect(0, 0, W, H);
      // Amber spotlight on Wolf
      const spot = ctx.createRadialGradient(540, 720, 40, 540, 720, 680);
      spot.addColorStop(0, 'rgba(238, 168, 52, 0.35)');
      spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spot;
      ctx.fillRect(0, 0, W, H);

      const winkNow = lt > 0.8 && lt < 2.2;
      drawWolf(540, 820, 2.45, { pose: 'whisper', eyeDir: 0, teeth: true, wink: winkNow });
    }
  });

  // Scene 5: Pup Signs ("With a trembling paw, the pup signs...")
  // Close-up on gloved hand putting pen to paper -> Iris-out into blackness
  shots.push({
    id: 's5',
    at: cut(4),
    note: 'Signing the contract and iris-out to black',
    mood: 'warm',
    cam: [540, 1020],
    zoom: 0.13,
    transition: 'iris-out',
    draw(lt, d, t) {
      drawWarmDealRoom(t);
      const isSigned = lt > 1.2;
      drawContract(540, 1020, 1.45, isSigned);
      // Pup's hand holding pen
      const tremble = Math.sin(lt * 35) * 2.5;
      drawPup(660 + tremble, 1060, 1.4, { pose: 'sign', mood: 'worried' });
    }
  });

  // Scene 6: Cold Future Office ("Ten years pass in an instant. A cold, lifeless office...")
  // Cold desaturated office: older pup slumped over mountains of paperwork
  shots.push({
    id: 's6',
    at: cut(5),
    note: 'Cold regret office cubicle',
    mood: 'cold',
    cam: [540, 960],
    zoom: 0.12,
    transition: 'fade-black',
    draw(lt, d, t) {
      drawColdOffice(t);
      // Older pup slumped over desk in cubicle
      drawPup(540, 1020, 1.45, { pose: 'slump', mood: 'exhausted', eyeDir: 0, headTilt: 0.15 });
    }
  });

  // Scene 7: Lying Awake ("Three in the morning. Lying awake in bed...")
  // Cold bedroom: pup awake holding glowing phone
  shots.push({
    id: 's7',
    at: cut(6),
    note: 'Cold bedroom phone glow',
    mood: 'cold',
    cam: [540, 920],
    zoom: 0.11,
    transition: 'none',
    draw(lt, d, t) {
      drawColdBedroomPhone(t);
      // Pup lying in bed illuminated by cyan light
      drawPup(540, 880, 1.5, { pose: 'awake-phone', mood: 'sad', eyeDir: 0, headTilt: -0.1 });
    }
  });

  // Scene 8: Mirror Regret ("In the dusty bathroom mirror, he clutches an old photo...")
  // Dusty mirror reflection: tired pup holding sepia photo
  shots.push({
    id: 's8',
    at: cut(7),
    note: 'Bathroom mirror with vintage photo',
    mood: 'cold',
    cam: [540, 820],
    zoom: 0.12,
    transition: 'none',
    draw(lt, d, t) {
      drawMirrorWithPhoto(t);
      // Older pup in foreground gazing into mirror
      drawPup(540, 720, 1.35, { pose: 'sit', mood: 'sad', eyeDir: 0 });
    }
  });

  // Scene 9: Return to the Room ("And suddenly, you are back in that warm room...")
  // Warm room returns: Wolf watching, contract clean
  shots.push({
    id: 's9',
    at: cut(8),
    note: 'Back to warm room, contract unsigned',
    mood: 'warm',
    cam: [540, 960],
    zoom: 0.12,
    transition: 'iris-in',
    draw(lt, d, t) {
      drawWarmDealRoom(t);
      drawContract(540, 1290, 0.75, false);
      drawWolf(360, 820, 1.35, { pose: 'stand', eyeDir: 1, teeth: true });
      drawPup(760, 1080, 1.25, { pose: 'sit', mood: 'worried', eyeDir: -1 });
    }
  });

  // Scene 10: The Moral ("Ten years were just handed back to you...")
  // Pup pushes pen away, stands tall with confidence. Iris-out.
  shots.push({
    id: 's10',
    at: cut(9),
    note: 'Pup rejects the deal, stands tall, iris-out',
    mood: 'warm',
    cam: [540, 880],
    zoom: 0.12,
    transition: 'iris-out',
    draw(lt, d, t) {
      drawWarmDealRoom(t);
      drawContract(540, 1290, 0.75, false);
      // Pup standing proud and upright
      drawPup(540, 860, 1.65, { pose: 'stand', mood: 'normal', eyeDir: 0 });
    }
  });

  // -------------------------------------------------------------------------
  // Sound Foley Cues
  // -------------------------------------------------------------------------
  // Line 0: Hook clock ticking
  cues.push({ t: cut(0) + 0.1, type: 'clock', dur: 3.5, gain: 0.8 });
  // Line 1: Pen slides on table
  cues.push({ t: cut(1) + 0.3, type: 'slide', dur: 0.8, gain: 0.7 });
  // Line 4: Quill writing scratch
  cues.push({ t: cut(4) + 1.2, type: 'pen', dur: 0.9, gain: 0.9 });
  // Line 5: Heavy thud / transition to office
  cues.push({ t: cut(5) + 0.1, type: 'thud', gain: 0.8 });
  // Line 6: Late night clock tock
  cues.push({ t: cut(6) + 0.1, type: 'tock', gain: 0.7 });
  // Line 8: Warm room return whoosh
  cues.push({ t: cut(8) + 0.1, type: 'whoosh', dur: 0.6, gain: 0.8 });

  return { shots, cues };
}
