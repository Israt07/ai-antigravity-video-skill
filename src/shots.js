// THE MAN WHO DECLARED WAR ON EMUS (Tall Tale 3D).
// Restructured: individual scenes loaded modularly from ../scenes/
import * as THREE from 'three';
import { camera } from './core/engine.js';
import { L, Wd, T } from './core/timing.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import {
  ctx, clamp, lerp, seg, eo, eio, eob,
  V3, mix, talk, blink,
  binocularsProp, whiteFlagProp, drawEmu,
  person
} from '../scenes/common.js';
import { allScenes } from '../scenes/index.js';

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

  // Shared environment passed to every scene
  const env = {
    THREE, MD, OF,
    mdMajor, mdSoldier1, mdSoldier2, mdFarmer, mdPeople,
    ofMinister, ofMajor, ofPeople,
    shoot, LOOKS, V3, mix, talk, blink,
    ctx, clamp, lerp, seg, eo, eio, eob,
    drawEmu, binocularsProp, whiteFlagProp,
    cue, Wd, L
  };

  // Register each modular scene
  for (const sc of allScenes) {
    const st = cut(sc.lineIndex);
    add({
      id: sc.shotId,
      at: st,
      note: sc.note,
      draw(lt, d, t, blit) {
        sc.draw(lt, d, t, blit, env);
      }
    });
    sc.setup({ ...env, at: st });
  }

  return { shots: S, cues: CUES };
}
