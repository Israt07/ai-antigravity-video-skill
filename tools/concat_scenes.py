import subprocess
from pathlib import Path

ROOT = Path('C:/Users/israt/faceless-shorts/emu-war')
out_dir = ROOT / 'out'
renders_dir = ROOT / 'renders'
renders_dir.mkdir(exist_ok=True)

# 16 scenes in order
scene_ids = [f"scene_{i+1:02d}" for i in range(16)]

# Verify all clips exist
missing = []
for sid in scene_ids:
    p = out_dir / f"{sid}.mp4"
    if not p.exists():
        missing.append(str(p))

if missing:
    raise SystemExit(f"Error: Missing per-scene rendered clips: {missing}")

# Write ffmpeg concat file
concat_txt = out_dir / 'concat_list.txt'
lines = [f"file '{sid}.mp4'" for sid in scene_ids]
concat_txt.write_text("\n".join(lines), encoding='utf-8')

target_mp4 = renders_dir / 'emu-war.mp4'

print(f"Concatenating {len(scene_ids)} scene clips into {target_mp4}...")
cmd = [
    'ffmpeg', '-v', 'error', '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', str(concat_txt),
    '-c', 'copy',
    str(target_mp4)
]
subprocess.run(cmd, check=True)

# Probe final duration
probe_cmd = [
    'ffprobe', '-v', 'error',
    '-show_entries', 'format=duration,size',
    '-of', 'default=noprint_wrappers=1',
    str(target_mp4)
]
res = subprocess.run(probe_cmd, capture_output=True, text=True, check=True)
print("Concatenation successful!")
print(res.stdout)
