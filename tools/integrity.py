import argparse
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCENES_DIR = ROOT / 'scenes'
OUT_DIR = ROOT / 'out'
BASELINE_FILE = ROOT / '.integrity_baseline.json'

def compute_sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def get_tracked_files(exclude_scene: str = None) -> dict[str, str]:
    files = {}
    
    # Process scenes/
    if SCENES_DIR.exists():
        for p in sorted(SCENES_DIR.iterdir()):
            if p.is_file():
                if exclude_scene and exclude_scene in p.name:
                    continue
                rel_path = f"scenes/{p.name}"
                files[rel_path] = compute_sha256(p)
                
    # Process out/
    if OUT_DIR.exists():
        for p in sorted(OUT_DIR.iterdir()):
            if p.is_file():
                if exclude_scene and exclude_scene in p.name:
                    continue
                rel_path = f"out/{p.name}"
                files[rel_path] = compute_sha256(p)
                
    return files

def record(exclude_scene: str = None):
    files = get_tracked_files(exclude_scene)
    data = {
        "excluded": exclude_scene,
        "count": len(files),
        "files": files
    }
    BASELINE_FILE.write_text(json.dumps(data, indent=2), encoding='utf-8')
    print(f"Recorded SHA-256 for {len(files)} files (excluding: {exclude_scene or 'None'}).")
    return files

def verify(exclude_scene: str = None):
    if not BASELINE_FILE.exists():
        raise SystemExit("Error: No baseline found. Run record first.")
        
    baseline = json.loads(BASELINE_FILE.read_text(encoding='utf-8'))
    expected_files = baseline['files']
    
    current_files = get_tracked_files(exclude_scene or baseline.get('excluded'))
    
    mismatches = []
    missing = []
    
    for rel_path, expected_hash in expected_files.items():
        if rel_path not in current_files:
            missing.append(rel_path)
        elif current_files[rel_path] != expected_hash:
            mismatches.append((rel_path, expected_hash, current_files[rel_path]))
            
    if mismatches or missing:
        print("FAIL: Integrity check failed!")
        if missing:
            print("Missing files:", missing)
        if mismatches:
            for path, exp, curr in mismatches:
                print(f"Mismatch: {path} (expected {exp[:8]}, got {curr[:8]})")
        sys.exit(1)
        
    print(f"PASS: All {len(expected_files)} files in scenes/ and out/ (excluding {exclude_scene or baseline.get('excluded')}) are UNCHANGED.")
    return True

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Scene SHA-256 integrity manager")
    parser.add_argument('action', choices=['record', 'verify'], help="Action to perform")
    parser.add_argument('--exclude', type=str, default=None, help="Scene ID to exclude (e.g. scene_07)")
    
    args = parser.parse_args()
    if args.action == 'record':
        record(args.exclude)
    elif args.action == 'verify':
        verify(args.exclude)
