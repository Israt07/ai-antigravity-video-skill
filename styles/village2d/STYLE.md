# Village 2D: Rural Cartoon Stories, 9:16

Warm, earthy, relatable rural Bangladeshi cartoon storytelling inspired by popular animated series like *Khatiyar Chair Kona*. Flat 2D vector cartoon characters (warm flat skin tones, thin dark outlines, big round chibi heads, expressive oval eyes, procedural mouth flaps and blinking) standing in handcrafted rural environments (tea stalls, mud/wooden houses with tin roofs and hand pumps, green paddy fields with mosques, feast tents). Dialogue is delivered in bold, rounded speech bubbles with directional speaker tails.

Example: `projects/tea-stall-prophet/` = **THE TEA STALL WEATHER PROPHET** (31.4 s, 7 scenes). Sheet: `style-sheet.png`.

---

## 1. Look & Palette Rules
- **Flat 2D Vector Characters**: All characters are rendered as pure SVG vector paths. Heads are rounder and larger (~130% body ratio) with friendly cartoon proportions.
- **Single Flat Skin Tone**: No multi-shade gradients or pink cheek blush on faces. Thin dark brown outline (`#2B1B1B`, stroke-width ~1.8).
- **Simple Expressive Eyes**: Clean white ovals (`rx=6.5, ry=8.5`) with a small solid black pupil (`rx=2.4, ry=3.2`). No eyelashes, no specular reflections. Blinking procedurally compresses eye height every ~3.5 seconds.
- **Nose & Mouth**: Nose is a tiny curved stroke (`M198 163Q202 165.5 199 168`). Mouth flap scales procedurally in Y during dialogue beats (`anim: 'talk'` or `'talk-still'`).
- **Warm Muted Palette**:
  - Sand Ground: `#D9C7A1`
  - Mud/Terracotta Walls: `#BA6E4C`
  - Tin Roof: `#284433`
  - Dusty Blue Shirt: `#5D7A94`
  - Slate/Muted Lungi: `#3B5875`
  - Mustard Blouse: `#C4985B`
  - Madder Saree Border: `#9A4141`
  - Off-white Pallu/Topi: `#F7F4EC`
- **Post-Processing**:
  - Vignette: Light lens vignette at 25% strength (`#vignette_grad`), no grey/dark top sky tint.
  - Film Grain: Subtle 3.5% organic SVG fractal turbulence texture (`#village_grain`).
  - Cross-dissolve: Quick 0.18s cross-dissolve fade between cuts.

---

## 2. Speech Bubbles
- Automatic auto-sizing white rounded rect with drop shadow (`filter: drop-shadow(...)`).
- Bold dark text (`#241E1A`) centered in bubble.
- Directional tail triangle automatically connecting the bubble to the speaker (`speakerX`, `speakerY`).

---

## 3. Modular Per-Scene Architecture
Every script line is an independent scene:
1. `scenes/scene_XX.json`: Metadata, duration, timing, and visual configuration.
2. `scenes/scene_XX.wav`: Exact cached audio slice for that line.
3. `scenes/scene_XX.js`: Visual definition module specifying background, cast, positions, and dialogue.
4. `out/scene_XX.mp4`: Individually rendered MP4 clip.
5. `renders/<project>.mp4`: Final video created by fast lossless concatenation of all per-scene clips.

---

## 4. Cast & Backgrounds
- **Backgrounds**: `tea-stall` (roadside tong), `house` (mud/wood house & tube-well), `mosque-field` (paddy field & mosque), `indoor-bench` (chowki daybed & window), `feast-tent` (biye bari shamiyana).
- **Outfits & Roles**:
  - `tea_chacha`: Elder with lungi, checked gamchha, mustache.
  - `young_man`: Adult in shirt and trousers.
  - `dadi`: Elder woman in saree, pallu head cover, glasses, optional baby in swaddle.
  - `elder_listener`: Elder man with prayer topi and white beard.
