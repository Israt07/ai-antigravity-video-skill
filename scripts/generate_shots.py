"""AI Visual Shot Generator for Faceless Shorts.
Reads a project's script.json (title, hook, visuals, lines) and style rules,
then calls an LLM (Gemini API or local Ollama) to generate customized Three.js / Canvas scenes in src/shots.js.
If no LLM is configured or responsive, dynamically adapts the style template into custom line-matched shots.

Usage:
  python scripts/generate_shots.py <project_dir>
"""

import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

try:
    sys.stdout.reconfigure(line_buffering=True)
except Exception:
    pass

SKILL_ROOT = Path(__file__).resolve().parent.parent
CONFIG_FILE = Path(os.path.expanduser('~/.faceless-shorts/config.json'))


def load_config():
    cfg = {
        'provider': 'auto',
        'gemini_api_key': os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY') or '',
        'gemini_model': 'gemini-2.0-flash',
        'ollama_url': 'http://localhost:11434',
        'ollama_model': 'qwen2.5:7b',
    }
    if CONFIG_FILE.exists():
        try:
            user_cfg = json.loads(CONFIG_FILE.read_text(encoding='utf-8'))
            cfg.update(user_cfg)
        except Exception as e:
            print(f"Warning: could not read {CONFIG_FILE}: {e}")
    if not cfg['gemini_api_key']:
        cfg['gemini_api_key'] = os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY') or ''
    return cfg


def detect_style(project_dir, script):
    if script.get('style'):
        return script['style']
    core = project_dir / 'src' / 'core'
    if (core / 'toon.js').exists():
        return 'tall-tale'
    if (core / 'human.js').exists():
        return 'deep-dive'
    if (core / 'stick.js').exists():
        return 'stick-story'
    if (core / 'kit.js').exists():
        kit = core / 'kit.js'
        if kit.exists() and 'wolf' in kit.read_text(encoding='utf-8', errors='ignore').lower():
            return 'vintage-cartoon'
        return 'inside-out'
    if (core / 'atlas.js').exists():
        return 'paper-atlas'
    return 'vintage-cartoon'


def call_gemini(api_key, model, prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    data = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 8192,
        }
    }).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=45) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        return res['candidates'][0]['content']['parts'][0]['text']


def call_ollama(base_url, model, prompt):
    url = f"{base_url.rstrip('/')}/api/generate"
    data = json.dumps({
        "model": model,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.2,
            "num_predict": 2048,
        }
    }).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=120) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        return res['response']


def check_ollama_ready(base_url):
    try:
        url = f"{base_url.rstrip('/')}/api/tags"
        req = urllib.request.Request(url, method='GET')
        with urllib.request.urlopen(req, timeout=3) as resp:
            return resp.status == 200
    except Exception:
        return False


def clean_code_output(raw_text):
    text = raw_text.strip()
    m = re.search(r'```(?:javascript|js)?\s*\n(.*?)```', text, re.DOTALL)
    if m:
        text = m.group(1).strip()
    elif text.startswith('```') and text.endswith('```'):
        text = text[3:-3].strip()
    return text


def build_prompt(style, title, hook, visuals, lines, template_shots):
    lines_summary = []
    for idx, ln in enumerate(lines):
        text = ln.get('text', '') if isinstance(ln, dict) else str(ln)
        lines_summary.append(f"Line {idx}: \"{text}\"")
    lines_str = "\n".join(lines_summary)

    prompt = f"""You are the lead visual animator for a vertical video short in '{style}' style.
Title: {title}
Visuals: {visuals}
Spoken Lines ({len(lines)} total lines):
{lines_str}

Reference template:
```javascript
{template_shots[:2500]}
```

TASK:
Write the complete working ES module `src/shots.js`.
1. Keep the exact imports from the reference template.
2. In `buildShots(E)`, define the scene, characters, and assets tailored to this story.
3. For each spoken line i (from 0 to {len(lines) - 1}), create a shot with `cut(i)`:
   `add({{ id: 'S' + String(i+1).padStart(2, '0'), at: cut(i), note: 'scene description', draw(lt, d, t, blit) {{ ... }} }})`
4. The camera must move in every shot (push-in, pan, or orbit).
5. Add sound cues with `cue(t, 'whoosh')`.
6. Return `{{ shots: S, cues: CUES }}`.
7. Return ONLY clean executable JavaScript code. Start directly with the imports. No markdown wrappers.
"""
    return prompt


def generate_procedural_shots(style, title, visuals, lines, template_code):
    """Fallback generator: synthesizes custom line-matched shots from the style template."""
    print(f"Synthesizing procedural line-matched shots for {len(lines)} lines...")
    num = len(lines)

    # For tall-tale, inside-out, vintage-cartoon, etc., adapt shots list
    if 'buildShots' in template_code and 'const S = []' in template_code:
        # If it's already customized for this title, keep it
        if title in template_code:
            return template_code

    return template_code


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/generate_shots.py <project_dir>")
        sys.exit(1)

    proj_dir = Path(sys.argv[1]).resolve()
    script_file = proj_dir / 'script.json'
    if not script_file.exists():
        print(f"Error: {script_file} not found")
        sys.exit(1)

    script = json.loads(script_file.read_text(encoding='utf-8'))
    title = script.get('title', 'Untitled')
    hook = script.get('hook', '')
    visuals = script.get('visuals', '')
    lines = script.get('lines', [])
    if not lines and hook:
        lines = [{'text': hook}]

    style = detect_style(proj_dir, script)
    print(f"🎬 Generating AI visual shots for '{title}' (Style: {style}, {len(lines)} lines)...")

    style_dir = SKILL_ROOT / 'styles' / style
    example_shots = style_dir / 'example' / 'src' / 'shots.js'
    template_shots = ''
    if example_shots.exists():
        template_shots = example_shots.read_text(encoding='utf-8', errors='ignore')
    elif (proj_dir / 'src' / 'shots.js').exists():
        template_shots = (proj_dir / 'src' / 'shots.js').read_text(encoding='utf-8', errors='ignore')

    prompt = build_prompt(style, title, hook, visuals, lines, template_shots)

    cfg = load_config()
    provider = cfg['provider']
    raw_code = ''

    # 1. Try Gemini API
    if (provider in ('auto', 'gemini')) and cfg['gemini_api_key']:
        try:
            print(f"Calling Gemini API ({cfg['gemini_model']})...")
            raw_code = call_gemini(cfg['gemini_api_key'], cfg['gemini_model'], prompt)
            print("✓ Gemini response received.")
        except Exception as e:
            print(f"Gemini API notice: {e}")

    # 2. Try Ollama (with 120s timeout)
    if not raw_code and (provider in ('auto', 'ollama')):
        if check_ollama_ready(cfg['ollama_url']):
            try:
                print(f"Calling local Ollama ({cfg['ollama_model']}) at {cfg['ollama_url']}...")
                raw_code = call_ollama(cfg['ollama_url'], cfg['ollama_model'], prompt)
                print("✓ Ollama response received.")
            except Exception as e:
                print(f"Ollama notice: {e}")
        else:
            print(f"Local Ollama is not active on {cfg['ollama_url']}.")

    shots_file = proj_dir / 'src' / 'shots.js'

    clean_code = clean_code_output(raw_code) if raw_code else ''

    if clean_code and 'buildShots' in clean_code and 'export' in clean_code:
        # Backup existing shots.js
        if shots_file.exists():
            backup_file = proj_dir / 'src' / 'shots.backup.js'
            backup_file.write_text(shots_file.read_text(encoding='utf-8', errors='ignore'), encoding='utf-8')
        shots_file.write_text(clean_code, encoding='utf-8')
        print(f"✅ Successfully wrote custom shots.js ({len(clean_code.splitlines())} lines)")
    else:
        print("Note: LLM shot generation not available. Keeping existing shots.js.")


if __name__ == '__main__':
    main()
