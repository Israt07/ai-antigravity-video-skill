// scene_08: Speedometer badge: 40 MPH with emu speeding past
export const id = 'scene_08';
export const shotId = 'S08';
export const lineIndex = 7;
export const note = 'Speedometer badge: 40 MPH with emu speeding past';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.6 });
  env.cue(env.Wd('miles', 7), 'zip', { gain: 0.8 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eo(env.clamp(lt / d));
  const { MD, shoot, LOOKS, V3, ctx, lerp, clamp, drawEmu } = env;
  shoot(MD.scene, [], V3(0, 2.0, 0), V3(0, 1.6, -1.5), V3(0, 1.2, -4.0), null, k, { ...LOOKS.field, fov: 36 });
  blit();
  // Emu zooming across screen with speed lines
  ctx.save();
  const emuX = lerp(-300, 1400, clamp(lt / d));
  drawEmu(ctx, emuX, 950, 1.4, 'smug', t * 24);

  // Speedometer badge
  ctx.translate(540, 420);
  ctx.fillStyle = '#FFD700';
  ctx.strokeStyle = '#1F1C33';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.roundRect(-220, -70, 440, 140, 25);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#D32F2F';
  ctx.font = '900 76px Inter';
  ctx.textAlign = 'center';
  ctx.fillText('40 MPH!', 0, 26);
  ctx.restore();
}
