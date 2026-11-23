"""Zero-Shot Voice Cloning for Faceless Shorts.
Clones ANY voice from a short 10-30s sample audio file for $0.

Usage:
  python scripts/clone_voice.py <project> [--sample <sample.wav>] [--engine xtts|f5]

Features:
  1. Searches for reference audio in:
     - Explicit --sample path
     - <project>/voices/sample.wav (or *.mp3, *.wav)
     - voices/sample.wav
  2. Reads script.json lines.
  3. Synthesizes each line in the cloned voice.
  4. Saves:
     - <project>/scenes/scene_01.wav, scene_02.wav... (exact per-cut audio)
     - <project>/data/narration.wav (master narration track)
     - <project>/data/lines.json (line cut timings)
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from gradio_client import Client, handle_file

SUPPORTED_AUDIO_EXTS = ['.wav', '.mp3', '.m4a', '.ogg', '.flac']


def find_sample_audio(project_dir: Path, explicit_sample: str = None) -> Path:
    if explicit_sample:
        p = Path(explicit_sample)
        if p.exists():
            return p.resolve()
        raise FileNotFoundError(f"Sample audio not found at: {explicit_sample}")

    search_dirs = [
        project_dir / "voices",
        project_dir,
        Path("voices"),
        Path.home() / ".faceless-shorts" / "voices"
    ]

    for d in search_dirs:
        if d.exists():
            for ext in SUPPORTED_AUDIO_EXTS:
                for f in d.glob(f"*{ext}"):
                    if "narration" not in f.name.lower() and "scene_" not in f.name.lower():
                        return f.resolve()

    raise FileNotFoundError(
        "No sample audio found!\n"
        "Please drop a 10-30s clean voice sample into:\n"
        f"  1. {project_dir / 'voices'} (e.g. sample.wav)\n"
        "  2. voices/ (in repository root)\n"
        "or pass --sample <path_to_audio_file>"
    )


def convert_to_wav(in_path: Path, out_path: Path, sample_rate=24000):
    subprocess.run([
        "ffmpeg", "-v", "error", "-y",
        "-i", str(in_path),
        "-ar", str(sample_rate),
        "-ac", "1",
        str(out_path)
    ], check=True)


def get_audio_duration(path: Path) -> float:
    p = subprocess.run([
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(path)
    ], capture_output=True, text=True, check=True)
    return round(float(p.stdout.strip()), 3)


def clone_line_xtts(client: Client, text: str, sample_path: Path) -> Path:
    res = client.predict(
        text=text,
        audio=handle_file(str(sample_path)),
        api_name="/clone"
    )
    # res is (output_audio_path, html_value)
    out_file = Path(res[0] if isinstance(res, (tuple, list)) else res)
    return out_file


def clone_line_f5(client: Client, text: str, sample_path: Path, ref_text: str = "") -> Path:
    res = client.predict(
        ref_audio=handle_file(str(sample_path)),
        ref_text=ref_text,
        gen_text=text,
        remove_silence=False,
        api_name="/predict"
    )
    out_file = Path(res[0] if isinstance(res, (tuple, list)) else res)
    return out_file


def main():
    ap = argparse.ArgumentParser(description="Zero-Shot Voice Cloning for Faceless Shorts")
    ap.add_argument("project", help="Project directory path")
    ap.add_argument("--sample", help="Path to reference voice audio sample")
    ap.add_argument("--engine", choices=["xtts", "f5"], default="xtts", help="Cloning engine (default: xtts)")
    args = ap.parse_args()

    project_dir = Path(args.project).resolve()
    script_path = project_dir / "script.json"
    if not script_path.exists():
        sys.exit(f"Error: {script_path} not found")

    sample_audio = find_sample_audio(project_dir, args.sample)
    print(f"Using reference voice sample: {sample_audio}")

    # Standardize sample audio to 24kHz mono wav
    clean_sample = project_dir / "voices" / "_temp_sample_24k.wav"
    clean_sample.parent.mkdir(parents=True, exist_ok=True)
    convert_to_wav(sample_audio, clean_sample)

    script_data = json.loads(script_path.read_text(encoding="utf-8"))
    lines = script_data.get("lines", [])
    if not lines:
        sys.exit("Error: script.json contains no lines")

    print(f"Connecting to {args.engine.upper()} Voice Cloning engine...")
    if args.engine == "f5":
        client = Client("mrfakename/E2-F5-TTS")
        clone_fn = lambda txt: clone_line_f5(client, txt, clean_sample)
    else:
        client = Client("tonyassi/voice-clone")
        clone_fn = lambda txt: clone_line_xtts(client, txt, clean_sample)

    scenes_dir = project_dir / "scenes"
    scenes_dir.mkdir(parents=True, exist_ok=True)

    total_at = 0.0
    all_lines = []

    print(f"\nSynthesizing {len(lines)} lines in cloned voice...")
    for idx, line_obj in enumerate(lines):
        text = line_obj["text"].strip()
        scene_name = f"scene_{idx + 1:02d}"
        dst_wav = scenes_dir / f"{scene_name}.wav"

        print(f"  [{idx + 1}/{len(lines)}] Generating {scene_name}: \"{text}\"...")
        raw_output = clone_fn(text)

        # Convert to 24kHz mono wav and save into scene slot
        convert_to_wav(raw_output, dst_wav)
        dur = get_audio_duration(dst_wav)

        # Update scene JSON if it exists
        scene_json_path = scenes_dir / f"{scene_name}.json"
        if scene_json_path.exists():
            s_data = json.loads(scene_json_path.read_text(encoding="utf-8"))
            s_data["duration"] = dur
            s_data["at"] = round(total_at, 3)
            s_data["end"] = round(total_at + dur, 3)
            if s_data.get("visuals") and s_data["visuals"].get("dialogue"):
                s_data["visuals"]["dialogue"]["start"] = 0.15
                s_data["visuals"]["dialogue"]["end"] = round(dur - 0.2, 2)
            scene_json_path.write_text(json.dumps(s_data, ensure_ascii=False, indent=2), encoding="utf-8")

        all_lines.append({
            "i": idx,
            "text": text,
            "start": round(total_at, 3),
            "end": round(total_at + dur, 3)
        })
        total_at += dur
        print(f"       -> Saved {dst_wav.name} ({dur}s)")

    # Concatenate all into data/narration.wav
    data_dir = project_dir / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    concat_txt = project_dir / "_temp_concat.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for idx in range(len(lines)):
            f.write(f"file 'scenes/scene_{idx + 1:02d}.wav'\n")

    subprocess.run([
        "ffmpeg", "-v", "error", "-y",
        "-f", "concat", "-safe", "0",
        "-i", str(concat_txt),
        "-c", "copy",
        str(data_dir / "narration.wav")
    ], check=True)
    concat_txt.unlink(missing_ok=True)
    clean_sample.unlink(missing_ok=True)

    # Write lines.json
    (data_dir / "lines.json").write_text(
        json.dumps({
            "duration": round(total_at, 3),
            "voice": f"cloned:{sample_audio.stem}",
            "lines": all_lines
        }, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print(f"\nVoice cloning complete! Master audio saved to data/narration.wav ({total_at:.2f}s)")
    print(f"All {len(lines)} scene audio files and timings updated.")


if __name__ == "__main__":
    main()
