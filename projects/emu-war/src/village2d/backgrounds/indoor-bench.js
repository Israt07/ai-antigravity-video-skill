// Background: Indoor wall with bench (1080x1920)
// Cozy village interior, lime-washed clay wall, framed scenery, shuttered window, and a wooden bench (khat).

export function renderBackground(opts = {}) {
  return `
    <g id="bg_indoor_bench">
      <defs>
        <linearGradient id="wall_grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#EFE2CD"/>
          <stop offset="70%" stop-color="#E2D2B8"/>
          <stop offset="100%" stop-color="#C7B293"/>
        </linearGradient>
      </defs>

      <!-- Indoor Wall -->
      <rect x="0" y="0" width="1080" height="1420" fill="url(#wall_grad)"/>

      <!-- Ceiling wooden beam / rafter -->
      <rect x="0" y="0" width="1080" height="40" fill="#4E342E" stroke="#2B1B17" stroke-width="4"/>
      <rect x="0" y="40" width="1080" height="15" fill="#3E2723"/>

      <!-- Shuttered Wooden Window on Left -->
      <g id="indoor_window" transform="translate(140, 480)">
        <!-- Heavy dark wooden frame -->
        <rect x="-14" y="-14" width="308" height="388" fill="#4E342E" stroke="#261A15" stroke-width="6"/>
        <!-- Window opening with sky light -->
        <rect x="0" y="0" width="280" height="360" fill="#BFE3F2"/>
        <!-- Vertical security wooden bars -->
        <line x1="56" y1="0" x2="56" y2="360" stroke="#5D4037" stroke-width="6"/>
        <line x1="112" y1="0" x2="112" y2="360" stroke="#5D4037" stroke-width="6"/>
        <line x1="168" y1="0" x2="168" y2="360" stroke="#5D4037" stroke-width="6"/>
        <line x1="224" y1="0" x2="224" y2="360" stroke="#5D4037" stroke-width="6"/>
        <!-- Outside lush green leaves peeking -->
        <circle cx="80" cy="80" r="30" fill="#43A047" opacity="0.8"/>
        <circle cx="160" cy="110" r="40" fill="#2E7D32" opacity="0.8"/>
        <!-- Open wooden shutter flaps on sides -->
        <rect x="-80" y="0" width="70" height="360" fill="#5D4037" stroke="#261A15" stroke-width="5"/>
        <rect x="290" y="0" width="70" height="360" fill="#5D4037" stroke="#261A15" stroke-width="5"/>
      </g>

      <!-- Framed Village Picture / Scenery on Wall -->
      <g id="wall_frame" transform="translate(680, 500)">
        <rect x="-12" y="-12" width="264" height="204" rx="6" fill="#8D6E63" stroke="#3E2723" stroke-width="6"/>
        <rect x="0" y="0" width="240" height="180" fill="#FFF9C4"/>
        <!-- Scenic boat on river painting -->
        <path d="M0 120Q120 100 240 120L240 180L0 180Z" fill="#81D4FA"/>
        <path d="M70 140Q120 160 170 140L150 155L90 155Z" fill="#3E2723"/>
        <line x1="120" y1="110" x2="120" y2="140" stroke="#2B1B17" stroke-width="3"/>
        <polygon points="120,110 160,125 120,140" fill="#E53935"/>
        <circle cx="190" cy="50" r="22" fill="#FFA726"/>
      </g>

      <!-- Indoor Floor (Tiled / Rammed Clay) -->
      <g id="indoor_floor">
        <rect x="0" y="1420" width="1080" height="500" fill="#A8825A"/>
        <!-- Floor baseboard wooden molding -->
        <rect x="0" y="1410" width="1080" height="24" fill="#5D4037" stroke="#261A15" stroke-width="4"/>
        <line x1="0" y1="1540" x2="1080" y2="1540" stroke="#8D6B42" stroke-width="4"/>
        <line x1="0" y1="1680" x2="1080" y2="1680" stroke="#8D6B42" stroke-width="4"/>
      </g>

      <!-- Long Wooden Bench (Bench / Khat) -->
      <g id="bench" transform="translate(200, 1300)">
        <!-- Backrest if against wall -->
        <rect x="0" y="0" width="680" height="20" fill="#5D4037" stroke="#2B1B17" stroke-width="5"/>
        <line x1="120" y1="20" x2="120" y2="100" stroke="#5D4037" stroke-width="8"/>
        <line x1="340" y1="20" x2="340" y2="100" stroke="#5D4037" stroke-width="8"/>
        <line x1="560" y1="20" x2="560" y2="100" stroke="#5D4037" stroke-width="8"/>
        <!-- Main wooden seat plank -->
        <rect x="-20" y="90" width="720" height="34" rx="6" fill="#795548" stroke="#2B1B17" stroke-width="6"/>
        <!-- Sturdy carved bench legs -->
        <rect x="10" y="124" width="30" height="180" rx="4" fill="#5D4037" stroke="#2B1B17" stroke-width="5"/>
        <rect x="325" y="124" width="30" height="180" rx="4" fill="#5D4037" stroke="#2B1B17" stroke-width="5"/>
        <rect x="640" y="124" width="30" height="180" rx="4" fill="#5D4037" stroke="#2B1B17" stroke-width="5"/>
        <line x1="10" y1="220" x2="670" y2="220" stroke="#4E342E" stroke-width="6"/>
      </g>
    </g>
  `;
}
