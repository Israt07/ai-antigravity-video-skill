// scene_11: Machine gun sputters smoke rings; soldiers sweat
export const id = 'scene_11';
export const shotId = 'S11';
export const lineIndex = 10;
export const note = 'Machine gun sputters smoke rings; soldiers sweat';

export function setup(env) {
  env.cue(env.at + 0.02, 'boing', { gain: 0.6 });
  env.cue(env.Wd('jammed', 10), 'pop', { gain: 0.7 });
  env.cue(env.Wd('jammed', 10) + 0.1, 'tock', { gain: 0.7 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eio(env.clamp(lt / d));
  const { mdSoldier1, MD, shoot, LOOKS, V3, ctx } = env;
  mdSoldier1.at(0, 0, -3.5);
  mdSoldier1.set({ mood: 'worried', sweat: 1, armL: [70, -40], armR: [70, -40] }); mdSoldier1.group.visible = true;
  shoot(MD.scene, [mdSoldier1], V3(0, 1.8, -1.8), V3(0, 1.4, -2.4), V3(0, 1.1, -3.5), null, k, { ...LOOKS.field, fov: 32 });
  blit();
  // Jammed gun smoke rings in 2D
  ctx.save();
  ctx.strokeStyle = '#90A4AE';
  ctx.lineWidth = 8;
  const ringY = (t * 120) % 300;
  ctx.beginPath(); ctx.arc(540, 850 - ringY, 30 + ringY * 0.2, 0, 7); ctx.stroke();
  ctx.fillStyle = '#D32F2F';
  ctx.font = '900 68px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('*CLICK CLICK*', 540, 480);
  ctx.restore();
}
