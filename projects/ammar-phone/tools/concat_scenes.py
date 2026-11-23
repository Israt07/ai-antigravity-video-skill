import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
out_dir = ROOT / 'out'
renders_dir = ROOT / 'renders'
renders_dir.mkdir(exist_ok=True)

manifest_file = ROOT / 'scenes' / 'manifest.json'
if manifest_file.exists():
    manifest_data = json.loads(manifest_file.read_text(encoding='utf-8'))
    manifest = [item['id'] for item in manifest_data]
else:
    manifest = sorted([p.stem for p in out_dir.glob('scene_*.mp4')])

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

project_name = ROOT.name
target_mp4 = renders_dir / f"{project_name}.mp4"

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
