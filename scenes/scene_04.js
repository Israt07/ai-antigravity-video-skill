// scene_04: Close-up of fence posts getting stomped
export const id = 'scene_04';
export const shotId = 'S04';
export const lineIndex = 3;
export const note = 'Close-up of fence posts getting stomped';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('stomping', 3), 'slam', { gain: 0.9 });
  env.cue(env.Wd('toothpicks', 3), 'thud', { gain: 0.7 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eo(env.clamp(lt / d));
  const { MD, shoot, LOOKS, V3, ctx, lerp, eo, clamp, drawEmu } = env;
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
