# Vintage Cartoon Moral: dark 1930s rubber-hose story shorts, 9:16

A haunting, atmospheric 1930s rubber-hose moral parable format. Classic monochrome and muted vintage cartoon aesthetics: thick black ink strokes, flat desaturated shading, pie-cut cartoon eyes, and anthropomorphic animal characters navigating tempting life choices. Every short moves between a warm amber "deal" tavern and a chillingly desaturated cold "future regret" diner/station, resolving on a poignant life lesson.

All visuals are code-drawn (canvas 2D in `src/core/kit.js`). This skill never uses AI-generated images.

Example: `example/` = **THE LAST WARM MEAL** (~58 s, 23 cuts across 11 scenes). Sheet: `style-sheet.png`.

---

## 1. Format
- **Aspect Ratio:** 9:16 vertical (1080 × 1920 pixels)
- **Frame Rate:** 30 fps
- **Length:** 45–65 seconds
- **Scene Pacing:** 8–14 narration lines, split into 2–3 cuts of 1.5–3.5s each (20–28 shots total). No more than 2 consecutive shots with the same framing.

---

## 2. Look & Palette Rules
- **1930s Rubber-Hose Style:** Bold black ink outlines (`#111215`, stroke-width 7–12px), rounded rubbery joints, curved limbs without rigid elbows or knees, cartoon gloves with three black darts, pie-cut pacman pupils.
- **Two Contrasting Color Worlds:**
  - **Present / Deal Scenes (Warm Amber):**
    - Deep warm timber background (`#1C130D`)
    - Rich oak bar counter (`#442A18`)
    - Warm glowing oil lamp with soft golden-amber light cone (`#E89F30`, `rgba(232, 159, 48, 0.28)`)
    - Steaming golden stew bowl with wooden spoon
    - Snowy mountain inn exterior with amber windows
  - **Future / Regret Scenes (Cold Desaturated Slate):**
    - Cold charcoal and desolate blue background (`#0F141D`)
    - Drab tiled highway diner walls (`#1A2330`)
    - Harsh flickering fluorescent tube light overhead
    - Rusted midnight train platform in freezing fog
    - 3:00 AM clock and yellowed, creased railway ticket
    - Tired, hollow eye bags and sagging posture
- **Characters:**
  - **The Fox (Tempter):** Tall rust-orange fox in a black bowler hat, charcoal pinstripe vest, stained tavern apron, sly grin with sharp canine teeth, white 3-dart cartoon gloves.
  - **The Rabbit (Victim):** Small cream/tan rabbit with long expressive ears, knitted crimson-red scarf, patched olive-green winter coat, leather travel satchel, round pie-eyes.

---

## 3. Camera & Motion Rules
- **Constant Ken Burns Motion:** Every shot continuously pushes in slowly from scale 1.00 to 1.12–1.14 across its duration.
- **Framing Variety (No more than 2 consecutive shots with the same framing):**
  - `wide`: Establishing shots (inn exterior, tavern room, diner, train platform)
  - `medium`: Waist-up character interactions at the counter
  - `close-up`: Expressive character portraits on emotional beats
  - `extreme-close-up`: Intense eye expressions, winks, or ticket in paws
  - `over-the-shoulder`: Gazing past the rabbit toward the tempter or window
  - `insert`: Prop focal points (steaming stew, 3 AM clock, train caboose)
- **Transitions:**
  - **Oval Iris-In / Iris-Out:** Classic 1930s circular/oval lens aperture opening or closing around the character.
  - **Fade to Black:** Slow cinematic fade (0.3–0.5s) between present deal and cold future montage.
  - **No Hard Flashy Cuts:** Cuts feel mechanical, smooth, and deliberate.
- **Captions never cover faces:** Captions sit at `y: 1520` or flip to `y: 340` when foreground subjects occupy the lower frame.

---

## 4. Post-Effects Chain
Every frame applies a multi-layered authentic 1930s optical post-processing effect:
1. **Horizontal Scanlines:** Subtle low-opacity horizontal raster lines (`rgba(10, 12, 16, 0.07)` every 4px).
2. **Film Grain & Dust Specks:** Procedural 24fps jittered film grain with 4–6 jumping dust particles and hair fibers.
3. **Strong Vignette:** Heavy radial edge falloff darkening outer corners to `rgba(6, 5, 4, 0.82)`.
4. **Color Grade Tint:** Warm amber-sepia wash for deal scenes; cold desaturated blue wash for regret scenes.
5. **Subtle Flicker:** Organic optical projector brightness fluctuation (±3% lum).

*FFmpeg filter chain equivalent:*
```bash
-vf "curves=vintage,eq=saturation=0.82:contrast=1.12,noise=alls=12:allf=t+u,drawbox=x=0:y=0:w=iw:h=ih:color=black@0.15"
```

---

## 5. Audio Design
- **Voiceover:** Calm, slow, measured storyteller tone (`voice.py` default `am_michael` or `bm_george` with `--speed 0.92`). Deep and philosophical.
- **Music Bed:** `music_vintage_moral` in `tools/mix.py`: low warm sub-bass drone (58 Hz) layered with muted, deliberate D-minor piano arpeggios, bandpassed between 90 Hz and 2800 Hz to simulate an antique optical soundtrack. Ducks automatically under voiceover.
- **Foley:**
  - `whistle`: Distant 1930s steam train whistle echoing into fog.
  - `clock`: Antique clock pendulum tick-tock.
  - `paper`: Railway ticket unfolding rustle.
  - `slide`: Wooden counter slide / tavern door opening.
  - `thud`: Dull low impact transition.
  - `whoosh`: Soft air blizzard movement.

---

## 6. Story Template
1. **Hook line:** *"What if one warm meal kept you in a place you were never meant to stay?"*
2. **Arrival in storm:** Traveler steps into roadside inn to escape blizzard.
3. **Tempter offers deal:** Fox tavern keeper slides over hot stew (*"First bowl is free."*).
4. **Victim hesitates:** Traveler clutches travel bag (*"I should keep moving. My train leaves tonight."*).
5. **Tempter pressures:** Fox whispers reassurance (*"Tracks are frozen. Just stay until morning."*).
6. **Lapse & Iris-out:** He stayed that morning... and twenty years quietly slipped away.
7. **Cold future montage:**
   - Desolate highway diner under buzzing fluorescent hum.
   - Outside on rusted platform, midnight train rolls away into the fog.
   - 3:00 AM clock; trembling paws unfold the yellowed ticket never used.
8. **Return to present:** Abruptly back in the warm amber tavern; stew is still hot, bag still packed.
9. **One-line moral & departure:** Traveler grabs coat and walks into the cold snow.

---

## 7. Pipeline
1. **Script & Scene Breakdown:** Write `script.json` with 8–14 scenes specifying `text`, `caps`, `mood` (`warm` / `cold`).
2. **Timing Alignment:** Run `scripts/py scripts/voice.py <proj>` and `scripts/py scripts/words.py <proj>` (or `estimate.py` for captions-only).
3. **Scene Generation & Animation:** Build shots in `src/shots.js` using `src/core/kit.js` — all visuals are code-drawn canvas.
4. **Post-Effects & QA:** Headless Chrome renders every frame with scanlines, grain, dust, and vignette. Run `node tools/capture.mjs check` (must say `CHECK OK`) and `node tools/capture.mjs sheet review/all.jpg 1 8`.
5. **Audio Mixing:** Run `python tools/mix.py .` to generate `data/mix.wav`.
6. **Burn-in & Export:** Run `node tools/capture.mjs video renders/<name>.mp4` to produce the final 1080×1920 30fps vertical MP4.

---

## 8. Usage

```bash
# Start a new short with Vintage Cartoon Moral
bash scripts/new_video.sh vintage-cartoon-moral the-last-warm-meal

# In the project:
cd ~/faceless-shorts/the-last-warm-meal
node tools/capture.mjs check
node tools/capture.mjs cues
python3 tools/mix.py .
node tools/capture.mjs sheet review/all.jpg 1 8
node tools/capture.mjs video renders/the-last-warm-meal.mp4
```

---

## 9. QA Pitfalls
- **Accidental bright saturated colors:** The palette must remain desaturated charcoal, warm sepia, or cold slate. Never use bright green or electric colors.
- **Character scale & faces:** Keep heads and facial features large (pie-eyes, expressive mouths) so emotional beats read clearly on vertical mobile screens.
- **Fast cuts:** Shots must breathe (1.5–3.5s). Never use sub-second cuts.
- **Captions clipping faces:** Use `capY` overrides (e.g. top `capY: 340` or bottom `capY: 1520`) to keep captions away from faces and focal objects.
