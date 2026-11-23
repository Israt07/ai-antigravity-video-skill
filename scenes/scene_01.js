// scene_01: Crane-down into the Australian outback; emu stands tall
export const id = 'scene_01';
export const shotId = 'S01';
export const lineIndex = 0;
export const note = 'Crane-down into the Australian outback; emu stands tall';

export function setup(env) {
  env.cue(env.at + 0.05, 'whoosh', { gain: 0.6 });
  env.cue(env.Wd('war', 0), 'ding', { gain: 0.7 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eio(env.clamp(lt / d));
  const { mdMajor, mdSoldier1, mdSoldier2, mdFarmer, MD, shoot, LOOKS, V3, ctx, drawEmu } = env;
  mdMajor.group.visible = false; mdSoldier1.group.visible = false;
  mdSoldier2.group.visible = false; mdFarmer.group.visible = false;
  shoot(MD.scene, [], V3(0, 7.0, 10), V3(0, 2.2, 0), V3(0, 1.2, -8), null, k, { ...LOOKS.field, fov: 42 });
  blit();
  // Emu silhouette in center
  ctx.save();
  drawEmu(ctx, 540, 1100, 1.2, 'smug', 0);
  ctx.restore();
}
