// scene_12: Hero emu shrugs off dust, winks, and keeps running
export const id = 'scene_12';
export const shotId = 'S12';
export const lineIndex = 11;
export const note = 'Hero emu shrugs off dust, winks, and keeps running';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('shrugged', 11), 'boing', { gain: 0.6 });
  env.cue(env.Wd('running', 11), 'sparkle', { gain: 0.7 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eo(env.clamp(lt / d));
  const { MD, shoot, LOOKS, V3, ctx, lerp, clamp, drawEmu } = env;
  shoot(MD.scene, [], V3(0, 2.0, 0), V3(0, 1.5, -1.2), V3(0, 1.1, -3.0), null, k, { ...LOOKS.field, fov: 34 });
  blit();
  ctx.save();
  const emuX = lerp(450, 750, clamp(lt / d));
  drawEmu(ctx, emuX, 980, 1.3, 'smug', t * 14);
  ctx.restore();
}
