// Background: Feast Tent (Biye bari / Shamiyana) (1080x1920)
// Traditional Bengali village wedding / community feast tent with colorful striped fabric canopy, celebratory flags, warm festive lighting, and wooden banquet seating.

export function renderBackground(opts = {}) {
  return `
    <g id="bg_feast_tent">
      <defs>
        <pattern id="tent_stripes" width="80" height="120" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="40" height="120" fill="#C62828"/>
          <rect x="40" y="0" width="40" height="120" fill="#FDD835"/>
        </pattern>
        <linearGradient id="warm_glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FFE082" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#FF8A65" stop-opacity="0.05"/>
        </linearGradient>
      </defs>

      <!-- Distant night/dusk village background -->
      <rect x="0" y="0" width="1080" height="1920" fill="#2E1C2B"/>

      <!-- Shamiyana (Fabric Canopy Ceiling) -->
      <g id="shamiyana_ceiling">
        <!-- Slanted tent fabric ceiling -->
        <polygon points="0,0 1080,0 1080,560 0,560" fill="url(#tent_stripes)"/>
        <!-- Dramatic Perspective Tent Rafters -->
        <path d="M540 0L0 560M540 0L360 560M540 0L720 560M540 0L1080 560" stroke="#B71C1C" stroke-width="8"/>

        <!-- Scalloped Cloth Valance Edge -->
        <path d="
          M 0 560
          Q 45 610 90 560 Q 135 610 180 560 Q 225 610 270 560
          Q 315 610 360 560 Q 405 610 450 560 Q 495 610 540 560
          Q 585 610 630 560 Q 675 610 720 560 Q 765 610 810 560
          Q 855 610 900 560 Q 945 610 990 560 Q 1035 610 1080 560
        " fill="#FFFFFF" stroke="#C62828" stroke-width="4"/>

        <!-- Strings of Festive Pennant Bunting (Jhalor) -->
        <g id="festive_pennants" transform="translate(0, 620)">
          <path d="M0 0Q270 60 540 10T1080 0" stroke="#FFD54F" stroke-width="3" fill="none"/>
          <!-- Pennants -->
          <polygon points="60,12 80,45 100,14" fill="#E53935"/>
          <polygon points="150,22 170,55 190,24" fill="#43A047"/>
          <polygon points="240,28 260,62 280,30" fill="#1E88E5"/>
          <polygon points="330,30 350,65 370,30" fill="#FB8C00"/>
          <polygon points="420,25 440,58 460,24" fill="#9C27B0"/>
          <polygon points="510,16 530,48 550,15" fill="#E53935"/>
          <polygon points="600,14 620,46 640,15" fill="#43A047"/>
          <polygon points="690,18 710,50 730,20" fill="#1E88E5"/>
          <polygon points="780,24 800,56 820,25" fill="#FB8C00"/>
          <polygon points="870,25 890,56 910,24" fill="#9C27B0"/>
          <polygon points="960,18 980,48 1000,16" fill="#E53935"/>
        </g>

        <!-- Hanging Lanterns / Fairy Lights -->
        <g id="party_lights">
          <circle cx="200" cy="580" r="14" fill="#FFF59D"/>
          <circle cx="200" cy="580" r="26" fill="rgba(255,235,59,0.3)"/>
          <circle cx="540" cy="580" r="16" fill="#FFF59D"/>
          <circle cx="540" cy="580" r="30" fill="rgba(255,235,59,0.3)"/>
          <circle cx="880" cy="580" r="14" fill="#FFF59D"/>
          <circle cx="880" cy="580" r="26" fill="rgba(255,235,59,0.3)"/>
        </g>
      </g>

      <!-- Wrapped Bamboo Support Tent Poles -->
      <g id="tent_poles">
        <!-- Left pole wrapped in red and white cloth -->
        <rect x="120" y="480" width="34" height="1000" fill="#FFFFFF" stroke="#2B1B17" stroke-width="5"/>
        <line x1="120" y1="600" x2="154" y2="570" stroke="#C62828" stroke-width="12"/>
        <line x1="120" y1="750" x2="154" y2="720" stroke="#C62828" stroke-width="12"/>
        <line x1="120" y1="900" x2="154" y2="870" stroke="#C62828" stroke-width="12"/>
        <line x1="120" y1="1050" x2="154" y2="1020" stroke="#C62828" stroke-width="12"/>
        <line x1="120" y1="1200" x2="154" y2="1170" stroke="#C62828" stroke-width="12"/>

        <!-- Right pole wrapped in cloth -->
        <rect x="920" y="480" width="34" height="1000" fill="#FFFFFF" stroke="#2B1B17" stroke-width="5"/>
        <line x1="920" y1="600" x2="954" y2="570" stroke="#C62828" stroke-width="12"/>
        <line x1="920" y1="750" x2="954" y2="720" stroke="#C62828" stroke-width="12"/>
        <line x1="920" y1="900" x2="954" y2="870" stroke="#C62828" stroke-width="12"/>
        <line x1="920" y1="1050" x2="954" y2="1020" stroke="#C62828" stroke-width="12"/>
        <line x1="920" y1="1200" x2="954" y2="1170" stroke="#C62828" stroke-width="12"/>
      </g>

      <!-- Feast Table in Midground -->
      <g id="feast_tables" transform="translate(140, 1150)">
        <rect x="0" y="0" width="800" height="240" fill="#5D4037" stroke="#2B1B17" stroke-width="6"/>
        <!-- White paper or banana leaf runner on table -->
        <rect x="-10" y="-12" width="820" height="24" fill="#FAFAFA" stroke="#E0E0E0" stroke-width="3"/>
        <!-- Clay water cups and serving handi pots -->
        <ellipse cx="120" cy="-20" rx="14" ry="10" fill="#8D6E63" stroke="#4E342E" stroke-width="3"/>
        <ellipse cx="280" cy="-22" rx="36" ry="16" fill="#C4734B" stroke="#4E342E" stroke-width="4"/>
        <ellipse cx="480" cy="-20" rx="14" ry="10" fill="#8D6E63" stroke="#4E342E" stroke-width="3"/>
        <ellipse cx="640" cy="-22" rx="36" ry="16" fill="#C4734B" stroke="#4E342E" stroke-width="4"/>
      </g>

      <!-- Sand/Earthen Ground -->
      <g id="tent_ground">
        <rect x="0" y="1380" width="1080" height="540" fill="#D7BE8A"/>
        <path d="M0 1440Q540 1400 1080 1440L1080 1920L0 1920Z" fill="#CBB07B" stroke="#9A8256" stroke-width="4"/>
      </g>

      <!-- Ambient Warm Festivity Glow -->
      <rect x="0" y="0" width="1080" height="1920" fill="url(#warm_glow)"/>
    </g>
  `;
}
