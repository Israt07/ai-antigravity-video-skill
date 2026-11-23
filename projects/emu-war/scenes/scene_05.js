// scene_05: War office: Minister orders Major Meredith
export const id = 'scene_05';
export const shotId = 'S05';
export const lineIndex = 4;
export const note = 'War office: Minister orders Major Meredith';

export function setup(env) {
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('Meredith', 4), 'tock', { gain: 0.7 });
}

export function draw(lt, d, t, blit, env) {
  const k = env.eio(env.clamp(lt / d));
  const { ofMinister, ofMajor, OF, ofPeople, shoot, LOOKS, V3, talk } = env;
  ofMinister.at(-0.8, 0, -3.5);
  ofMinister.set({ mood: 'angry', talk: talk(t), armR: [80, 20] });
  ofMajor.at(1.2, 0, -3.5);
  ofMajor.set({ mood: 'proud', armL: [100, 50] }); // Saluting
  shoot(OF.scene, ofPeople, V3(0.2, 2.0, -1.0), V3(0.2, 1.6, -1.8), V3(0.2, 1.3, -3.5), null, k, { ...LOOKS.room, fov: 36 });
  blit();
}
