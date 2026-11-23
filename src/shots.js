// THE WOMAN WHO ACCIDENTALLY BECAME A QUEEN FOR ONE DAY (Tall Tale 3D).
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

// Custom hand props
const breadProp = (g, x, y) => {
  g.save();
  g.translate(x, y - 50);
  g.rotate(0.3);
  g.fillStyle = '#D9A05B';
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 6;
  g.beginPath();
  g.roundRect(-24, -70, 48, 140, 24);
  g.fill();
  g.stroke();
  g.fillStyle = '#F2E6CF';
  g.fillRect(-25, -20, 50, 55);
  g.strokeRect(-25, -20, 50, 55);
  g.strokeStyle = '#8B5A2B';
  g.lineWidth = 4;
  for (let i = -50; i <= 50; i += 25) {
    g.beginPath();
    g.moveTo(-10, i - 6);
    g.lineTo(10, i + 6);
    g.stroke();
  }
  g.restore();
};

const pastryProp = (g, x, y) => {
  g.save();
  g.translate(x, y - 30);
  g.fillStyle = '#C67A32';
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 5;
  g.beginPath();
  g.arc(0, 0, 28, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  g.strokeStyle = '#FFF8E1';
  g.lineWidth = 4;
  g.beginPath();
  g.arc(0, 0, 16, 0.4, 4.2);
  g.stroke();
  g.restore();
};

// Cast definitions
const LOOK = {
  clara: { body: '#F48FB1', hat: 'bun', hatCol: '#8D6E63', pattern: 'apron', patCol: '#3F51B5', dots: 1, extra: ['blush', 'freckles'] },
  claraQueen: { body: '#F48FB1', hat: 'crown', hatCol: '#FFD700', pattern: 'apron', patCol: '#3F51B5', dots: 1, extra: ['blush', 'freckles'] },
  mayor: { body: '#5C6BC0', hat: 'tophat', hatCol: '#263238', neck: 'bowtie', neckCol: '#E53935', pattern: 'vest', patCol: '#1A237E', extra: ['mustache'] },
  baker: { body: '#FFB74D', hat: 'cap', hatCol: '#FFF8E1', pattern: 'apron', patCol: '#FFFFFF', extra: ['mustache'] },
  herald: { body: '#43A047', hat: 'cap', hatCol: '#1B5E20', neck: 'tie', neckCol: '#FDD835' },
  kid: { body: '#4FC3F7', kid: true, hat: 'beanie', hatCol: '#E91E63' },
  queen: { body: '#8E24AA', hat: 'crown', hatCol: '#FFD700', neck: 'collar', pattern: 'plain', extra: ['monocle', 'blush'] },
  villager1: { body: '#795548', hat: 'bowler', hatCol: '#3E2723', pattern: 'overalls', patCol: '#1E88E5' },
  villager2: { body: '#8D6E63', hat: 'boater', hatCol: '#E8C77A', pattern: 'vest', patCol: '#5D4037' },
};

const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36);
  const LOOKS = {
    street: { bloom: 0.15, aperture: 0.0012, maxblur: 0.008 },
    room: { bloom: 0.3, aperture: 0.001, maxblur: 0.008 },
    field: { bloom: 0.25, aperture: 0.001, maxblur: 0.007 }
  };

  const shoot = (scene, people, from, to, at, at2, k, look, focus) => {
    if (cam.fov !== (look.fov || 36)) { cam.fov = look.fov || 36; cam.updateProjectionMatrix(); }
    cam.position.copy(mix(from, to, k));
    cam.lookAt(at2 ? mix(at, at2, k) : at);
    people.forEach((p) => p.face(cam));
    E.render(scene, cam, { ...look, focus: focus ?? cam.position.distanceTo(at2 ? mix(at, at2, k) : at) });
  };

  // ── Sets ─────────────────────────────────────────────────────────────
  const SHOP_ORDER = [
    ['BAKERY', '#C9603F', 'brick', '#D8343F'],
    ['TOWN HALL', '#7FA36A', 'brick', '#2E4E8A'],
    ['CAFE', '#E58A6A', 'wood', '#2E4E3F'],
    ['GENERAL STORE', '#6FA3B8', 'wood', null],
    ['BARBER', '#E3C16F', 'wood', '#3C6FB6'],
    ['GRAND HOTEL', '#9E4A3A', 'brick', null],
  ];

  const ST = WD.mainStreet(E, { shops: SHOP_ORDER });
  ST.sun.key.target.position.set(-4, 0, 0); ST.sun.key.position.set(5, 13, 6);
  const BK = ST.buildings.find((b) => b.name === 'BAKERY') || { z: -4 };

  const stClara = person('clara');
  const stMayor = person('mayor');
  const stBaker = person('baker');
  const stHerald = person('herald');
  const stKid = person('kid', { height: 1.35 });
  const stQueen = person('queen');
  const stV1 = person('villager1');
  const stV2 = person('villager2');

  [stClara, stMayor, stBaker, stHerald, stKid, stQueen, stV1, stV2].forEach((p) => ST.scene.add(p.group));
  const streetPeople = () => [stClara, stMayor, stBaker, stHerald, stKid, stQueen, stV1, stV2];

  // Interior: Town Hall
  const TH = WD.interior(E, { wall: '#2F6B5A', motif: '#3B7D69', ceiling: '#5A3A2A', signText: 'TOWN HALL' });
  const thMayor = person('mayor');
  const thHerald = person('herald');
  const thDesk = PR.desk(2.4); thDesk.position.set(0.4, 0, -3.2); TH.scene.add(thDesk);
  [thMayor, thHerald].forEach((p) => TH.scene.add(p.group));
  const thPeople = [thMayor, thHerald];

  // Countryside / Meadow
  const MD = WD.meadow(E, { fenceOn: true });
  const mdClara = person('clara');
  const mdMayor = person('mayor');
  const mdKid = person('kid', { height: 1.35 });
  const mdHouse = PR.house({ wall: '#F2E6CF', roof: '#B5553C', door: '#3C6FB6' }); mdHouse.position.set(0, 0, -6); MD.scene.add(mdHouse);
  [mdClara, mdMayor, mdKid].forEach((p) => MD.scene.add(p.group));
  const mdPeople = [mdClara, mdMayor, mdKid];

  // ── S01 · HOOK: She went to buy a loaf of bread ──────────────────────
  {
    const st = cut(0);
    add({
      id: 'S01', at: st, note: 'Clara walking down sunny street holding fresh bread',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        const z = BK.z;
        stClara.at(-5.0, 0.18, z - 3.0 + k * 1.8);
        stClara.set({ legs: 'walk', phase: t * 7, mood: 'happy', holdR: breadProp, blink: blink(t) });
        stMayor.group.visible = false; stBaker.group.visible = false; stHerald.group.visible = false;
        stKid.group.visible = false; stQueen.group.visible = false; stV1.group.visible = false; stV2.group.visible = false;
        shoot(ST.scene, [stClara], V3(-1.0, 4.5, z - 12), V3(-3.2, 1.7, z - 5.5), V3(-3.5, 2.0, z), V3(-5.0, 1.2, z - 1.2), k, { ...LOOKS.street, fov: 42 });
        blit();
      }
    });
    cue(st + 0.05, 'whoosh', { gain: 0.5 });
    cue(Wd('bread', 0), 'pop', { gain: 0.6 });
  }

  // ── S02 · and by lunchtime, an entire village was bowing at her feet ──
  {
    const st = cut(1);
    add({
      id: 'S02', at: st, note: 'High angle: entire village in the town square bowing',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        const z = BK.z;
        stClara.at(-5.0, 0.18, z);
        stClara.set({ legs: 'stand', mood: 'shock', holdR: breadProp, armL: [30, 20], blink: blink(t) });
        stMayor.at(-3.6, 0.18, z - 1.2); stMayor.set({ legs: 'sit', mood: 'worried', armL: [70, 20], armR: [70, 20] }); stMayor.group.visible = true;
        stV1.at(-2.8, 0.18, z - 2.2); stV1.set({ legs: 'sit', mood: 'neutral' }); stV1.group.visible = true;
        stV2.at(-2.5, 0.18, z + 0.5); stV2.set({ legs: 'sit', mood: 'neutral' }); stV2.group.visible = true;
        stKid.at(-3.0, 0.18, z + 1.6); stKid.set({ legs: 'sit', mood: 'happy' }); stKid.group.visible = true;
        shoot(ST.scene, streetPeople(), V3(2.0, 6.0, z - 4), V3(0.5, 3.8, z - 3), V3(-4.0, 1.0, z), V3(-4.5, 1.0, z), k, { ...LOOKS.street, fov: 46 });
        blit();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.6 });
    cue(Wd('bowing', 1), 'boing', { gain: 0.6 });
  }

  // ── S03 · town telegram warned that the Queen was traveling ──────────
  {
    const st = cut(2);
    add({
      id: 'S03', at: st, note: 'Town hall desk: Mayor holds telegram paper',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        thMayor.at(0.4, 0, -3.95);
        thMayor.set({ mood: 'worried', talk: talk(t), holdL: PROPS.paper('TELEGRAM'), armL: [50, 40] });
        thHerald.at(1.8, 0, -3.5);
        thHerald.set({ mood: 'shock', armR: [70, 30], blink: blink(t) });
        shoot(TH.scene, thPeople, V3(0.4, 2.0, -1.0), V3(0.4, 1.6, -1.8), V3(0.4, 1.3, -3.5), null, k, { ...LOOKS.room, fov: 38 });
        blit();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('telegram', 2), 'tock', { gain: 0.7 });
  }

  // ── S04 · was traveling in disguise, wearing a blue polka-dot apron ───
  {
    const st = cut(3);
    add({
      id: 'S04', at: st, note: 'Royal disguise notice with polka-dot apron highlight',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        thMayor.at(0.4, 0, -3.95);
        thMayor.set({ mood: 'shock', talk: talk(t, 0.4), holdL: PROPS.sign('NOTICE', '#FFFDF4') });
        shoot(TH.scene, thPeople, V3(0.4, 1.6, -2.0), V3(0.4, 1.4, -2.6), V3(0.4, 1.3, -3.8), null, k, { ...LOOKS.room, fov: 34 });
        blit();
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#3F51B5';
        ctx.beginPath();
        ctx.roundRect(140, 320, 800, 140, 24);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 48px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('ROYAL DISGUISE: BLUE POLKA-DOT APRON', 540, 406);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('apron', 3), 'sparkle', { gain: 0.6 });
  }

  // ── S05 · Enter Clara, clutching fresh warm sourdough ─────────────────
  {
    const st = cut(4);
    add({
      id: 'S05', at: st, note: 'Clara steps out of bakery with fresh bread',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        const z = BK.z;
        stClara.at(-5.2, 0.18, z - 0.5);
        stClara.set({ legs: 'stand', mood: 'happy', holdR: breadProp, armR: [45, 45], blink: blink(t) });
        stBaker.at(-5.2, 0.18, z - 2.0); stBaker.set({ mood: 'happy', armR: [70, 30] }); stBaker.group.visible = true;
        stMayor.group.visible = false; stKid.group.visible = false; stV1.group.visible = false; stV2.group.visible = false;
        shoot(ST.scene, [stClara, stBaker], V3(-2.8, 1.8, z - 4.5), V3(-3.8, 1.5, z - 2.8), V3(-5.2, 1.4, z - 0.8), null, k, { ...LOOKS.street, fov: 36 });
        blit();
      }
    });
    cue(st + 0.02, 'ding', { gain: 0.6 });
    cue(Wd('sourdough', 4), 'pop', { gain: 0.7 });
  }

  // ── S06 · in the exact same polka-dot apron ───────────────────────────
  {
    const st = cut(5);
    add({
      id: 'S06', at: st, note: 'Punch-in on Clara in the exact matching apron',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        const z = BK.z;
        stClara.at(-5.2, 0.18, z - 0.5);
        stClara.set({ legs: 'stand', mood: 'smug', holdR: breadProp, armR: [40, 40], blink: blink(t) });
        shoot(ST.scene, [stClara], V3(-4.0, 1.5, z - 2.2), V3(-4.5, 1.4, z - 1.5), V3(-5.2, 1.3, z - 0.5), null, k, { ...LOOKS.street, fov: 30 });
        blit();
        ctx.save();
        ctx.fillStyle = '#FFD700';
        ctx.font = '900 64px Inter';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#1F1C33';
        ctx.lineWidth = 10;
        ctx.strokeText('100% MATCH!', 540, 440);
        ctx.fillText('100% MATCH!', 540, 440);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('polka-dot', 5), 'ding', { gain: 0.7 });
  }

  // ── S07 · The second she stepped outside, the mayor fell to his knees ─
  {
    const st = cut(6);
    add({
      id: 'S07', at: st, note: 'Mayor drops to knees in shock and awe',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        const z = BK.z;
        stMayor.at(-4.0, 0.18, z - 1.4);
        stMayor.set({ legs: 'sit', mood: 'shock', sweat: 1, armL: [120, 20], armR: [120, 20], lean: -8 }); stMayor.group.visible = true;
        stClara.at(-5.2, 0.18, z - 0.5); stClara.set({ mood: 'shock', holdR: breadProp });
        shoot(ST.scene, [stMayor, stClara], V3(-2.2, 2.2, z - 3.5), V3(-2.8, 1.2, z - 2.2), V3(-4.0, 0.9, z - 1.4), null, k, { ...LOOKS.street, fov: 36 });
        blit();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('fell', 6), 'thud', { gain: 0.8 });
  }

  // ── S08 · The brass band blared ───────────────────────────────────────
  {
    const st = cut(7);
    add({
      id: 'S08', at: st, note: 'Herald blaring brass fanfare',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        const z = BK.z;
        stHerald.at(-3.2, 0.18, z - 2.8);
        stHerald.set({ mood: 'proud', armR: [110, 50], armL: [90, 40], bob: Math.sin(t * 12) * 8 }); stHerald.group.visible = true;
        stMayor.group.visible = false; stClara.group.visible = false;
        shoot(ST.scene, [stHerald], V3(-1.4, 1.8, z - 5.0), V3(-2.0, 1.6, z - 4.2), V3(-3.2, 1.4, z - 2.8), null, k, { ...LOOKS.street, fov: 34 });
        blit();
      }
    });
    cue(st + 0.02, 'boing', { gain: 0.6 });
    cue(Wd('blared', 7), 'ding', { gain: 0.7 });
  }

  // ── S09 · they threw a velvet cape over her shoulders ─────────────────
  {
    const st = cut(8);
    add({
      id: 'S09', at: st, note: 'Villagers drape velvet cape on Clara',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        const z = BK.z;
        stClara.at(-4.8, 0.18, z - 0.8);
        stClara.set({ mood: 'shock', holdR: breadProp, armL: [40, 20], blink: blink(t) });
        stV1.at(-4.1, 0.18, z - 1.4); stV1.set({ mood: 'proud', armL: [80, 40] }); stV1.group.visible = true;
        stV2.at(-5.5, 0.18, z - 1.4); stV2.set({ mood: 'proud', armR: [80, 40] }); stV2.group.visible = true;
        stHerald.group.visible = false;
        shoot(ST.scene, [stClara, stV1, stV2], V3(-3.0, 1.8, z - 3.2), V3(-3.8, 1.6, z - 2.4), V3(-4.8, 1.3, z - 0.8), null, k, { ...LOOKS.street, fov: 34 });
        blit();
        // Red velvet cape overlay
        ctx.save();
        ctx.fillStyle = 'rgba(183, 28, 28, 0.88)';
        ctx.beginPath();
        ctx.roundRect(410, 680, 260, 360, 30);
        ctx.fill();
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 12;
        ctx.stroke();
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.6 });
    cue(Wd('velvet', 8), 'slide', { gain: 0.6 });
  }

  // ── S10 · slapped an antique gold crown on her head ───────────────────
  {
    const st = cut(9);
    add({
      id: 'S10', at: st, note: 'Gold crown drops onto Clara with ding',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        const z = BK.z;
        stClara.at(-4.8, 0.18, z - 0.8);
        stClara.set({ mood: k > 0.4 ? 'smug' : 'shock', holdR: breadProp, blink: blink(t) });
        shoot(ST.scene, [stClara], V3(-3.6, 1.8, z - 2.4), V3(-4.2, 1.6, z - 1.8), V3(-4.8, 1.4, z - 0.8), null, k, { ...LOOKS.street, fov: 30 });
        blit();
        // Dropping crown in 2D
        ctx.save();
        const dropY = lerp(200, 460, clamp(lt * 2.2));
        ctx.translate(540, dropY);
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#1F1C33';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(-70, 30);
        ctx.lineTo(70, 30);
        ctx.lineTo(70, -25);
        ctx.lineTo(35, 5);
        ctx.lineTo(0, -45);
        ctx.lineTo(-35, 5);
        ctx.lineTo(-70, -25);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#D32F2F'; ctx.beginPath(); ctx.arc(0, 5, 10, 0, 7); ctx.fill();
        ctx.fillStyle = '#1976D2'; ctx.beginPath(); ctx.arc(-35, 12, 8, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(35, 12, 8, 0, 7); ctx.fill();
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('crown', 9), 'ding', { gain: 0.8 });
    cue(Wd('crown', 9) + 0.15, 'sparkle', { gain: 0.6 });
  }

  // ── S11 · Naturally, Clara rolled with it ─────────────────────────────
  {
    const st = cut(10);
    add({
      id: 'S11', at: st, note: 'Clara sits as Queen, holding bread like a scepter',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        mdClara.at(0, 0, -4.5);
        mdClara.set({ legs: 'sit', mood: 'smug', holdR: breadProp, armR: [70, 40], blink: blink(t) });
        mdMayor.at(1.6, 0, -4.8); mdMayor.set({ legs: 'stand', mood: 'proud', armL: [40, 20] }); mdMayor.group.visible = true;
        shoot(MD.scene, [mdClara, mdMayor], V3(-0.5, 2.0, -1.8), V3(0, 1.6, -2.4), V3(0.5, 1.2, -4.5), null, k, { ...LOOKS.field, fov: 36 });
        blit();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('rolled', 10), 'boing', { gain: 0.6 });
  }

  // ── S12 · Her first royal decree: free pastries for every kid ─────────
  {
    const st = cut(11);
    add({
      id: 'S12', at: st, note: 'Kids catching free flying pastries',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        mdKid.at(-0.4, 0, -3.8);
        mdKid.set({ legs: 'jump', mood: 'happy', armL: [120, 20], armR: [120, 20], holdL: pastryProp }); mdKid.group.visible = true;
        mdMayor.group.visible = false;
        shoot(MD.scene, [mdKid], V3(0, 1.8, -1.5), V3(-0.2, 1.4, -2.2), V3(-0.4, 1.1, -3.8), null, k, { ...LOOKS.field, fov: 32 });
        blit();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('pastries', 11), 'plop', { gain: 0.7 });
    cue(Wd('kid', 11), 'pop', { gain: 0.6 });
  }

  // ── S13 · and mandatory afternoon naps for the adults ─────────────────
  {
    const st = cut(12);
    add({
      id: 'S13', at: st, note: 'Adults peacefully sleeping on bench',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        mdMayor.at(0.2, 0, -4.2);
        mdMayor.set({ legs: 'sit', mood: 'tired', armL: [10, 10], armR: [10, 10], bob: Math.sin(t * 3) * 4 }); mdMayor.group.visible = true;
        mdKid.group.visible = false;
        shoot(MD.scene, [mdMayor], V3(0.2, 1.6, -1.8), V3(0.2, 1.3, -2.6), V3(0.2, 1.0, -4.2), null, k, { ...LOOKS.field, fov: 34 });
        blit();
        // Animated Zzz
        ctx.save();
        ctx.fillStyle = '#3F51B5';
        ctx.font = '900 60px Inter';
        const zFade = (t * 2) % 1;
        ctx.globalAlpha = 1 - zFade;
        ctx.fillText('Z', 620 + zFade * 30, 680 - zFade * 80);
        ctx.fillText('z', 660 + zFade * 30, 640 - zFade * 80);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('naps', 12), 'chirp', { gain: 0.6 });
  }

  // ── S14 · The crowd cheered wildly ────────────────────────────────────
  {
    const st = cut(13);
    add({
      id: 'S14', at: st, note: 'Crowd celebrating with cheers and confetti',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        const z = BK.z;
        stV1.at(-3.6, 0.18, z - 1.2); stV1.set({ legs: 'walk', phase: t * 8, mood: 'laugh', armL: [130, 20], armR: [130, 20] }); stV1.group.visible = true;
        stV2.at(-2.8, 0.18, z - 2.0); stV2.set({ legs: 'walk', phase: t * 8 + 1, mood: 'happy', armL: [120, 20], armR: [120, 20] }); stV2.group.visible = true;
        stHerald.at(-4.5, 0.18, z - 1.8); stHerald.set({ mood: 'happy', armR: [100, 30] }); stHerald.group.visible = true;
        shoot(ST.scene, [stV1, stV2, stHerald], V3(-1.0, 3.2, z - 5.5), V3(-1.8, 2.0, z - 4.0), V3(-3.5, 1.2, z - 1.6), null, k, { ...LOOKS.street, fov: 42 });
        blit();
        // Confetti
        ctx.save();
        const colors = ['#E53935', '#FFD700', '#1E88E5', '#43A047', '#8E24AA'];
        for (let i = 0; i < 35; i++) {
          ctx.fillStyle = colors[i % colors.length];
          const px = (i * 37 + t * 90) % 1080;
          const py = (i * 61 + t * 240) % 1920;
          ctx.fillRect(px, py, 14, 14);
        }
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.6 });
    cue(Wd('cheered', 13), 'sparkle', { gain: 0.7 });
  }

  // ── S15 · When the real Queen finally arrived ──────────────────────────
  {
    const st = cut(14);
    add({
      id: 'S15', at: st, note: 'Real Queen arrives looking stern and imposing',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        const z = BK.z;
        stQueen.at(-4.2, 0.18, z - 1.0);
        stQueen.set({ mood: 'angry', armL: [15, 10], armR: [15, 10], blink: blink(t) }); stQueen.group.visible = true;
        stV1.group.visible = false; stV2.group.visible = false; stHerald.group.visible = false;
        shoot(ST.scene, [stQueen], V3(-2.2, 2.2, z - 3.4), V3(-2.8, 1.6, z - 2.4), V3(-4.2, 1.4, z - 1.0), null, k, { ...LOOKS.street, fov: 32 });
        blit();
      }
    });
    cue(st + 0.02, 'slide', { gain: 0.6 });
    cue(Wd('arrived', 14), 'slam', { gain: 0.8 });
  }

  // ── S16 · she took one bite, laughed, and let Clara keep the crown ─────
  {
    const st = cut(15);
    add({
      id: 'S16', at: st, note: 'Queen bites pastry, laughs, lets Clara keep crown',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        const z = BK.z;
        stQueen.at(-4.0, 0.18, z - 1.0);
        stQueen.set({ mood: k > 0.35 ? 'laugh' : 'shock', holdR: pastryProp, armR: [70, 40], blink: blink(t) });
        stClara.at(-5.2, 0.18, z - 0.5);
        stClara.set({ mood: 'happy', holdR: breadProp, blink: blink(t, 1) }); stClara.group.visible = true;
        shoot(ST.scene, [stQueen, stClara], V3(-2.6, 2.0, z - 3.5), V3(-3.2, 1.6, z - 2.6), V3(-4.6, 1.3, z - 0.8), null, k, { ...LOOKS.street, fov: 36 });
        blit();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('pastries', 15), 'pop', { gain: 0.6 });
    cue(Wd('laughed', 15), 'boing', { gain: 0.6 });
    cue(Wd('crown', 15), 'sparkle', { gain: 0.7 });
  }

  // ── S17 · So next time you go to buy bread ────────────────────────────
  {
    const st = cut(16);
    add({
      id: 'S17', at: st, note: 'Clara smiling outside bakery with bread',
      draw(lt, d, t, blit) {
        const k = eio(clamp(lt / d));
        const z = BK.z;
        stClara.at(-5.0, 0.18, z - 0.5);
        stClara.set({ mood: 'smug', holdR: breadProp, armR: [35, 35], blink: blink(t) });
        stQueen.group.visible = false;
        shoot(ST.scene, [stClara], V3(-3.4, 1.8, z - 2.8), V3(-4.0, 1.5, z - 1.8), V3(-5.0, 1.3, z - 0.5), null, k, { ...LOOKS.street, fov: 32 });
        blit();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('bread', 16), 'ding', { gain: 0.7 });
  }

  // ── S18 · bring a basket, just in case you inherit a throne ───────────
  {
    const st = cut(17);
    add({
      id: 'S18', at: st, note: 'Clara at home wearing her golden crown and smiling',
      draw(lt, d, t, blit) {
        const k = eo(clamp(lt / d));
        mdClara.at(0, 0, -4.5);
        mdClara.set({ legs: 'stand', mood: 'happy', holdR: breadProp, blink: blink(t) });
        mdMayor.group.visible = false; mdKid.group.visible = false;
        shoot(MD.scene, [mdClara], V3(0, 2.0, -1.8), V3(0, 1.5, -2.6), V3(0, 1.3, -4.5), null, k, { ...LOOKS.field, fov: 32 });
        blit();
        // Golden crown shining on Clara
        ctx.save();
        ctx.translate(540, 480);
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#1F1C33';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(-60, 25);
        ctx.lineTo(60, 25);
        ctx.lineTo(60, -20);
        ctx.lineTo(30, 5);
        ctx.lineTo(0, -40);
        ctx.lineTo(-30, 5);
        ctx.lineTo(-60, -20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Title card stamp
        ctx.save();
        ctx.translate(540, 1420);
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#1F1C33';
        ctx.lineWidth = 12;
        ctx.font = '900 68px Inter';
        ctx.textAlign = 'center';
        ctx.strokeText('QUEEN FOR A DAY', 0, 0);
        ctx.fillText('QUEEN FOR A DAY', 0, 0);
        ctx.restore();
      }
    });
    cue(st + 0.02, 'whoosh', { gain: 0.5 });
    cue(Wd('inherit', 17), 'sparkle', { gain: 0.7 });
    cue(Wd('throne', 17), 'stamp', { gain: 0.8 });
  }

  return { shots: S, cues: CUES };
}
