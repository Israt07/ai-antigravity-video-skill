// scene_14: Soldiers wave white surrender flag and retreat
export const id = 'scene_14';
export const shotId = 'S14';
export const lineIndex = 13;
export const note = 'Soldiers wave white surrender flag and retreat';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('defeat', 13), 'chirp', { gain: 0.6 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eo(env.clamp(lt / d));
  const { mdSoldier1, mdMajor, MD, shoot, LOOKS, V3, whiteFlagProp } = env;
  mdSoldier1.at(-0.5, 0, -3.8);
  mdSoldier1.set({ mood: 'worried', holdR: whiteFlagProp, armR: [60, 20] }); mdSoldier1.group.visible = true;
  mdMajor.at(1.0, 0, -4.2);
  mdMajor.set({ mood: 'tired', armL: [10, 10], armR: [10, 10] }); mdMajor.group.visible = true;
  shoot(MD.scene, [mdSoldier1, mdMajor], V3(0, 2.0, -1.8), V3(0, 1.6, -2.6), V3(0, 1.1, -4.0), null, k, { ...LOOKS.field, fov: 36 });
  blit();
}
