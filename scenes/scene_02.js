// scene_02: Fast zoom: giant cartoon emu sprinting past dazed soldier
export const id = 'scene_02';
export const shotId = 'S02';
export const lineIndex = 1;
export const note = 'Fast zoom: giant cartoon emu sprinting past dazed soldier';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.6 });
  env.cue(env.Wd('destroyed', 1), 'boing', { gain: 0.7 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eo(env.clamp(lt / d));
  const { mdSoldier1, MD, shoot, LOOKS, V3, ctx, lerp, clamp, drawEmu } = env;
  mdSoldier1.at(0, 0, -3.5);
  mdSoldier1.set({ mood: 'shock', sweat: 1, armL: [90, 20], armR: [90, 20] });
  mdSoldier1.group.visible = true;
  shoot(MD.scene, [mdSoldier1], V3(0, 1.8, -1.0), V3(0, 1.4, -2.0), V3(0, 1.1, -3.5), null, k, { ...LOOKS.field, fov: 36 });
  blit();
  // Emu speeding across screen
  ctx.save();
  const emuX = lerp(-200, 1280, clamp(lt / d));
  drawEmu(ctx, emuX, 980, 1.3, 'smug', t * 18);
  ctx.restore();
}
