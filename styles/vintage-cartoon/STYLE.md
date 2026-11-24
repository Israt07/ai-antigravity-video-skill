# Vintage Cartoon: 1930s rubber-hose ink cartoon shorts, 9:16

Haunting, atmospheric 1930s rubber-hose moral parable format. Classic monochrome and muted retro aesthetics: thick black ink outlines, dark grey / sepia / navy palette with one warm lamp light, moonlit night windows, two-tone graphic shadows, and authentic optical film grain + scanlines + vignette + flicker overlays. Reusable SVG/Canvas characters: Wolf in a pinstripe suit and Pup in a striped sweater and overalls with expressions, blink, and talking mouths.

Example: `example/` = **THE TEN YEAR DEAL** (32 s, 10 shots). Style sheet: `style-sheet.png`.

---

## 1. The Look
- **1930s Rubber-Hose Ink Cartoon:** Bold black ink outlines (`#111216`, stroke width 8–12px), curved limbs without rigid joints, cartoon gloves with three black darts, pacman pie-eyes.
- **Palette:** Dark grey (`#181A22`, `#101117`), sepia parchment (`#F2EBD9`, `#E5D7B7`, `#3A2B1B`), navy blue (`#0D131F`, `#1A2438`).
- **One Warm Lamp Light:** Glowing banker's brass lamp casting an amber cone (`#E89D30`, `rgba(232, 157, 48, 0.35)`).
- **Moonlit Night Windows:** Arched antique window with crescent moon outside (`#E6EFFF`) against deep night navy.
- **Two-Tone Shadows:** Crisp graphic cel shading (one base tone, one darker tone, bold ink stroke).
- **Film Overlays:** Applied to every frame:
  1. Horizontal scanlines overlay (low opacity).
  2. Film grain + random jumping dust specks & hair scratches.
  3. Strong radial vignette darkening edges.
  4. Projector flicker ($\pm 2.5\%$ brightness).

---

## 2. Format
- **1080x1920, 30 fps, 25–45 s.** Lead silence 0.45 s, outro 0.9 s (in `script.json`).
- **Story Shape:**
  1. Hook line: *"What if ten years from now..."*
  2. Tempter offers deal: Wolf slides pen and contract across desk.
  3. Victim hesitates: Pup clutches ears, questioning catch.
  4. Tempter pressures: Wolf whispers with toothy smirk and wink.
  5. Signing: Trembling paw signs → room fades to black.
  6. Phone insert: 3:00 AM dark bedroom with cyan screen glare.
  7. Mirror regret: Dusty mirror reflection clutching faded photo.
  8. Return to present: Abruptly back in warm study; contract unsigned.
  9. Moral punchline: Stand tall, choose today.
- **Camera:** Layered scene transitions with punch-in on cuts, slow drift across shots, and smooth pans.

---

## 3. Captions
- Standard bold white text with thick black ink outline, 1 yellow keyword (`*`), bottom third (`y: 1400`).
- For bottom-heavy scenes (e.g. phone insert at `y: 960`), captions can be placed at `y: 340` via `capY`.

---

## 4. Characters & Components (`kit.js`)
- `drawWolf({ x, y, s, pose, blink, talk, mouth, eyeDir, headTilt, armL, armR })`:
  - Charcoal pinstripe suit, white collar, crimson red necktie.
  - Sharp jaw, pointed wolf ears, 3-dart gloves.
  - Animated blink (`blink: 0..1`), talking mouth (`talk: 0..1`), toothy grin.
- `drawPup({ x, y, s, pose, blink, talk, mouth, eyeDir, headTilt, tear })`:
  - Floppy hound ears, cream sweater with horizontal red stripes, denim blue overalls with brass buttons.
  - Animated blink (`blink: 0..1`), talking mouth (`talk: 0..1`), tear drop for mirror reflection.
- **Layered Scenes:**
  - `sceneWideStudy(t)`: Wide view of study with moonlit arched window, desk, warm lamp.
  - `sceneOTS(t)`: Over-the-shoulder view with foreground silhouette and glowing desk parchment.
  - `scenePhoneInsert(t)`: 3:00 AM dark bedroom, cyan phone screen glow, tired eyes.
  - `sceneMirror(t)`: Dusty oval mirror reflection holding vintage sepia photo.
  - `applyVintageOverlays(t)`: Scanlines, film grain, dust, vignette, flicker.

---

## 5. Sound Design
- **Voiceover:** Kokoro `am_michael` x1.0, calm, storyteller tone.
- **Music Bed:** `music_bed` in `tools/mix.py`: soft pad + plucked arpeggios ducked under voice.
- **Foley:** `whoosh`, `slide`, `clock`, `pen`, `paper`, `tock`, `thud`, `slam`.

---

## 6. Usage

```bash
# Start a new short with Vintage Cartoon
bash scripts/new_video.sh vintage-cartoon the-ten-year-deal

# In the project:
cd ~/faceless-shorts/the-ten-year-deal
node tools/capture.mjs check
node tools/capture.mjs cues
python3 tools/mix.py .
node tools/capture.mjs sheet review/all.jpg 1 8
node tools/capture.mjs video renders/the-ten-year-deal.mp4
```
