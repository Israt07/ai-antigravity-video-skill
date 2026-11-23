import subprocess
from pathlib import Path

ROOT = Path('C:/Users/israt/faceless-shorts/tea-stall-prophet')
out_dir = ROOT / 'out'
renders_dir = ROOT / 'renders'
renders_dir.mkdir(exist_ok=True)

manifest = [f"scene_{i+1:02d}" for i in range(7)]

missing = []
for sid in manifest:
    p = out_dir / f"{sid}.mp4"
    if not p.exists():
        missing.append(str(p))

if missing:
    raise SystemExit(f"Error: Missing scene clips: {missing}")

concat_txt = out_dir / 'concat_list.txt'
lines = [f"file '{sid}.mp4'" for sid in manifest]
concat_txt.write_text("\n".join(lines), encoding='utf-8')

target_mp4 = renders_dir / 'tea-stall-prophet.mp4'

print(f"Concatenating {len(manifest)} scene clips into {target_mp4}...")
cmd = [
    'ffmpeg', '-v', 'error', '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', str(concat_txt),
    '-c', 'copy',
    str(target_mp4)
]
subprocess.run(cmd, check=True)

probe_cmd = [
    'ffprobe', '-v', 'error',
    '-show_entries', 'format=duration,size',
    '-of', 'default=noprint_wrappers=1',
    str(target_mp4)
]
res = subprocess.run(probe_cmd, capture_output=True, text=True, check=True)
print("Concatenation successful!")
print(res.stdout)
