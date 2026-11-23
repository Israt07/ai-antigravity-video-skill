import json, subprocess
from pathlib import Path

ROOT = Path('C:/Users/israt/faceless-shorts/tea-stall-prophet')
scenes_dir = ROOT / 'scenes'
data_dir = ROOT / 'data'
scenes_dir.mkdir(exist_ok=True)

script = json.loads((ROOT / 'script.json').read_text(encoding='utf-8'))
lines_data = json.loads((data_dir / 'lines.json').read_text(encoding='utf-8'))
words_data = json.loads((data_dir / 'words.json').read_text(encoding='utf-8'))

lines = lines_data['lines']
total_dur = float(lines_data['duration'])

# Cut boundaries between lines with 0.06s pre-roll
def cut(i):
    if i == 0:
        return 0.0
    return round(lines[i]['start'] - 0.06, 3)

cuts = []
for i in range(len(lines)):
    c_start = cut(i)
    c_end = cut(i + 1) if i < len(lines) - 1 else total_dur
    cuts.append((c_start, c_end))

scene_visual_specs = [
    {
        "background": "tea-stall",
        "characters": [
            {
                "id": "tea_chacha",
                "age": "elder",
                "outfit": "lungi",
                "shirt": "#D86B4F",
                "pants": "#3B5875",
                "mustache": True,
                "beard": False,
                "gamchha": True,
                "expr": "happy",
                "anim": "talk-still",
                "x": 380,
                "y": 890,
                "scale": 2.3
            }
        ],
        "dialogue": {
            "speakerId": "tea_chacha",
            "speakerX": 600,
            "speakerY": 1140,
            "text": "In our village, nobody checks the weather forecast on a smartphone.",
            "start": 0.2,
            "end": 3.9,
            "fontSize": 40
        }
    },
    {
        "background": "tea-stall",
        "characters": [
            {
                "id": "tea_chacha",
                "age": "elder",
                "outfit": "lungi",
                "shirt": "#D86B4F",
                "pants": "#3B5875",
                "mustache": True,
                "gamchha": True,
                "expr": "surprised",
                "anim": "talk",
                "x": 240,
                "y": 890,
                "scale": 2.3
            },
            {
                "id": "elder_listener",
                "age": "elder",
                "outfit": "fatua",
                "shirt": "#E5DAC0",
                "pants": "#46604D",
                "hat": "topi",
                "beard": True,
                "expr": "neutral",
                "anim": "idle",
                "x": 580,
                "y": 890,
                "scale": 2.25
            }
        ],
        "dialogue": {
            "speakerId": "tea_chacha",
            "speakerX": 460,
            "speakerY": 1140,
            "text": "Look at that crow flying sideways! In five minutes, a massive storm is coming!",
            "start": 0.15,
            "end": 4.9,
            "fontSize": 38
        }
    },
    {
        "background": "house",
        "characters": [
            {
                "id": "rahat",
                "age": "adult",
                "outfit": "shirt",
                "shirt": "#5D7A94",
                "pants": "#889396",
                "expr": "surprised",
                "anim": "talk",
                "x": 460,
                "y": 880,
                "scale": 2.35
            }
        ],
        "dialogue": {
            "speakerId": "rahat",
            "speakerX": 700,
            "speakerY": 1140,
            "text": "Rahat immediately panicked and rushed to fill every bucket at the tube well.",
            "start": 0.2,
            "end": 4.2,
            "fontSize": 38
        }
    },
    {
        "background": "house",
        "characters": [
            {
                "id": "dadi",
                "age": "elder",
                "outfit": "saree",
                "hat": "pallu",
                "shirt": "#F7F4EC",
                "pants": "#9A4141",
                "blouse": "#C4985B",
                "glasses": True,
                "baby": True,
                "expr": "neutral",
                "anim": "talk-still",
                "x": 120,
                "y": 880,
                "scale": 2.3
            },
            {
                "id": "rahat",
                "age": "adult",
                "outfit": "shirt",
                "shirt": "#5D7A94",
                "pants": "#889396",
                "expr": "neutral",
                "anim": "idle",
                "x": 480,
                "y": 880,
                "scale": 2.35
            }
        ],
        "dialogue": {
            "speakerId": "dadi",
            "speakerX": 350,
            "speakerY": 1140,
            "text": "Why are you sweating like a madman under the afternoon sun?",
            "start": 0.15,
            "end": 3.3,
            "fontSize": 40
        }
    },
    {
        "background": "house",
        "characters": [
            {
                "id": "dadi",
                "age": "elder",
                "outfit": "saree",
                "hat": "pallu",
                "shirt": "#F7F4EC",
                "pants": "#9A4141",
                "glasses": True,
                "baby": True,
                "expr": "neutral",
                "anim": "idle",
                "x": 120,
                "y": 880,
                "scale": 2.3
            },
            {
                "id": "rahat",
                "age": "adult",
                "outfit": "shirt",
                "shirt": "#5D7A94",
                "pants": "#889396",
                "expr": "happy",
                "anim": "talk-still",
                "x": 480,
                "y": 880,
                "scale": 2.35
            }
        ],
        "dialogue": {
            "speakerId": "rahat",
            "speakerX": 720,
            "speakerY": 1140,
            "text": "Chacha said his joints are aching, and that always means heavy rain!",
            "start": 0.15,
            "end": 4.1,
            "fontSize": 38
        }
    },
    {
        "background": "indoor-bench",
        "characters": [
            {
                "id": "dadi",
                "age": "elder",
                "outfit": "saree",
                "hat": "pallu",
                "shirt": "#F7F4EC",
                "pants": "#9A4141",
                "glasses": True,
                "baby": True,
                "expr": "happy",
                "anim": "talk-still",
                "x": 320,
                "y": 880,
                "scale": 2.4
            }
        ],
        "dialogue": {
            "speakerId": "dadi",
            "speakerX": 550,
            "speakerY": 1130,
            "text": "Chacha's joints only ache when the tea bill is about to arrive.",
            "start": 0.15,
            "end": 3.5,
            "fontSize": 40
        }
    },
    {
        "background": "tea-stall",
        "characters": [
            {
                "id": "elder_listener",
                "age": "elder",
                "outfit": "fatua",
                "shirt": "#E5DAC0",
                "pants": "#46604D",
                "hat": "topi",
                "beard": True,
                "expr": "surprised",
                "anim": "idle",
                "x": 320,
                "y": 890,
                "scale": 2.25
            },
            {
                "id": "tea_chacha",
                "age": "elder",
                "outfit": "lungi",
                "shirt": "#D86B4F",
                "pants": "#3B5875",
                "mustache": True,
                "gamchha": True,
                "expr": "happy",
                "anim": "walk",
                "x": 750,
                "y": 890,
                "scale": 2.2
            }
        ],
        "dialogue": {
            "speakerId": "elder_listener",
            "speakerX": 540,
            "speakerY": 1140,
            "text": "And just like that, the storm never came... and neither did Chacha's money.",
            "start": 0.2,
            "end": 4.8,
            "fontSize": 38
        }
    }
]

manifest = []

for i, line in enumerate(lines):
    scene_id = f"scene_{i+1:02d}"
    c_start, c_end = cuts[i]
    dur = round(c_end - c_start, 3)
    
    scene_words = [w for w in words_data if w.get('line') == i]
    spec = scene_visual_specs[i]
    
    # 1. Write scene JSON config
    scene_config = {
        "id": scene_id,
        "line_index": i,
        "text": line['text'],
        "caps": script['lines'][i].get('caps', ''),
        "at": c_start,
        "end": c_end,
        "duration": dur,
        "audio": f"scenes/{scene_id}.wav",
        "clip": f"out/{scene_id}.mp4",
        "words": scene_words,
        "visuals": spec
    }
    (scenes_dir / f"{scene_id}.json").write_text(json.dumps(scene_config, indent=2), encoding='utf-8')
    
    # 2. Write scene JS module
    js_content = f"""// Visual specification for {scene_id}
export const sceneConfig = {json.dumps(spec, indent=2)};
export default sceneConfig;
"""
    (scenes_dir / f"{scene_id}.js").write_text(js_content, encoding='utf-8')
    
    # 3. Slice narration audio exactly for this scene
    wav_out = scenes_dir / f"{scene_id}.wav"
    cmd_audio = [
        'ffmpeg', '-y',
        '-ss', str(c_start),
        '-to', str(c_end),
        '-i', str(data_dir / 'narration.wav'),
        '-c', 'copy',
        str(wav_out)
    ]
    subprocess.run(cmd_audio, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    
    manifest.append({
        "id": scene_id,
        "line": line['text'],
        "at": c_start,
        "end": c_end,
        "duration": dur,
        "audio": f"scenes/{scene_id}.wav",
        "clip": f"out/{scene_id}.mp4",
        "visual_module": f"scenes/{scene_id}.js"
    })
    print(f"Generated {scene_id} ({dur}s): {line['text']}")

(scenes_dir / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print("All 7 scenes successfully initialized.")
