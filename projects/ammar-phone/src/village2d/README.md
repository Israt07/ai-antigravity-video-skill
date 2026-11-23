# Village 2D Style Guide (`village2d`)

A warm, flat 2D cartoon style inspired by Bangladeshi rural story animations (e.g. *Khatiyar Chair Kona*).

- **Resolution:** Vertical 1080×1920 (9:16)
- **Palette:** Warm, earthy, muted (sand ground, terracotta clay walls, corrugated dark green tin roofs, bright cyan/blue doors).
- **Outlines:** Clean 2.5px dark ink outlines (`#2B1B1B`).
- **Post-processing:** Subtle procedural film grain, subtle soft vignette, quick cross-dissolve (0.2s) between cuts.
- **Dialogue:** Bold rounded white speech bubbles with directional tails pointing to speakers.
- **Shot Duration:** 2–4 seconds per scene.

---

## 1. How to Add or Customize a Character

Characters are drawn dynamically using `character.js`. To add a new character in a scene:

```javascript
import { renderCharacter, animate } from './character.js';

// Define character traits
const villager = {
  id: 'farmer_latif',     // Unique instance ID (prefixes all internal SVG elements)
  age: 'elder',           // 'child' | 'adult' | 'elder'
  skin: '#B57A4C',        // Hex color or from SK palette
  hair: '#1B1411',        // Hair color (elders get natural silver gray)
  style: 'short',         // 'short' | 'sleek' | 'bob' | 'braids' | 'ponytail' | 'bun' | 'waist-length' | 'bald'
  outfit: 'lungi',        // 'shirt' | 'kameez' | 'saree' | 'lungi' | 'fatua'
  shirt: '#C94F4F',       // Saree/shirt/panjabi primary color
  pants: '#2F6F8F',       // Lungi/trousers checked pattern color
  blouse: '#E6B422',      // Saree blouse color
  hat: 'topi',            // 'none' | 'pallu' (head cover/ghomta) | 'topi' | 'tokai' (straw hat) | 'gamchha'
  expr: 'happy',          // 'happy' | 'neutral' | 'sad' | 'crying' | 'angry' | 'surprised'
  build: 'normal',        // 'slim' | 'normal' | 'chunky'
  glasses: false,         // Spectacles
  beard: true,            // Beard
  mustache: true,         // Mustache
  gamchha: true,          // Shoulder gamchha cloth
  baby: false,            // Holding swaddled baby in arms
  x: 100,                 // Stage X coordinate (0 - 1080)
  y: 880,                 // Stage Y coordinate (standing baseline)
  scale: 2.3              // Scale factor (typically 2.2 - 2.5)
};

// Render character SVG
const svgMarkup = renderCharacter(villager, villager.id);

// Animate character at time t
animate(villager.id, t, 'talk-still'); // 'idle' | 'talk-still' | 'talk' | 'walk' | 'wave' | 'dance' | 'jump'
```

### Available Animations:
- `'idle'`: Subtle breathing bob, swaying, and periodic blinking (~every 3.5s).
- `'talk-still'`: Body remains still on the ground, mouth flaps with dialogue cadence, gentle natural head tilt.
- `'talk'`: Full conversational gesture with hand movement and mouth flaps.
- `'wave'`: Friendly hand wave.
- `'walk'`: Striding leg and arm swing with foot stepping.

---

## 2. How to Add a New Background

All backgrounds are vertical 1080×1920 SVG components located in `styles/village2d/backgrounds/`.

1. Create a new file, e.g. `backgrounds/river-ghat.js`:

```javascript
// Background: River Ghat / Boat dock (1080x1920)
export function renderBackground(opts = {}) {
  return `
    <g id="bg_river_ghat">
      <!-- Sky / Horizon (Y: 0 - 900) -->
      <rect x="0" y="0" width="1080" height="900" fill="#BCD8EA"/>
      
      <!-- River water (Y: 900 - 1400) -->
      <rect x="0" y="900" width="1080" height="500" fill="#79B3C9"/>
      
      <!-- Earthen bank / foreground where characters stand (Y: 1400 - 1920) -->
      <rect x="0" y="1400" width="1080" height="520" fill="#D7BE8A"/>
    </g>
  `;
}
```

2. Register it in `backgrounds/index.js`:

```javascript
import { renderBackground as riverGhat } from './river-ghat.js';

export const BACKGROUNDS = {
  // ...existing
  'river-ghat': riverGhat
};
```

---

## 3. Built-in Backgrounds

| Name | Key in script.json | Description |
| :--- | :--- | :--- |
| **House with Blue Door** | `"house"` / `"house-pump"` | Terracotta mud walls, dark green tin roof, blue wooden door, tube-well hand pump. |
| **Roadside Tea Stall** | `"tea-stall"` / `"teastall"` | Bamboo shack stall with jars, kettle, bananas, bench, and tall palm trees. |
| **Mosque & Green Field** | `"mosque-field"` / `"mosque"` | Lush green paddy field, distant village mosque with dome and minaret. |
| **Indoor with Bench** | `"indoor-bench"` / `"indoor"` | Cozy clay wall with shuttered window, framed river painting, and wooden bench. |
| **Feast Tent** | `"feast-tent"` / `"feast"` | Festive striped shamiyana canopy, colorful pennants, lights, and banquet tables. |

---

## 4. How to Use in `script.json`

Set `"style": "village2d"` in your `script.json`:

```json
{
  "title": "Village Wedding Story",
  "style": "village2d",
  "voice": "am_michael",
  "lines": [
    {
      "text": "Mother, did you hear about the village wedding today?",
      "scene": {
        "background": "house",
        "speaker": "young_man",
        "characters": ["old_woman", "young_man"]
      }
    }
  ]
}
```
