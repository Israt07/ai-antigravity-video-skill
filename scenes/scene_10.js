// scene_10: Soldiers aim machine gun but emus scatter all directions
export const id = 'scene_10';
export const shotId = 'S10';
export const lineIndex = 9;
export const note = 'Soldiers aim machine gun but emus scatter all directions';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.6 });
  env.cue(env.Wd('scattered', 9), 'slide', { gain: 0.7 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eo(env.clamp(lt / d));
  const { mdSoldier1, MD, shoot, LOOKS, V3, ctx, lerp, clamp, drawEmu } = env;
  mdSoldier1.at(-0.8, 0, -3.5);
  mdSoldier1.set({ mood: 'shock', armL: [60, 20], armR: [60, 20] }); mdSoldier1.group.visible = true;
  shoot(MD.scene, [mdSoldier1], V3(0, 2.4, -0.5), V3(0, 1.8, -1.8), V3(0, 1.1, -3.5), null, k, { ...LOOKS.field, fov: 42 });
  blit();
  // Emus scattering left and right
  ctx.save();
  const escL = lerp(450, -200, clamp(lt / d));
  const escR = lerp(630, 1300, clamp(lt / d));
  drawEmu(ctx, escL, 1000, 1.0, 'smug', t * 20);
  drawEmu(ctx, escR, 1040, 1.1, 'smug', t * 20);
  ctx.restore();
}
