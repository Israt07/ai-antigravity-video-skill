# Vintage Cartoon Moral: dark 1930s rubber-hose story shorts, 9:16

A haunting, atmospheric 1930s rubber-hose moral parable format. Classic monochrome and muted vintage cartoon aesthetics: thick black ink strokes, flat desaturated shading, pie-cut cartoon eyes, and anthropomorphic animal characters navigating tempting life choices. Every short moves between a warm amber "deal" room and a chillingly desaturated cold "future regret" montage, resolving on a poignant life lesson.

Visual target & reference video: `references/reference.mp4` (`styles/vintage-cartoon-moral/reference/reference.mp4`).  
Example: `example/` = **THE TEN YEAR DEAL** (62 s, 10 shots). Sheet: `style-sheet.png`.

---

## 1. Format
- **Aspect Ratio:** 9:16 vertical (1080 × 1920 pixels)
- **Frame Rate:** 30 fps
- **Length:** 45–65 seconds
- **Scene Pacing:** 8–14 scenes, 3–6 seconds per scene

---

## 2. Look & Palette Rules
- **1930s Rubber-Hose Style:** Bold black ink outlines (`#111215`, stroke-width 7–12px), rounded rubbery joints, curved limbs without rigid elbows or knees, cartoon gloves with three black darts, pie-cut pacman pupils.
- **Two Contrasting Color Worlds:**
  - **Present / Deal Scenes (Warm Amber):**
    - Deep warm charcoal-brown background (`#1B140E`)
    - Rich mahogany desk (`#382212`)
    - Warm glowing oil/banker's lamp with soft golden-amber light cone (`#E89F30`, `rgba(232, 159, 48, 0.28)`)
    - Crescent moon glowing through an arched antique window (`#FFF4CF`)
    - Aged parchment contract (`#E8D8B5`) with red wax seal
  - **Future / Regret Scenes (Cold Desaturated Slate):**
    - Cold charcoal and desolate blue background (`#10151E`)
    - Drab gray office cubicle walls (`#1A212E`, `#232C3A`)
    - Harsh flickering fluorescent tube light
    - Eerie cyan glow from a smartphone in the dark (`#6AD1E3`, `rgba(106, 209, 227, 0.35)`)
    - Tired, hollow eye bags and sagging shoulders on the characters
- **Restrained Accents Only:**
  - Tempter: Dark charcoal pinstripe suit (`#202228`, `#363944`), white shirt, muted crimson red tie (`#9E3232`).
  - Victim: Off-white/cream sweater (`#EDE4CA`) with muted horizontal red stripes (`#A43838`), denim blue overalls (`#3D5068`) with brass buttons (`#C49339`).

---

## 3. Character Consistency Prompt Block
When generating or describing images for scenes, reuse this exact fixed character block across all prompts to guarantee character consistency:

```text
[CHARACTER CONSISTENCY BLOCK]:
1930s vintage rubber-hose cartoon style, bold black ink outlines, flat desaturated shading, authentic retro film texture.
TEMPTER: Anthropomorphic tall slender wolf, charcoal grey pinstripe suit, white collared shirt, muted crimson red necktie, white 3-dart cartoon gloves, sharp jaw, wide sly grin with pointed white teeth, classic black pacman pie-eyes, pointed wolf ears.
VICTIM: Anthropomorphic small young pup dog, floppy ears, large expressive pie-eyes, cream sweater with muted red horizontal stripes, denim blue overalls with brass buttons, white cartoon gloves.
SETTINGS:
Warm Deal Scenes: 1930s vintage study, warm golden-amber oil lamp illumination, dark rich shadows, mahogany desk, parchment paper, crescent moon outside arched window.
Cold Regret Scenes: Depressing desaturated cold slate blue and charcoal monochrome, harsh fluorescent office glow or eerie cyan smartphone screen light, tired hollow eyes, heavy shadows.
```

---

## 4. Camera & Motion Rules
- **Constant Ken Burns Motion:** Every shot continuously pushes in slowly from scale 1.00 to 1.12–1.14 across its duration.
- **Framing Variety:**
  - Establishing two-shots (Wolf and Pup across desk)
  - Over-the-shoulder views (Pup gazing down at glowing parchment)
  - Tight macro close-ups (Wolf's sharp-toothed grin and devious wink; Pup's trembling white-gloved hand signing)
  - Atmospheric inserts (buzzing fluorescent office cubicle; glowing phone in dark bedroom; dusty bathroom mirror)
- **Transitions:**
  - **Oval Iris-In / Iris-Out:** Classic 1930s circular/oval lens aperture opening or closing around the character.
  - **Fade to Black:** Slow cinematic fade (0.3–0.5s) between the deal being signed and the cold future montage.
  - **No Hard Flashy Cuts:** Cuts feel mechanical, smooth, and deliberate.

---

## 5. Post-Effects Chain
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

## 6. Audio Design
- **Voiceover:** Calm, slow, measured storyteller tone (`voice.py` default `am_michael` or `bm_george` with `--speed 0.92`). Deep and philosophical.
- **Music Bed:** `music_vintage_moral` in `tools/mix.py`: low warm sub-bass drone (58 Hz) layered with muted, deliberate D-minor piano arpeggios, bandpassed between 90 Hz and 2800 Hz to simulate an antique optical soundtrack. Ducks automatically under voiceover.
- **Foley:**
  - `clock`: Antique grandfather clock pendulum tick-tock.
  - `pen`: Fountain pen nib scratching on coarse parchment.
  - `paper`: Crisp parchment paper rustle.
  - `slide`: Wooden desk sliding sound.
  - `thud`: Dull low impact transition.
  - `whoosh`: Soft air movement.

---

## 7. Story Template
1. **Hook line:** *"What if ten years from now, you wake up and completely hate your life?"*
2. **Tempter offers deal:** The Wolf slides pen and contract across table (*"Sign here, kid. Easy road."*).
3. **Victim hesitates:** Young pup questions if there is a catch.
4. **Tempter pressures:** Wolf whispers reassurance with a sly wink (*"Just sign your twenties away."*).
5. **Victim signs / Iris-out:** Trembling paw signs; oval iris closes into blackness.
6. **Cold future montage:**
   - Cold drab office cubicle under fluorescent hum.
   - 3:00 AM in dark bedroom, face illuminated by cold smartphone glare.
   - Dusty mirror reflection clutching a faded photo of their younger self.
7. **Return to present:** Abruptly back in the warm amber room; the contract lies unsigned.
8. **One-line moral:** *"Ten years were just handed back to you. So what will you choose today?"*

---

## 8. Pipeline
1. **Script & Scene Breakdown:** Write `script.json` with 8–14 scenes specifying `text`, `caps`, `mood` (`warm` / `cold`), `camera`, `transition`, and `visual_prompt`.
2. **Timing Alignment:** Run `scripts/py scripts/voice.py <proj>` and `scripts/py scripts/words.py <proj>` (or `estimate.py` for captions-only).
3. **Scene Generation & Animation:** Build shots in `src/shots.js` using `src/core/kit.js` (or place generated images in `images/scene_XX.png`).
4. **Post-Effects & QA:** Headless Chrome renders every frame with scanlines, grain, dust, and vignette. Run `node tools/capture.mjs check` (must say `CHECK OK`) and `node tools/capture.mjs sheet review/all.jpg 1 8`.
5. **Audio Mixing:** Run `python tools/mix.py .` to generate `data/mix.wav`.
6. **Burn-in & Export:** Run `node tools/capture.mjs video renders/<name>.mp4` to produce the final 1080×1920 30fps vertical MP4.

---

## 9. QA Pitfalls
- **Accidental bright saturated colors:** The palette must remain desaturated charcoal, warm sepia, or cold slate. Never use bright green or electric colors.
- **Character drift:** The Wolf must always wear the pinstripe suit and red tie; the Pup must always wear the striped sweater and denim overalls.
- **Fast cuts:** Shots must breathe (3–6 seconds). Never use rapid 1-second cuts.
- **Captions clipping:** Captions must sit in the lower third (`y: 1400`), bold white with heavy black ink stroke.
