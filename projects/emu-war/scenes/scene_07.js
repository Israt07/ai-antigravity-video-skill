// scene_07: Major looks through binoculars and points
export const id = 'scene_07';
export const shotId = 'S07';
export const lineIndex = 6;
export const note = 'Major looks through binoculars and points';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('fire', 6), 'ding', { gain: 0.7 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eio(env.clamp(lt / d));
  const { mdMajor, mdSoldier1, mdSoldier2, MD, shoot, LOOKS, V3, binocularsProp } = env;
  mdMajor.at(0, 0, -3.5);
  mdMajor.set({ mood: 'smug', holdR: binocularsProp, armR: [80, 50], armL: [70, 20] }); mdMajor.group.visible = true;
  mdSoldier1.group.visible = false; mdSoldier2.group.visible = false;
  shoot(MD.scene, [mdMajor], V3(-0.4, 1.8, -1.8), V3(0, 1.5, -2.5), V3(0, 1.2, -3.5), null, k, { ...LOOKS.field, fov: 32 });
  blit();
}
