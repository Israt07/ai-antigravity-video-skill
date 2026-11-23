import json
import subprocess
from pathlib import Path

ROOT = Path('C:/Users/israt/faceless-shorts/emu-war')
scenes_dir = ROOT / 'scenes'
out_dir = ROOT / 'out'
scenes_dir.mkdir(exist_ok=True)
out_dir.mkdir(exist_ok=True)

script = json.loads((ROOT / 'script.json').read_text(encoding='utf-8'))
lines_data = json.loads((ROOT / 'data/lines.json').read_text(encoding='utf-8'))
words_data = json.loads((ROOT / 'data/words.json').read_text(encoding='utf-8'))
cues_data = json.loads((ROOT / 'data/cues.json').read_text(encoding='utf-8'))

lines = lines_data['lines']
total_dur = float(lines_data['duration'])

def cut(i):
    if i == 0:
        return 0.0
    return round(lines[i]['start'] - 0.06, 3)

cuts = []
for i in range(len(lines)):
    c_start = cut(i)
    c_end = cut(i + 1) if i < len(lines) - 1 else total_dur
    cuts.append((c_start, c_end))

scene_list = []
for i, line in enumerate(lines):
    scene_id = f"scene_{i+1:02d}"
    c_start, c_end = cuts[i]
    dur = round(c_end - c_start, 3)
    
    # Filter words
    scene_words = [w for w in words_data if w.get('line') == i]
    # Filter cues
    scene_cues = [c for c in cues_data['cues'] if c_start <= c['t'] < c_end]
    
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
        "cues": scene_cues
    }
    
    # Write JSON config
    json_path = scenes_dir / f"{scene_id}.json"
    json_path.write_text(json.dumps(scene_config, indent=2), encoding='utf-8')
    
    # Slice narration audio for this scene
    wav_out = scenes_dir / f"{scene_id}.wav"
    # Audio slice: lines[i]['start'] to lines[i]['end'] (or from c_start to c_end)
    # Using line start to end preserves exact spoken audio for this line
    l_start = line['start']
    l_end = line['end']
    l_dur = round(l_end - l_start, 3)
    cmd = [
        'ffmpeg', '-y', '-ss', str(l_start), '-t', str(l_dur),
        '-i', str(ROOT / 'data/narration.wav'),
        '-c', 'copy', str(wav_out)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    
    # Slice rendered video into out/scene_XX.mp4
    mp4_out = out_dir / f"{scene_id}.mp4"
    cmd_vid = [
        'ffmpeg', '-y', '-ss', str(c_start), '-to', str(c_end),
        '-i', str(ROOT / 'renders/emu-war.mp4'),
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
        '-c:a', 'aac', '-b:a', '192k',
        '-avoid_negative_ts', 'make_zero',
        str(mp4_out)
    ]
    subprocess.run(cmd_vid, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    
    scene_list.append({
        "id": scene_id,
        "line": line['text'],
        "at": c_start,
        "end": c_end,
        "dur": dur
    })
    print(f"Generated {scene_id} ({dur}s): {line['text']}")

# Write scenes manifest
manifest_path = scenes_dir / 'manifest.json'
manifest_path.write_text(json.dumps(scene_list, indent=2), encoding='utf-8')
print("All 16 scenes processed successfully.")
