# AI Antigravity Video Skill

Narrated faceless shorts (YouTube Shorts, TikTok, Reels) made 100% in code on your own computer: script, AI voice,
word-synced captions, animation, sound effects and music, rendered to MP4. No AI video, no API keys, no credits.

**Styles** (each has a style sheet, a style guide and a finished example video project)
1. **Deep Dive 3D** (flagship): Zack D. Films-like 3D "What happens if…?" explainers. Example: *What happens if you hold your breath?*
2. **Night File 3D**: unsolved mysteries and true crime in dark 3D rooms. Example: *The man who jumped out of a plane* (D.B. Cooper).
3. **Inside Out**: flat 2D x-ray explainers. Example: *What if you swallow gum?*
4. **Stick Story**: stick-figure survival steps. Example: *What if the power went out for 3 days?*
5. **Paper Atlas**: history in cut paper and maps. Example: *How one bakery burned down London*.
6. **Tall Tale 3D**: funny true stories, flat 2D cartoon people in a sunny 3D world. Example: *The girl who was mailed to grandma*.
7. **Vintage Cartoon Moral**: dark 1930s rubber-hose moral parables, anthropomorphic tempter wolf & victim pup, warm amber deal room vs cold desaturated regret, Ken Burns slow push-in, scanlines & film grain. Example: *The Ten Year Deal*. Reference: `references/reference.mp4`.

---

### Vintage Cartoon Moral Style

**Visual Target:** Authentic 1930s rubber-hose animation with thick black ink outlines, flat desaturated shading, pie-cut eyes, and two contrasting worlds:
- **Warm Deal:** Dark vintage study, mahogany desk, parchment contract, warm amber lamp light (`#E89F30`), crescent moon outside arched window.
- **Cold Regret:** Cold desaturated blue/grayscale (`#10151E`), lifeless office cubicle under flickering fluorescent light, 3:00 AM smartphone screen glow, dusty bathroom mirror.

**Fixed Character Consistency Block (reused in every scene prompt):**
```text
1930s vintage rubber-hose cartoon style, bold black ink outlines, flat desaturated shading, authentic retro film texture.
TEMPTER: Anthropomorphic tall slender wolf, charcoal grey pinstripe suit, white collared shirt, muted crimson red necktie, white 3-dart cartoon gloves, sharp jaw, wide sly grin with pointed white teeth, classic black pacman pie-eyes, pointed wolf ears.
VICTIM: Anthropomorphic small young pup dog, floppy ears, large expressive pie-eyes, cream sweater with muted red horizontal stripes, denim blue overalls with brass buttons, white cartoon gloves.
SETTINGS:
Warm Deal Scenes: 1930s vintage study, warm golden-amber oil lamp illumination, dark rich shadows, mahogany desk, parchment paper, crescent moon outside arched window.
Cold Regret Scenes: Depressing desaturated cold slate blue and charcoal monochrome, harsh fluorescent office glow or eerie cyan smartphone screen light, tired hollow eyes, heavy shadows.
```

**Usage:**
```bash
# Start a new short with Vintage Cartoon Moral
bash scripts/new_video.sh vintage-cartoon-moral the-ten-year-deal

# In the project:
cd ~/faceless-shorts/the-ten-year-deal
node tools/capture.mjs check
node tools/capture.mjs cues
python3 tools/mix.py .
node tools/capture.mjs sheet review/all.jpg 1 8
node tools/capture.mjs video renders/the-ten-year-deal.mp4
```

**Sample Script (`script.json`):**
```json
{
  "title": "The Ten Year Deal",
  "style": "vintage-cartoon-moral",
  "format": "9:16 vertical 1080x1920",
  "music": "vintage_moral",
  "voice": "am_michael",
  "voice_speed": 0.92,
  "lines": [
    {
      "id": "scene_01",
      "text": "What if ten years from now, you wake up and completely hate your life?",
      "caps": "WHAT IF *TEN YEARS | YOU HATE *YOUR LIFE?",
      "mood": "warm",
      "camera": { "move": "push-in", "from": 1.0, "to": 1.12, "focus": [540, 960] },
      "transition": "iris-in"
    },
    {
      "id": "scene_02",
      "text": "The wolf slides a golden pen across the mahogany table: 'Sign here, kid. An easy road. No struggle.'",
      "caps": "SIGN *HERE KID | AN *EASY ROAD",
      "mood": "warm",
      "camera": { "move": "push-in", "from": 1.0, "to": 1.12, "focus": [540, 1100] },
      "transition": "none"
    },
    {
      "id": "scene_05",
      "text": "With a trembling paw, the pup signs the parchment... and the room fades to black.",
      "caps": "TREMBLING *PAW SIGNS | FADES TO *BLACK",
      "mood": "warm",
      "camera": { "move": "push-in", "from": 1.0, "to": 1.14, "focus": [540, 1050] },
      "transition": "iris-out"
    },
    {
      "id": "scene_06",
      "text": "Ten years pass in an instant. A cold, lifeless office under buzzing fluorescent lights.",
      "caps": "TEN YEARS *PASS | COLD *LIFELESS OFFICE",
      "mood": "cold",
      "camera": { "move": "push-in", "from": 1.0, "to": 1.12, "focus": [540, 960] },
      "transition": "fade-black"
    },
    {
      "id": "scene_10",
      "text": "Ten years were just handed back to you. So what will you choose today?",
      "caps": "HANDED *BACK TO YOU | WHAT WILL YOU *CHOOSE?",
      "mood": "warm",
      "camera": { "move": "push-in", "from": 1.0, "to": 1.12, "focus": [540, 850] },
      "transition": "iris-out"
    }
  ]
}
```

**How it works**
script.json → Kokoro voice (local, free) → Whisper word timings (local, free) → shots drawn in code, each cut and caption
placed on its word → procedural sound + music → headless Chrome captures every frame → ffmpeg renders the MP4.
The engine checks a contact sheet of the whole video before you ever see it.
Optional: when requested, the agent can upload the finished short to your YouTube channel through Zapier (it confirms title, visibility and category first).

**Needs:** Antigravity / Agentic Assistant (or any environment with terminal/bash execution), Node.js 22+, ffmpeg, Google Chrome, Python 3.10+, ~1 GB for the
voice and Whisper models. Automated scripts install what's missing.

**Windows:** run the scripts in Git Bash (installed with Git for Windows).

**Install:** place this repository in your skills directory, then run `bash scripts/setup.sh` (prints "All set")
and `bash scripts/selftest.sh` (prints "SELFTEST PASSED"). Start a session and prompt:
"Make a Deep Dive 3D short: what happens if you crack your knuckles?"

**Layout:** `SKILL.md` (the core skill specification) · `scripts/` (setup, selftest, new_video, voice, words, estimate) ·
`styles/<style>/` (`style-sheet.png`, `STYLE.md`, `example/` = a complete project that renders as-is).

**Licenses:** the code, stories, drawings and sound are original and free to use in your videos. Inter font: SIL Open Font
License 1.1. Installed on first use: Kokoro-82M (Apache-2.0) via kokoro-onnx (MIT), faster-whisper + Whisper small.en (MIT),
numpy, scipy.
