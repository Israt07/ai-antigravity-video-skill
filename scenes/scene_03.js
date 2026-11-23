// scene_03: Flock of emus gobbling crops in the wheat field
export const id = 'scene_03';
export const shotId = 'S03';
export const lineIndex = 2;
export const note = 'Flock of emus gobbling crops in the wheat field';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('emus', 2), 'gulp', { gain: 0.7 });
  env.cue(env.Wd('fields', 2), 'plop', { gain: 0.6 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eio(env.clamp(lt / d));
  const { mdFarmer, mdSoldier1, MD, shoot, LOOKS, V3, ctx, talk, drawEmu } = env;
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
