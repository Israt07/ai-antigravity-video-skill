// scene_06: Soldiers set up heavy machine gun on tripod
export const id = 'scene_06';
export const shotId = 'S06';
export const lineIndex = 5;
export const note = 'Soldiers set up heavy machine gun on tripod';

export function setup(env) {
  env.cue(env.at + 0.02, 'chug', { gain: 0.6 });
  env.cue(env.Wd('machine', 5), 'slam', { gain: 0.7 });
  env.cue(env.Wd('rounds', 5), 'pop', { gain: 0.6 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eo(env.clamp(lt / d));
  const { mdSoldier1, mdSoldier2, MD, shoot, LOOKS, V3, ctx } = env;
  mdSoldier1.at(-0.8, 0, -3.5);
  mdSoldier1.set({ mood: 'neutral', armL: [40, 30], armR: [40, 30] }); mdSoldier1.group.visible = true;
  mdSoldier2.at(1.0, 0, -3.5);
  mdSoldier2.set({ mood: 'proud', armL: [30, 20], armR: [30, 20] }); mdSoldier2.group.visible = true;
  shoot(MD.scene, [mdSoldier1, mdSoldier2], V3(0, 2.2, -1.2), V3(0, 1.6, -2.0), V3(0, 1.1, -3.5), null, k, { ...LOOKS.field, fov: 36 });
  blit();
  // 2D Machine Gun Overlay
  ctx.save();
  ctx.translate(540, 1200);
  ctx.fillStyle = '#263238';
  ctx.strokeStyle = '#1F1C33';
  ctx.lineWidth = 8;
  // Tripod legs
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(-80, 140);
  ctx.moveTo(0, 0); ctx.lineTo(80, 140);
  ctx.moveTo(0, 0); ctx.lineTo(0, 150);
  ctx.stroke();
  // Gun barrel
  ctx.fillRect(-60, -30, 220, 40);
  ctx.strokeRect(-60, -30, 220, 40);
  // Pan magazine
  ctx.beginPath();
  ctx.ellipse(20, -45, 55, 20, 0, 0, 7);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
