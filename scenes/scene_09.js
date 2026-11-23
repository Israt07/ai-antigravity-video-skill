// scene_09: Two emus with commander berets nodding wisely
export const id = 'scene_09';
export const shotId = 'S09';
export const lineIndex = 8;
export const note = 'Two emus with commander berets nodding wisely';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('tactics', 8), 'chirp', { gain: 0.7 });
  env.cue(env.Wd('tactics', 8) + 0.1, 'pop', { gain: 0.6 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eio(env.clamp(lt / d));
  const { MD, shoot, LOOKS, V3, ctx, drawEmu } = env;
  shoot(MD.scene, [], V3(2.0, 2.0, 0), V3(2.2, 1.5, -1.0), V3(2.5, 1.1, -3.0), null, k, { ...LOOKS.field, fov: 34 });
  blit();
  ctx.save();
  drawEmu(ctx, 360, 1050, 1.1, 'smug', 0, 'beret');
  drawEmu(ctx, 720, 1070, 1.0, 'smug', 0, 'beret');
  ctx.restore();
}
