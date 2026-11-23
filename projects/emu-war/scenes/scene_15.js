// scene_15: Heroic emu poses proudly at sunset with gold medal
export const id = 'scene_15';
export const shotId = 'S15';
export const lineIndex = 14;
export const note = 'Heroic emu poses proudly at sunset with gold medal';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('bird', 14), 'sparkle', { gain: 0.7 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eo(env.clamp(lt / d));
  const { MD, shoot, LOOKS, V3, ctx, drawEmu } = env;
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
