// scene_16: Outback signpost: EMU TERRITORY, victory stamp
export const id = 'scene_16';
export const shotId = 'S16';
export const lineIndex = 15;
export const note = 'Outback signpost: EMU TERRITORY, victory stamp';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('gunfight', 15), 'slam', { gain: 0.8 });
  env.cue(env.Wd('turf', 15), 'stamp', { gain: 0.9 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eo(env.clamp(lt / d));
  const { MD, shoot, LOOKS, V3, ctx } = env;
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
