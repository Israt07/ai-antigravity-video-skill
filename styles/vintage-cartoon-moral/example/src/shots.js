// Shots for The Last Warm Meal (1930s Vintage Cartoon Moral)
// 23 shots across 11 narration lines (each line cut into 2-3 shots of 1.5-3.5s with varied framings).
// No more than 2 consecutive shots with the same framing.
// Tight close-ups on emotional lines, readable character faces, and non-overlapping caption zones.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { T, L, Le } from './core/timing.js';
import {
  C,
  drawFox,
  drawRabbit,
  drawCartoonGlove,
  drawCrossroadsInnExterior,
  drawWarmInnInterior,
  drawSteamingStew,
  drawTravelBag,
  drawColdDiner,
  drawTrainPlatform,
  drawClock3AM,
  drawTicketCloseUp
} from './core/kit.js';

export function buildShots() {
  const shots = [];
  const cues = [];

  // Helper to split a line into proportional cuts
  const span = (i) => Le(i) - L(i);

  // -------------------------------------------------------------------------
  // LINE 0: "What if one warm meal kept you in a place you were never meant to stay?"
  // -------------------------------------------------------------------------
  // Cut 1: Wide inn exterior in blizzard
  shots.push({
    id: 's01',
    at: L(0),
    note: 'Wide: Crossroads inn exterior in blizzard',
    mood: 'warm',
    cam: [540, 960],
    zoom: 0.08,
    transition: 'iris-in',
    capY: 1520,
    draw(lt, d, t) {
      drawCrossroadsInnExterior(t);
    }
  });

  // Cut 2: Medium push-in on glowing warm tavern window
  shots.push({
    id: 's02',
    at: L(0) + span(0) * 0.5,
    note: 'Medium: Push-in on glowing tavern window and silhouette',
    mood: 'warm',
    cam: [540, 880],
    zoom: 0.14,
    capY: 1520,
    draw(lt, d, t) {
      drawCrossroadsInnExterior(t);
      // Silhouette of Fox inside through window
      ctx.fillStyle = 'rgba(25, 15, 8, 0.85)';
      ctx.beginPath();
      ctx.arc(540, 830, 48, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // -------------------------------------------------------------------------
  // LINE 1: "A tired rabbit steps inside an old roadside inn, shivering from the winter storm."
  // -------------------------------------------------------------------------
  // Cut 3: Low-angle tavern door swinging open
  shots.push({
    id: 's03',
    at: L(1),
    note: 'Low-angle: Tavern door swinging open with cold wind',
    mood: 'warm',
    cam: [540, 1080],
    zoom: 0.12,
    capY: 1520,
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      // Open timber door at left with snow blowing in
      ctx.save();
      ctx.fillStyle = '#18120B';
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 12;
      ctx.fillRect(80, 500, 220, 760);
      ctx.strokeRect(80, 500, 220, 760);
      // Snow blowing through doorway
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let k = 0; k < 18; k++) {
        const sx = 100 + ((k * 37 + lt * 380) % 240);
        const sy = 600 + ((k * 53 + lt * 220) % 550);
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      // Rabbit stepping through
      drawRabbit(360, 940, 1.35, { pose: 'shiver', mood: 'cold', eyeDir: 1, shiverT: lt * 25 });
    }
  });

  // Cut 4: Medium shot of shivering rabbit in wet coat & red scarf
  shots.push({
    id: 's04',
    at: L(1) + span(1) * 0.5,
    note: 'Medium: Tired rabbit shivering in coat and red scarf',
    mood: 'warm',
    cam: [540, 820],
    zoom: 0.16,
    capY: 1520,
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      const shiver = Math.sin(lt * 30) * 3;
      drawRabbit(540 + shiver, 860, 1.6, { pose: 'shiver', mood: 'cold', eyeDir: 0, shiverT: lt * 30 });
    }
  });

  // -------------------------------------------------------------------------
  // LINE 2: "The fox behind the counter slides over hot stew: 'Eat up, kid. First bowl is free.'"
  // -------------------------------------------------------------------------
  // Cut 5: Insert of steaming stew bowl sliding across the wooden bar
  shots.push({
    id: 's05',
    at: L(2),
    note: 'Insert: Steaming stew bowl sliding across the counter',
    mood: 'warm',
    cam: [540, 1060],
    zoom: 0.14,
    capY: 340, // caption at top to keep bowl completely clear
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      // Sliding motion
      const p = clamp(lt / 1.6, 0, 1);
      const bowlX = lerp(320, 560, eo(p));
      // Fox arm sliding bowl in background
      drawCartoonGlove(bowlX - 110, 1140, 1.1, -0.4);
      drawSteamingStew(bowlX, 1150, 1.4, t);
    }
  });

  // Cut 6: Tight close-up on Fox's face with bowler hat and toothy grin
  shots.push({
    id: 's06',
    at: L(2) + span(2) * 0.5,
    note: 'Close-up: Fox tavern keeper toothy grin in bowler hat',
    mood: 'warm',
    cam: [540, 700],
    zoom: 0.25,
    capY: 1540, // face is at y: 700, caption far below at 1540
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      drawFox(540, 740, 2.3, { pose: 'stand', eyeDir: 0, teeth: true, mouth: 'grin' });
    }
  });

  // -------------------------------------------------------------------------
  // LINE 3: "The rabbit clutches his packed bag: 'I should keep moving. My train leaves tonight.'"
  // -------------------------------------------------------------------------
  // Cut 7: Over-the-shoulder shot on rabbit clutching travel bag
  shots.push({
    id: 's07',
    at: L(3),
    note: 'Over-the-shoulder: Rabbit clutching travel bag at bar',
    mood: 'warm',
    cam: [600, 850],
    zoom: 0.16,
    capY: 1520,
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      // Steaming stew on counter
      drawSteamingStew(440, 1220, 1.0, t);
      // Rabbit in foreground clutching bag
      drawRabbit(620, 900, 1.6, { pose: 'clutch', mood: 'worried', eyeDir: -1, headTilt: -0.06 });
    }
  });

  // Cut 8: Tight close-up on Rabbit's face: worried round pie-eyes & floppy ears
  shots.push({
    id: 's08',
    at: L(3) + span(3) * 0.5,
    note: 'Close-up: Rabbit worried round pie-eyes close-up',
    mood: 'warm',
    cam: [540, 700],
    zoom: 0.26,
    capY: 1540,
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      const earTilt = Math.sin(lt * 3) * 0.04;
      drawRabbit(540, 740, 2.3, { pose: 'clutch', mood: 'worried', eyeDir: 0, headTilt: earTilt });
    }
  });

  // -------------------------------------------------------------------------
  // LINE 4: "'The tracks are frozen,' the fox purrs with a wink. 'Just stay until morning.'"
  // -------------------------------------------------------------------------
  // Cut 9: Medium shot of Fox leaning on bar with sly half-smile
  shots.push({
    id: 's09',
    at: L(4),
    note: 'Medium: Fox leaning on bar polishing glass',
    mood: 'warm',
    cam: [480, 820],
    zoom: 0.15,
    capY: 1520,
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      drawFox(480, 840, 1.65, { pose: 'stand', eyeDir: 1, teeth: true });
    }
  });

  // Cut 10: Extreme close-up on Fox's sly wink and sharp canine teeth
  shots.push({
    id: 's10',
    at: L(4) + span(4) * 0.5,
    note: 'Extreme close-up: Fox sly wink and sharp canine teeth',
    mood: 'warm',
    cam: [540, 680],
    zoom: 0.35,
    capY: 1550,
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      const isWinking = lt > 0.4 && lt < 2.0;
      drawFox(540, 700, 2.7, { pose: 'stand', eyeDir: 0, wink: isWinking, teeth: true });
    }
  });

  // -------------------------------------------------------------------------
  // LINE 5: "He stayed that morning. And the next. And twenty years vanished in the dark."
  // -------------------------------------------------------------------------
  // Cut 11: Wide tavern bar, rabbit sitting alone as shadows lengthen
  shots.push({
    id: 's11',
    at: L(5),
    note: 'Wide: Rabbit sitting alone at counter as time passes',
    mood: 'warm',
    cam: [540, 960],
    zoom: 0.09,
    capY: 1520,
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      drawSteamingStew(620, 1220, 0.9, t);
      drawRabbit(440, 980, 1.3, { pose: 'sit', mood: 'normal', eyeDir: 1 });
    }
  });

  // Cut 12: Medium shot: warm amber light drains to cold slate, iris-out
  shots.push({
    id: 's12',
    at: L(5) + span(5) * 0.5,
    note: 'Medium: Warm amber drains to cold slate, iris-out',
    mood: 'warm',
    cam: [540, 880],
    zoom: 0.14,
    transition: 'iris-out',
    capY: 1520,
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      // Darkening shadow wash
      ctx.fillStyle = `rgba(15, 20, 30, ${clamp(lt / d * 0.75)})`;
      ctx.fillRect(0, 0, W, H);
      drawRabbit(540, 880, 1.5, { pose: 'sit', mood: 'tired', eyeDir: 0 });
    }
  });

  // -------------------------------------------------------------------------
  // LINE 6: "A cold highway diner under buzzing fluorescent tubes. An older rabbit wipes the counter."
  // -------------------------------------------------------------------------
  // Cut 13: Wide shot of desolate cold highway diner
  shots.push({
    id: 's13',
    at: L(6),
    note: 'Wide: Desolate cold highway diner under buzzing fluorescent tube',
    mood: 'cold',
    cam: [540, 960],
    zoom: 0.08,
    transition: 'fade-black',
    capY: 1520,
    draw(lt, d, t) {
      drawColdDiner(t);
    }
  });

  // Cut 14: Medium shot of older rabbit with eye bags wiping the counter
  shots.push({
    id: 's14',
    at: L(6) + span(6) * 0.5,
    note: 'Medium: Older rabbit with eye bags wiping counter with rag',
    mood: 'cold',
    cam: [540, 860],
    zoom: 0.15,
    capY: 1520,
    draw(lt, d, t) {
      drawColdDiner(t);
      const wipeMotion = Math.sin(lt * 4) * 20;
      drawRabbit(540 + wipeMotion * 0.3, 860, 1.55, { pose: 'sit', mood: 'tired', eyeDir: 0, hasBag: false });
    }
  });

  // -------------------------------------------------------------------------
  // LINE 7: "Out on the rusted platform, the midnight train pulls away, disappearing into the fog."
  // -------------------------------------------------------------------------
  // Cut 15: Wide shot of rusted platform in freezing fog with swinging lantern
  shots.push({
    id: 's15',
    at: L(7),
    note: 'Wide: Train platform in freezing fog with swinging lantern',
    mood: 'cold',
    cam: [540, 940],
    zoom: 0.09,
    capY: 1520,
    draw(lt, d, t) {
      drawTrainPlatform(t);
    }
  });

  // Cut 16: Insert of train caboose with glowing red lantern rolling into dark mist
  shots.push({
    id: 's16',
    at: L(7) + span(7) * 0.5,
    note: 'Insert: Train caboose and red marker lantern disappearing into mist',
    mood: 'cold',
    cam: [540, 880],
    zoom: 0.16,
    capY: 340, // caption at top so red lantern and tracks remain visible
    draw(lt, d, t) {
      drawTrainPlatform(t + 1.5);
    }
  });

  // -------------------------------------------------------------------------
  // LINE 8: "Three in the morning. In shaking paws, he unfolds the ticket he never used."
  // -------------------------------------------------------------------------
  // Cut 17: Insert of wall clock ticking at 3:00 AM under cold cyan glare
  shots.push({
    id: 's17',
    at: L(8),
    note: 'Insert: Wall clock ticking at 3:00 AM under cyan glare',
    mood: 'cold',
    cam: [540, 640],
    zoom: 0.22,
    capY: 1520,
    draw(lt, d, t) {
      drawColdDiner(t);
      drawClock3AM(540, 620, 1.3);
    }
  });

  // Cut 18: Extreme close-up: trembling paws unfolding yellowed unused ticket
  shots.push({
    id: 's18',
    at: L(8) + span(8) * 0.5,
    note: 'Extreme close-up: Trembling paws unfold yellowed railway ticket',
    mood: 'cold',
    cam: [540, 1020],
    zoom: 0.35,
    capY: 340, // caption at top so the entire ticket text is readable
    draw(lt, d, t) {
      drawColdDiner(t);
      const tremble = Math.sin(lt * 35) * 2;
      drawTicketCloseUp(540 + tremble, 1040, 1.4);
    }
  });

  // -------------------------------------------------------------------------
  // LINE 9: "Suddenly, you snap back to the warm tavern. The stew is hot. Your bag is packed."
  // -------------------------------------------------------------------------
  // Cut 19: Wide shot: Tavern returns with warm amber light and steaming stew
  shots.push({
    id: 's19',
    at: L(9),
    note: 'Wide: Snap back to warm tavern, steaming stew on counter',
    mood: 'warm',
    cam: [540, 960],
    zoom: 0.09,
    transition: 'iris-in',
    capY: 1520,
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      drawSteamingStew(540, 1220, 1.1, t);
    }
  });

  // Cut 20: Medium shot: Packed bag sitting on the stool next to the rabbit
  shots.push({
    id: 's20',
    at: L(9) + span(9) * 0.5,
    note: 'Medium: Packed travel bag sitting on stool beside rabbit',
    mood: 'warm',
    cam: [540, 880],
    zoom: 0.14,
    capY: 1520,
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      drawSteamingStew(680, 1220, 0.9, t);
      drawTravelBag(340, 1180, 1.2);
      drawRabbit(480, 880, 1.5, { pose: 'sit', mood: 'normal', eyeDir: -1, hasBag: false });
    }
  });

  // -------------------------------------------------------------------------
  // LINE 10: "The fox smiles: 'One more night?' You grab your coat and walk into the snow."
  // -------------------------------------------------------------------------
  // Cut 21: Close-up on Fox smiling across the counter
  shots.push({
    id: 's21',
    at: L(10),
    note: 'Close-up: Fox smiling warmly across the counter',
    mood: 'warm',
    cam: [480, 700],
    zoom: 0.24,
    capY: 1540,
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      drawFox(480, 720, 2.3, { pose: 'stand', eyeDir: 1, mouth: 'smile', teeth: false });
    }
  });

  // Cut 22: Close-up on Rabbit's face: determined round pie-eyes, gripping scarf
  shots.push({
    id: 's22',
    at: L(10) + span(10) * 0.38,
    note: 'Close-up: Rabbit determined pie-eyes, gripping travel satchel',
    mood: 'warm',
    cam: [540, 700],
    zoom: 0.26,
    capY: 1540,
    draw(lt, d, t) {
      drawWarmInnInterior(t);
      drawRabbit(540, 720, 2.3, { pose: 'clutch', mood: 'determined', eyeDir: 0 });
    }
  });

  // Cut 23: Wide shot: Rabbit steps out through tavern doorway into the falling snow
  shots.push({
    id: 's23',
    at: L(10) + span(10) * 0.72,
    note: 'Wide: Rabbit walking out into the snow, iris-out',
    mood: 'warm',
    cam: [540, 940],
    zoom: 0.10,
    transition: 'iris-out',
    capY: 1520,
    draw(lt, d, t) {
      drawCrossroadsInnExterior(t);
      // Rabbit walking away into the snowy path
      const walkP = clamp(lt / d, 0, 1);
      const rx = lerp(540, 680, walkP);
      const ry = lerp(960, 1050, walkP);
      drawRabbit(rx, ry, 1.1, { pose: 'stand', mood: 'determined', eyeDir: 1 });
    }
  });

  // -------------------------------------------------------------------------
  // Sound Foley Cues
  // -------------------------------------------------------------------------
  cues.push({ t: L(0) + 0.1, type: 'whoosh', dur: 0.8, gain: 0.7 });
  cues.push({ t: L(1) + 0.1, type: 'slide', dur: 0.6, gain: 0.7 });
  cues.push({ t: L(2) + 0.2, type: 'slide', dur: 0.8, gain: 0.8 });
  cues.push({ t: L(5) + span(5) * 0.5, type: 'thud', gain: 0.85 });
  cues.push({ t: L(7) + 0.2, type: 'whistle', dur: 1.4, gain: 0.85 });
  cues.push({ t: L(8) + 0.1, type: 'clock', dur: 2.5, gain: 0.75 });
  cues.push({ t: L(8) + span(8) * 0.5, type: 'paper', dur: 0.7, gain: 0.8 });
  cues.push({ t: L(9) + 0.1, type: 'whoosh', dur: 0.6, gain: 0.8 });
  cues.push({ t: L(10) + span(10) * 0.72, type: 'slide', dur: 0.6, gain: 0.7 });

  return { shots, cues };
}
