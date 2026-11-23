import re
from pathlib import Path

ROOT = Path('C:/Users/israt/faceless-shorts/emu-war')
shots_file = ROOT / 'src/shots.js'
content = shots_file.read_text(encoding='utf-8')

# We know the 16 shots S01 .. S16
scenes_data = [
    {
        "id": "scene_01",
        "shot_id": "S01",
        "index": 0,
        "note": "Crane-down into the Australian outback; emu stands tall",
        "cues": """
  env.cue(env.at + 0.05, 'whoosh', { gain: 0.6 });
  env.cue(env.Wd('war', 0), 'ding', { gain: 0.7 });
""",
        "draw": """
  const k = env.eio(env.clamp(lt / d));
  const { mdMajor, mdSoldier1, mdSoldier2, mdFarmer, MD, shoot, LOOKS, V3, ctx, drawEmu } = env;
  mdMajor.group.visible = false; mdSoldier1.group.visible = false;
  mdSoldier2.group.visible = false; mdFarmer.group.visible = false;
  shoot(MD.scene, [], V3(0, 7.0, 10), V3(0, 2.2, 0), V3(0, 1.2, -8), null, k, { ...LOOKS.field, fov: 42 });
  blit();
  // Emu silhouette in center
  ctx.save();
  drawEmu(ctx, 540, 1100, 1.2, 'smug', 0);
  ctx.restore();
"""
    },
    {
        "id": "scene_02",
        "shot_id": "S02",
        "index": 1,
        "note": "Fast zoom: giant cartoon emu sprinting past dazed soldier",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.6 });
  env.cue(env.Wd('destroyed', 1), 'boing', { gain: 0.7 });
""",
        "draw": """
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
"""
    },
    {
        "id": "scene_03",
        "shot_id": "S03",
        "index": 2,
        "note": "Flock of emus gobbling crops in the wheat field",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('emus', 2), 'gulp', { gain: 0.7 });
  env.cue(env.Wd('fields', 2), 'plop', { gain: 0.6 });
""",
        "draw": """
  const k = env.eio(env.clamp(lt / d));
  const { mdFarmer, mdSoldier1, MD, shoot, LOOKS, V3, ctx, talk, drawEmu } = env;
  mdFarmer.at(-2.5, 0, -4.5);
  mdFarmer.set({ mood: 'worried', armL: [120, 20], armR: [120, 20], talk: talk(t) });
  mdFarmer.group.visible = true; mdSoldier1.group.visible = false;
  shoot(MD.scene, [mdFarmer], V3(-1.0, 3.5, 2.0), V3(-1.5, 2.2, -1.0), V3(-2.0, 1.2, -4.5), null, k, { ...LOOKS.field, fov: 44 });
  blit();
  // Multiple emus pecking wheat
  ctx.save();
  drawEmu(ctx, 320, 1150, 0.9, 'smug', t * 6);
  drawEmu(ctx, 740, 1200, 1.1, 'neutral', t * 8);
  drawEmu(ctx, 500, 1300, 0.8, 'smug', t * 7);
  ctx.restore();
"""
    },
    {
        "id": "scene_04",
        "shot_id": "S04",
        "index": 3,
        "note": "Close-up of fence posts getting stomped",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('stomping', 3), 'slam', { gain: 0.9 });
  env.cue(env.Wd('toothpicks', 3), 'thud', { gain: 0.7 });
""",
        "draw": """
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
"""
    },
    {
        "id": "scene_05",
        "shot_id": "S05",
        "index": 4,
        "note": "War office: Minister orders Major Meredith",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('Meredith', 4), 'tock', { gain: 0.7 });
""",
        "draw": """
  const k = env.eio(env.clamp(lt / d));
  const { ofMinister, ofMajor, OF, ofPeople, shoot, LOOKS, V3, talk } = env;
  ofMinister.at(-0.8, 0, -3.5);
  ofMinister.set({ mood: 'angry', talk: talk(t), armR: [80, 20] });
  ofMajor.at(1.2, 0, -3.5);
  ofMajor.set({ mood: 'proud', armL: [100, 50] }); // Saluting
  shoot(OF.scene, ofPeople, V3(0.2, 2.0, -1.0), V3(0.2, 1.6, -1.8), V3(0.2, 1.3, -3.5), null, k, { ...LOOKS.room, fov: 36 });
  blit();
"""
    },
    {
        "id": "scene_06",
        "shot_id": "S06",
        "index": 5,
        "note": "Soldiers set up heavy machine gun on tripod",
        "cues": """
  env.cue(env.at + 0.02, 'chug', { gain: 0.6 });
  env.cue(env.Wd('machine', 5), 'slam', { gain: 0.7 });
  env.cue(env.Wd('rounds', 5), 'pop', { gain: 0.6 });
""",
        "draw": """
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
"""
    },
    {
        "id": "scene_07",
        "shot_id": "S07",
        "index": 6,
        "note": "Major looks through binoculars and points",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('fire', 6), 'ding', { gain: 0.7 });
""",
        "draw": """
  const k = env.eio(env.clamp(lt / d));
  const { mdMajor, mdSoldier1, mdSoldier2, MD, shoot, LOOKS, V3, binocularsProp } = env;
  mdMajor.at(0, 0, -3.5);
  mdMajor.set({ mood: 'smug', holdR: binocularsProp, armR: [80, 50], armL: [70, 20] }); mdMajor.group.visible = true;
  mdSoldier1.group.visible = false; mdSoldier2.group.visible = false;
  shoot(MD.scene, [mdMajor], V3(-0.4, 1.8, -1.8), V3(0, 1.5, -2.5), V3(0, 1.2, -3.5), null, k, { ...LOOKS.field, fov: 32 });
  blit();
"""
    },
    {
        "id": "scene_08",
        "shot_id": "S08",
        "index": 7,
        "note": "Speedometer badge: 40 MPH with emu speeding past",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.6 });
  env.cue(env.Wd('miles', 7), 'zip', { gain: 0.8 });
""",
        "draw": """
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
"""
    },
    {
        "id": "scene_09",
        "shot_id": "S09",
        "index": 8,
        "note": "Two emus with commander berets nodding wisely",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('tactics', 8), 'chirp', { gain: 0.7 });
  env.cue(env.Wd('tactics', 8) + 0.1, 'pop', { gain: 0.6 });
""",
        "draw": """
  const k = env.eio(env.clamp(lt / d));
  const { MD, shoot, LOOKS, V3, ctx, drawEmu } = env;
  shoot(MD.scene, [], V3(2.0, 2.0, 0), V3(2.2, 1.5, -1.0), V3(2.5, 1.1, -3.0), null, k, { ...LOOKS.field, fov: 34 });
  blit();
  ctx.save();
  drawEmu(ctx, 360, 1050, 1.1, 'smug', 0, 'beret');
  drawEmu(ctx, 720, 1070, 1.0, 'smug', 0, 'beret');
  ctx.restore();
"""
    },
    {
        "id": "scene_10",
        "shot_id": "S10",
        "index": 9,
        "note": "Soldiers aim machine gun but emus scatter all directions",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.6 });
  env.cue(env.Wd('scattered', 9), 'slide', { gain: 0.7 });
""",
        "draw": """
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
"""
    },
    {
        "id": "scene_11",
        "shot_id": "S11",
        "index": 10,
        "note": "Machine gun sputters smoke rings; soldiers sweat",
        "cues": """
  env.cue(env.at + 0.02, 'boing', { gain: 0.6 });
  env.cue(env.Wd('jammed', 10), 'pop', { gain: 0.7 });
  env.cue(env.Wd('jammed', 10) + 0.1, 'tock', { gain: 0.7 });
""",
        "draw": """
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
"""
    },
    {
        "id": "scene_12",
        "shot_id": "S12",
        "index": 11,
        "note": "Hero emu shrugs off dust, winks, and keeps running",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('shrugged', 11), 'boing', { gain: 0.6 });
  env.cue(env.Wd('running', 11), 'sparkle', { gain: 0.7 });
""",
        "draw": """
  const k = env.eo(env.clamp(lt / d));
  const { MD, shoot, LOOKS, V3, ctx, lerp, clamp, drawEmu } = env;
  shoot(MD.scene, [], V3(0, 2.0, 0), V3(0, 1.5, -1.2), V3(0, 1.1, -3.0), null, k, { ...LOOKS.field, fov: 34 });
  blit();
  ctx.save();
  const emuX = lerp(450, 750, clamp(lt / d));
  drawEmu(ctx, emuX, 980, 1.3, 'smug', t * 14);
  ctx.restore();
"""
    },
    {
        "id": "scene_13",
        "shot_id": "S13",
        "index": 12,
        "note": "Major clutches head in shock; EMU TANK thought bubble",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('mind', 12), 'boing', { gain: 0.7 });
  env.cue(env.Wd('tanks', 12), 'thud', { gain: 0.9 });
""",
        "draw": """
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
"""
    },
    {
        "id": "scene_14",
        "shot_id": "S14",
        "index": 13,
        "note": "Soldiers wave white surrender flag and retreat",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('defeat', 13), 'chirp', { gain: 0.6 });
""",
        "draw": """
  const k = env.eo(env.clamp(lt / d));
  const { mdSoldier1, mdMajor, MD, shoot, LOOKS, V3, whiteFlagProp } = env;
  mdSoldier1.at(-0.5, 0, -3.8);
  mdSoldier1.set({ mood: 'worried', holdR: whiteFlagProp, armR: [60, 20] }); mdSoldier1.group.visible = true;
  mdMajor.at(1.0, 0, -4.2);
  mdMajor.set({ mood: 'tired', armL: [10, 10], armR: [10, 10] }); mdMajor.group.visible = true;
  shoot(MD.scene, [mdSoldier1, mdMajor], V3(0, 2.0, -1.8), V3(0, 1.6, -2.6), V3(0, 1.1, -4.0), null, k, { ...LOOKS.field, fov: 36 });
  blit();
"""
    },
    {
        "id": "scene_15",
        "shot_id": "S15",
        "index": 14,
        "note": "Heroic emu poses proudly at sunset with gold medal",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('bird', 14), 'sparkle', { gain: 0.7 });
""",
        "draw": """
  const k = env.eo(env.clamp(lt / d));
  const { MD, shoot, LOOKS, V3, ctx, drawEmu } = env;
  shoot(MD.scene, [], V3(0, 2.2, 0), V3(0, 1.6, -1.5), V3(0, 1.2, -4.0), null, k, { ...LOOKS.field, fov: 34 });
  blit();
  ctx.save();
  drawEmu(ctx, 540, 1000, 1.5, 'smug', 0);
  // Gold medal on chest
  ctx.translate(560, 990);
  ctx.fillStyle = '#FFD700';
  ctx.strokeStyle = '#1F1C33';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(0, 0, 24, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#D32F2F';
  ctx.beginPath(); ctx.arc(0, 0, 10, 0, 7); ctx.fill();
  ctx.restore();
"""
    },
    {
        "id": "scene_16",
        "shot_id": "S16",
        "index": 15,
        "note": "Outback signpost: EMU TERRITORY, victory stamp",
        "cues": """
  env.cue(env.at + 0.02, 'whoosh', { gain: 0.5 });
  env.cue(env.Wd('gunfight', 15), 'slam', { gain: 0.8 });
  env.cue(env.Wd('turf', 15), 'stamp', { gain: 0.9 });
""",
        "draw": """
  const k = env.eo(env.clamp(lt / d));
  const { MD, shoot, LOOKS, V3, ctx } = env;
  shoot(MD.scene, [], V3(4.2, 1.8, 1.0), V3(4.6, 1.4, 1.2), V3(5.0, 1.0, 1.5), null, k, { ...LOOKS.field, fov: 32 });
  blit();
  // Title card stamp: VICTORY 1932
  ctx.save();
  ctx.translate(540, 1380);
  ctx.fillStyle = '#FFD700';
  ctx.strokeStyle = '#1F1C33';
  ctx.lineWidth = 12;
  ctx.font = '900 66px Inter';
  ctx.textAlign = 'center';
  ctx.strokeText('EMUS: 1  ARMY: 0', 0, -40);
  ctx.fillText('EMUS: 1  ARMY: 0', 0, -40);
  ctx.font = '900 52px Inter';
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeText('VICTORY 1932', 0, 35);
  ctx.fillText('VICTORY 1932', 0, 35);
  ctx.restore();
"""
    }
]

scenes_dir = ROOT / 'scenes'

index_exports = []
for sc in scenes_data:
    code = f"""// {sc['id']}: {sc['note']}
export const id = '{sc['id']}';
export const shotId = '{sc['shot_id']}';
export const lineIndex = {sc['index']};
export const note = '{sc['note']}';

export function setup(env) {{{sc['cues']}}}

export function draw(lt, d, t, blit, env) {{{sc['draw']}}}
"""
    (scenes_dir / f"{sc['id']}.js").write_text(code, encoding='utf-8')
    index_exports.append(f"import * as {sc['id']} from './{sc['id']}.js';")
    print(f"Created {sc['id']}.js")

index_code = "\n".join(index_exports) + "\n\nexport const allScenes = [\n  " + ",\n  ".join([s['id'] for s in scenes_data]) + "\n];\n"
(scenes_dir / "index.js").write_text(index_code, encoding='utf-8')
print("Created scenes/index.js")
