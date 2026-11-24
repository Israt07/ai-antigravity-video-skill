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
7. **Vintage Cartoon Moral**: dark 1930s rubber-hose moral parables, warm deal vs cold regret, scanlines & film grain. Example: *The Last Warm Meal*.
8. **Vintage Cartoon**: 1930s rubber-hose ink cartoon (wolf in pinstripes, pup in overalls), dark grey/sepia/navy palette, warm lamp, moonlit windows, film grain + scanlines. Example: *The Ten Year Deal*.

---

**How it works**
script.json → Kokoro voice (local, free) → Whisper word timings (local, free) → shots drawn in code, each cut and caption
placed on its word → procedural sound + music → headless Chrome captures every frame → ffmpeg renders the MP4.
The engine checks a contact sheet of the whole video before you ever see it.
Optional: when requested, the agent can upload the finished short to your YouTube channel through Zapier (it confirms title, visibility and category first).
PS C:\Users\israt\Desktop\ai-antigravity-video-skill-main\ai-antigravity-video-skill-main> cd c:\Users\israt\Desktop\ai-antigravity-video-skill-main\ai-antigravity-video-skill-main\studio
PS C:\Users\israt\Desnpm startntigravity-video-skill-main\ai-antigravity-video-skill-main\studio>
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see 
about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:1
+ npm start
+ ~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
PS C:\Users\israt\Desktop\ai-antigravity-video-skill-main\ai-antigravity-video-skill-main\studio> npm start
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see 
about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:1
+ npm start
+ ~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
PS C:\Users\israt\Desktop\ai-antigravity-video-skill-main\ai-antigravity-video-skill-main\studio> ^C
PS C:\Users\israt\Desktop\ai-antigravity-video-skill-main\ai-antigravity-video-skill-main\studio>
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
