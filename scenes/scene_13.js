// scene_13: Major clutches head in shock; EMU TANK thought bubble
export const id = 'scene_13';
export const shotId = 'S13';
export const lineIndex = 12;
export const note = 'Major clutches head in shock; EMU TANK thought bubble';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('mind', 12), 'boing', { gain: 0.7 });
  env.cue(env.Wd('tanks', 12), 'thud', { gain: 0.9 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eio(env.clamp(lt / d));
  const { mdMajor, MD, shoot, LOOKS, V3, ctx } = env;
  mdMajor.at(0, 0, -3.5);
  mdMajor.set({ mood: 'shock', sweat: 1, armL: [130, 40], armR: [130, 40], lean: Math.sin(t * 8) * 6 }); mdMajor.group.visible = true;
  shoot(MD.scene, [mdMajor], V3(0, 1.9, -1.5), V3(0, 1.4, -2.4), V3(0, 1.1, -3.5), null, k, { ...LOOKS.field, fov: 32 });
  blit();
  // Thought bubble: EMU = TANK
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#1F1C33';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(240, 360, 600, 180, 30);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#263238';
  ctx.font = '900 52px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('"THEY ARE BUILT', 540, 435);
  ctx.fillText('LIKE TANKS!"', 540, 500);
  ctx.restore();
}
