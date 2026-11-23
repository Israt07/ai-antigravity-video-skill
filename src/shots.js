// THE MAN WHO DECLARED WAR ON EMUS (Tall Tale 3D).
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import { Toon, PROPS } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);

// Hand props
const binocularsProp = (g, x, y) => {
  g.save();
  g.translate(x, y - 40);
  g.fillStyle = '#263238';
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 5;
  g.beginPath();
  g.roundRect(-24, -30, 20, 50, 6);
  g.roundRect(4, -30, 20, 50, 6);
  g.fill();
  g.stroke();
  g.fillRect(-6, -15, 12, 8);
  g.restore();
};

const whiteFlagProp = (g, x, y) => {
  g.save();
  g.translate(x, y - 50);
  g.strokeStyle = '#5D4037';
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(0, 80);
  g.lineTo(0, -60);
  g.stroke();
  g.fillStyle = '#FFFFFF';
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(0, -60);
  g.lineTo(75, -45);
  g.lineTo(0, -30);
  g.closePath();
  g.fill();
  g.stroke();
  g.restore();
};

// 2D Cartoon Emu Drawing
function drawEmu(g, x, y, scale = 1, mood = 'smug', phase = 0, hat = 'none') {
  g.save();
  g.translate(x, y);
  g.scale(scale, scale);
  g.lineCap = 'round';
  g.lineJoin = 'round';

  // Legs
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 12;
  const legSwing = Math.sin(phase) * 35;
  g.beginPath();
  g.moveTo(-15, 60);
  g.lineTo(-25 + legSwing, 140);
  g.lineTo(-40 + legSwing, 155);
  g.stroke();
  g.beginPath();
  g.moveTo(15, 60);
  g.lineTo(25 - legSwing, 140);
  g.lineTo(10 - legSwing, 155);
  g.stroke();

  // Fluffy oval body
  g.fillStyle = '#4A3728';
  g.beginPath();
  g.ellipse(0, 30, 85, 65, -0.1, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  // Feathers
  g.fillStyle = '#3E2723';
  for (let i = -50; i <= 50; i += 25) {
    g.beginPath();
    g.ellipse(i, 35, 18, 25, 0.2, 0, Math.PI * 2);
    g.fill();
  }

  // S-curved neck
  g.strokeStyle = '#5D4037';
  g.lineWidth = 26;
  g.beginPath();
  g.moveTo(40, 10);
  g.quadraticCurveTo(80, -70, 50, -140);
  g.stroke();
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 6;
  g.stroke();

  // Head
  g.fillStyle = '#4A3728';
  g.beginPath();
  g.ellipse(55, -145, 34, 26, 0.1, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  // Beak
  g.fillStyle = '#FFB300';
  g.beginPath();
  g.moveTo(85, -152);
  g.lineTo(130, -142);
  g.lineTo(85, -132);
  g.closePath();
  g.fill();
  g.stroke();

  // Cartoon Eyes
  g.fillStyle = '#FFFFFF';
  g.beginPath();
  g.arc(65, -155, 14, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  g.fillStyle = '#1F1C33';
  const pupilX = mood === 'smug' ? 70 : 65;
  g.beginPath();
  g.arc(pupilX, -155, 6, 0, Math.PI * 2);
  g.fill();

  // Eyebrow
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 4;
  g.beginPath();
  g.arc(65, -172, 10, 0.2, 2.8);
  g.stroke();

  // Optional military beret
  if (hat === 'beret') {
    g.fillStyle = '#2E7D32';
    g.beginPath();
    g.ellipse(52, -170, 22, 10, -0.3, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    g.fillStyle = '#FFD700';
    g.beginPath();
    g.arc(42, -172, 4, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

// Cast definitions
const LOOK = {
  major: { body: '#6D4C41', hat: 'cap', hatCol: '#3E2723', pattern: 'vest', patCol: '#271B14', neck: 'tie', neckCol: '#C62828', extra: ['mustache'] },
  soldier1: { body: '#8D7B68', hat: 'boater', hatCol: '#A79277', pattern: 'overalls', patCol: '#543310' },
  soldier2: { body: '#A79277', hat: 'cap', hatCol: '#543310', pattern: 'plain' },
  minister: { body: '#37474F', hat: 'tophat', hatCol: '#212121', neck: 'bowtie', neckCol: '#B71C1C', extra: ['monocle'] },
  farmer: { body: '#4E342E', hat: 'bowler', hatCol: '#3E2723', pattern: 'apron', patCol: '#FFF8E1' },
};

const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36);
  const LOOKS = {
    field: { bloom: 0.25, aperture: 0.001, maxblur: 0.007 },
    room: { bloom: 0.3, aperture: 0.001, maxblur: 0.008 },
    street: { bloom: 0.15, aperture: 0.0012, maxblur: 0.008 },
  };

  const shoot = (scene, people, from, to, at, at2, k, look, focus) => {
    if (cam.fov !== (look.fov || 36)) { cam.fov = look.fov || 36; cam.updateProjectionMatrix(); }
    cam.position.copy(mix(from, to, k));
    cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam));
    E.render(scene, cam, { ...look, focus: focus ?? cam.position.distanceTo(at2 ? mix(at, at2, k) : at) });
  };

  // ── Sets ─────────────────────────────────────────────────────────────
  // Outback Meadow (Western Australia Campion district)
  const MD = WD.meadow(E, { fenceOn: true });
  MD.sun.key.position.set(10, 16, 8); MD.sun.key.target.position.set(0, 0, -4);
  const mdMajor = person('major');
  const mdSoldier1 = person('soldier1');
  const mdSoldier2 = person('soldier2');
  const mdFarmer = person('farmer');
  const mdHouse = PR.house({ wall: '#F2E6CF', roof: '#B5553C', door: '#3C6FB6' }); mdHouse.position.set(0, 0, -8); MD.scene.add(mdHouse);
  const mdPost = PR.signpost([['CAMPION 10 MI', 'r'], ['PERTH 200 MI', 'l']]); mdPost.position.set(5.0, 0, 1.5); MD.scene.add(mdPost);

  [mdMajor, mdSoldier1, mdSoldier2, mdFarmer].forEach((p) => MD.scene.add(p.group));
  const mdPeople = [mdMajor, mdSoldier1, mdSoldier2, mdFarmer];

  // Ministry of Defense Office
  const OF = WD.interior(E, { wall: '#3E505B', motif: '#4A606E', ceiling: '#263238', signText: 'WAR OFFICE' });
  const ofMinister = person('minister');
  const ofMajor = person('major');
  const ofDesk = PR.desk(2.4); ofDesk.position.set(0.4, 0, -3.2); OF.scene.add(ofDesk);
  [ofMinister, ofMajor].forEach((p) => OF.scene.add(p.group));
  const ofPeople = [ofMinister, ofMajor];

  // ── S01 · In 1932, Australia declared war on birds ─────────────────────
  {
    const st = cut(0);
    add({
      id: 'S01', at: st, note: 'Crane-down into the Australian outback; emu stands tall',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        mdMajor.group.visible = false; mdSoldier1.group.visible = false;
        mdSoldier2.group.visible = false; mdFarmer.group.visible = false;
        shoot(MD.scene, [], V3(0, 7.0, 10), V3(0, 2.2, 0), V3(0, 1.2, -8), null, k, { ...LOOKS.field, fov: 42 });
        blit();
        // Emu silhouette in center
        ctx.save();
        drawEmu(ctx, 540, 1100, 1.2, 'smug', 0);
        ctx.restore();
      }
    });
    cue(st + 0.05, 'whoosh', { gain: 0.6 });
    cue(Wd('war', 0), 'ding', { gain: 0.7 });
  }

  // ── S02 · And the birds completely destroyed them ─────────────────────
  {
    const st = cut(1);
    add({
      id: 'S02', at: st, note: 'Fast zoom: giant cartoon emu sprinting past dazed soldier',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        mdSoldier1.at(0, 0, -3.5);
        mdSoldier1.set({ mood: 'shock', sweat: 1, armL: [90, 20], armR: [90, 20] });
        mdSoldier1.group.visible = true;
        shoot(MD.scene, [mdSoldier1], V3(0, 1.8, -1.0), V3(0, 1.4, -2.0), V3(0, 1.1, -3.5), null, k, { ...LOOKS.field, fov: 36 });
        blit();
        // Emu speeding across screen
        ctx.save();
        const emuX = lerp(-200, 1280, clamp(lt / d));
        drawEmu(ctx, emuX, 980, 1.3, 'smug', t * 18);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.6 });
    cue(Wd('destroyed', 1), 'boing', { gain: 0.7 });
  }

  // ── S03 · 20,000 giant emus invaded wheat fields ──────────────────────
  {
    const st = cut(2);
    add({
      id: 'S03', at: st, note: 'Flock of emus gobbling crops in the wheat field',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        mdFarmer.at(-2.5, 0, -4.5);
        mdFarmer.set({ mood: 'worried', armL: [120, 20], armR: [120, 20], talk: talk(t) });
        mdFarmer.group.visible = true; mdSoldier1.group.visible = false;
        shoot(MD.scene, [mdFarmer], V3(-1.0, 3.5, 2.0), V3(-1.5, 2.2, -1.0), V3(-2.0, 1.2, -4.5), null, k, { ...LOOKS.field, fov: 44 });
        blit();
        // Multiple emus pecking wheat
        ctx.save();
        drawEmu(ctx, 320, 1150, 0.9, 'smug', t * 6);
        drawEmu(ctx, 740, 1200, 1.1, 'neutral', t * 8);
        drawEmu(ctx, 500, 1300, 0.8, 'smug', t * 7);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('emus', 2), 'gulp', { gain: 0.7 });
    cue(Wd('fields', 2), 'plop', { gain: 0.6 });
  }

  // ── S04 · eating crops and stomping fences into toothpicks ────────────
  {
    const st = cut(3);
    add({
      id: 'S04', at: st, note: 'Close-up of fence posts getting stomped',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        shoot(MD.scene, [], V3(4.0, 2.0, 1.0), V3(4.2, 1.4, 1.2), V3(5.0, 1.0, 1.5), null, k, { ...LOOKS.field, fov: 32 });
        blit();
        // Stomping emu foot in 2D
        ctx.save();
        const stompY = lerp(400, 1100, eo(clamp(lt * 2.0)));
        drawEmu(ctx, 540, stompY, 1.6, 'smug', 0);
        // Splintered wood text
        ctx.fillStyle = '#D32F2F';
        ctx.font = '900 72px Inter';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#1F1C33';
        ctx.lineWidth = 10;
        ctx.strokeText('CRUNCH!', 540, 520);
        ctx.fillText('CRUNCH!', 540, 520);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('stomping', 3), 'slam', { gain: 0.9 });
    cue(Wd('toothpicks', 3), 'thud', { gain: 0.7 });
  }

  // ── S05 · Minister sent in Major Meredith ─────────────────────────────
  {
    const st = cut(4);
    add({
      id: 'S05', at: st, note: 'War office: Minister orders Major Meredith',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        ofMinister.at(-0.8, 0, -3.5);
        ofMinister.set({ mood: 'angry', talk: talk(t), armR: [80, 20] });
        ofMajor.at(1.2, 0, -3.5);
        ofMajor.set({ mood: 'proud', armL: [100, 50] }); // Saluting
        shoot(OF.scene, ofPeople, V3(0.2, 2.0, -1.0), V3(0.2, 1.6, -1.8), V3(0.2, 1.3, -3.5), null, k, { ...LOOKS.room, fov: 36 });
        blit();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('Meredith', 4), 'tock', { gain: 0.7 });
  }

  // ── S06 · armed with heavy machine guns and 10,000 rounds ──────────────
  {
    const st = cut(5);
    add({
      id: 'S06', at: st, note: 'Soldiers set up heavy machine gun on tripod',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        mdSoldier1.at(-0.8, 0, -3.5);
        mdSoldier1.set({ mood: 'neutral', armL: [40, 30], armR: [40, 30] }); mdSoldier1.group.visible = true;
        mdSoldier2.at(1.0, 0, -3.5);
        mdSoldier2.set({ mood: 'proud', armL: [30, 20], armR: [30, 20] }); mdSoldier2.group.visible = true;
        shoot(MD.scene, [mdSoldier1, mdSoldier2], V3(0, 2.2, -1.2), V3(0, 1.6, -2.0), V3(0, 1.1, -3.5), null, k, { ...LOOKS.field, fov: 36 });
        blit();
        // 2D Machine Gun Overlay
        ctx.save();
        ctx.translate(540, 1200);
        ctx.fillStyle = '#263238';
        ctx.strokeStyle = '#1F1C33';
        ctx.lineWidth = 8;
        // Tripod legs
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(-80, 140);
        ctx.moveTo(0, 0); ctx.lineTo(80, 140);
        ctx.moveTo(0, 0); ctx.lineTo(0, 150);
        ctx.stroke();
        // Gun barrel
        ctx.fillRect(-60, -30, 220, 40);
        ctx.strokeRect(-60, -30, 220, 40);
        // Pan magazine
        ctx.beginPath();
        ctx.ellipse(20, -45, 55, 20, 0, 0, 7);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    });
    cue(st + 0.02, 'chug', { gain: 0.6 });
    cue(Wd('machine', 5), 'slam', { gain: 0.7 });
    cue(Wd('rounds', 5), 'pop', { gain: 0.6 });
  }

  // ── S07 · The plan was simple: corner flock and open fire ──────────────
  {
    const st = cut(6);
    add({
      id: 'S07', at: st, note: 'Major looks through binoculars and points',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        mdMajor.at(0, 0, -3.5);
        mdMajor.set({ mood: 'smug', holdR: binocularsProp, armR: [80, 50], armL: [70, 20] }); mdMajor.group.visible = true;
        mdSoldier1.group.visible = false; mdSoldier2.group.visible = false;
        shoot(MD.scene, [mdMajor], V3(-0.4, 1.8, -1.8), V3(0, 1.5, -2.5), V3(0, 1.2, -3.5), null, k, { ...LOOKS.field, fov: 32 });
        blit();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('fire', 6), 'ding', { gain: 0.7 });
  }

  // ── S08 · Except emus can sprint 40 miles an hour ─────────────────────
  {
    const st = cut(7);
    add({
      id: 'S08', at: st, note: 'Speedometer badge: 40 MPH with emu speeding past',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        shoot(MD.scene, [], V3(0, 2.0, 0), V3(0, 1.6, -1.5), V3(0, 1.2, -4.0), null, k, { ...LOOKS.field, fov: 36 });
        blit();
        // Emu zooming across screen with speed lines
        ctx.save();
        const emuX = lerp(-300, 1400, clamp(lt / d));
        drawEmu(ctx, emuX, 950, 1.4, 'smug', t * 24);

        // Speedometer badge
        ctx.translate(540, 420);
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#1F1C33';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.roundRect(-220, -70, 440, 140, 25);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#D32F2F';
        ctx.font = '900 76px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('40 MPH!', 0, 26);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.6 });
    cue(Wd('miles', 7), 'zip', { gain: 0.8 });
  }

  // ── S09 · and had unexpectedly brilliant military tactics ──────────────
  {
    const st = cut(8);
    add({
      id: 'S09', at: st, note: 'Two emus with commander berets nodding wisely',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        shoot(MD.scene, [], V3(2.0, 2.0, 0), V3(2.2, 1.5, -1.0), V3(2.5, 1.1, -3.0), null, k, { ...LOOKS.field, fov: 34 });
        blit();
        ctx.save();
        drawEmu(ctx, 360, 1050, 1.1, 'smug', 0, 'beret');
        drawEmu(ctx, 720, 1070, 1.0, 'smug', 0, 'beret');
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('tactics', 8), 'chirp', { gain: 0.7 });
    cue(Wd('tactics', 8) + 0.1, 'pop', { gain: 0.6 });
  }

  // ── S10 · birds scattered into guerrilla squads ────────────────────────
  {
    const st = cut(9);
    add({
      id: 'S10', at: st, note: 'Soldiers aim machine gun but emus scatter all directions',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        mdSoldier1.at(-0.8, 0, -3.5);
        mdSoldier1.set({ mood: 'shock', armL: [60, 20], armR: [60, 20] }); mdSoldier1.group.visible = true;
        shoot(MD.scene, [mdSoldier1], V3(0, 2.4, -0.5), V3(0, 1.8, -1.8), V3(0, 1.1, -3.5), null, k, { ...LOOKS.field, fov: 42 });
        blit();
        // Emus scattering left and right
        ctx.save();
        const escL = lerp(450, -200, clamp(lt / d));
        const escR = lerp(630, 1300, clamp(lt / d));
        drawEmu(ctx, escL, 1000, 1.0, 'smug', t * 20);
        drawEmu(ctx, escR, 1040, 1.1, 'smug', t * 20);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.6 });
    cue(Wd('scattered', 9), 'slide', { gain: 0.7 });
  }

  // ── S11 · ducking behind trees while guns jammed ───────────────────────
  {
    const st = cut(10);
    add({
      id: 'S11', at: st, note: 'Machine gun sputters smoke rings; soldiers sweat',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        mdSoldier1.at(0, 0, -3.5);
        mdSoldier1.set({ mood: 'worried', sweat: 1, armL: [70, -40], armR: [70, -40] }); mdSoldier1.group.visible = true;
        shoot(MD.scene, [mdSoldier1], V3(0, 1.8, -1.8), V3(0, 1.4, -2.4), V3(0, 1.1, -3.5), null, k, { ...LOOKS.field, fov: 32 });
        blit();
        // Jammed gun smoke rings in 2D
        ctx.save();
        ctx.strokeStyle = '#90A4AE';
        ctx.lineWidth = 8;
        const ringY = (t * 120) % 300;
        ctx.beginPath(); ctx.arc(540, 850 - ringY, 30 + ringY * 0.2, 0, 7); ctx.stroke();
        ctx.fillStyle = '#D32F2F';
        ctx.font = '900 68px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('*CLICK CLICK*', 540, 480);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'boing', { gain: 0.6 });
    cue(Wd('jammed', 10), 'pop', { gain: 0.7 });
    cue(Wd('jammed', 10) + 0.1, 'tock', { gain: 0.7 });
  }

  // ── S12 · One emu took hits, shrugged, and kept running ────────────────
  {
    const st = cut(11);
    add({
      id: 'S12', at: st, note: 'Hero emu shrugs off dust, winks, and keeps running',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        shoot(MD.scene, [], V3(0, 2.0, 0), V3(0, 1.5, -1.2), V3(0, 1.1, -3.0), null, k, { ...LOOKS.field, fov: 34 });
        blit();
        ctx.save();
        const emuX = lerp(450, 750, clamp(lt / d));
        drawEmu(ctx, emuX, 980, 1.3, 'smug', t * 14);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('shrugged', 11), 'boing', { gain: 0.6 });
    cue(Wd('running', 11), 'sparkle', { gain: 0.7 });
  }

  // ── S13 · Major Meredith lost his mind: emus built like tanks ─────────
  {
    const st = cut(12);
    add({
      id: 'S13', at: st, note: 'Major clutches head in shock; EMU TANK thought bubble',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        mdMajor.at(0, 0, -3.5);
        mdMajor.set({ mood: 'shock', sweat: 1, armL: [130, 40], armR: [130, 40], lean: Math.sin(t * 8) * 6 }); mdMajor.group.visible = true;
        shoot(MD.scene, [mdMajor], V3(0, 1.9, -1.5), V3(0, 1.4, -2.4), V3(0, 1.1, -3.5), null, k, { ...LOOKS.field, fov: 32 });
        blit();
        // Thought bubble: EMU = TANK
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#1F1C33';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.roundRect(240, 360, 600, 180, 30);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#263238';
        ctx.font = '900 52px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('"THEY ARE BUILT', 540, 435);
        ctx.fillText('LIKE TANKS!"', 540, 500);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('mind', 12), 'boing', { gain: 0.7 });
    cue(Wd('tanks', 12), 'thud', { gain: 0.9 });
  }

  // ── S14 · Australian army withdrew in defeat ──────────────────────────
  {
    const st = cut(13);
    add({
      id: 'S14', at: st, note: 'Soldiers wave white surrender flag and retreat',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        mdSoldier1.at(-0.5, 0, -3.8);
        mdSoldier1.set({ mood: 'worried', holdR: whiteFlagProp, armR: [60, 20] }); mdSoldier1.group.visible = true;
        mdMajor.at(1.0, 0, -4.2);
        mdMajor.set({ mood: 'tired', armL: [10, 10], armR: [10, 10] }); mdMajor.group.visible = true;
        shoot(MD.scene, [mdSoldier1, mdMajor], V3(0, 2.0, -1.8), V3(0, 1.6, -2.6), V3(0, 1.1, -4.0), null, k, { ...LOOKS.field, fov: 36 });
        blit();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('defeat', 13), 'chirp', { gain: 0.6 });
  }

  // ── S15 · Never challenge a six-foot bird ─────────────────────────────
  {
    const st = cut(14);
    add({
      id: 'S15', at: st, note: 'Heroic emu poses proudly at sunset with gold medal',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        shoot(MD.scene, [], V3(0, 2.2, 0), V3(0, 1.6, -1.5), V3(0, 1.2, -4.0), null, k, { ...LOOKS.field, fov: 34 });
        blit();
        ctx.save();
        drawEmu(ctx, 540, 1000, 1.5, 'smug', 0);
        // Gold medal on chest
        ctx.translate(560, 990);
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#1F1C33';
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.arc(0, 0, 24, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#D32F2F';
        ctx.beginPath(); ctx.arc(0, 0, 10, 0, 7); ctx.fill();
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('bird', 14), 'sparkle', { gain: 0.7 });
  }

  // ── S16 · to a gunfight on its home turf ──────────────────────────────
  {
    const st = cut(15);
    add({
      id: 'S16', at: st, note: 'Outback signpost: EMU TERRITORY, victory stamp',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        shoot(MD.scene, [], V3(4.2, 1.8, 1.0), V3(4.6, 1.4, 1.2), V3(5.0, 1.0, 1.5), null, k, { ...LOOKS.field, fov: 32 });
        blit();
        // Title card stamp: VICTORY 1932
        ctx.save();
        ctx.translate(540, 1380);
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#1F1C33';
        ctx.lineWidth = 12;
        ctx.font = '900 66px Inter';
        ctx.textAlign = 'center';
        ctx.strokeText('EMUS: 1  ARMY: 0', 0, -40);
        ctx.fillText('EMUS: 1  ARMY: 0', 0, -40);
        ctx.font = '900 52px Inter';
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeText('VICTORY 1932', 0, 35);
        ctx.fillText('VICTORY 1932', 0, 35);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('gunfight', 15), 'slam', { gain: 0.8 });
    cue(Wd('turf', 15), 'stamp', { gain: 0.9 });
  }

  return { shots: S, cues: CUES };
}
