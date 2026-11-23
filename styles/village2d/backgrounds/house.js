// Background: House with blue door and hand pump (1080x1920)
// Warm terracotta walls, dark green corrugated tin roof, dusty muted blue door, and sand ground.

export function renderBackground(opts = {}) {
  return `
    <g id="bg_house">
      <!-- Sky: Soft warm daylight (no cool grey tint) -->
      <defs>
        <linearGradient id="house_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#E8F0F2"/>
          <stop offset="55%" stop-color="#F2EDE2"/>
          <stop offset="100%" stop-color="#FAF5EB"/>
        </linearGradient>
        <pattern id="tin_roof" width="20" height="20" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="20" stroke="#1E3526" stroke-width="3"/>
          <line x1="10" y1="0" x2="10" y2="20" stroke="#284433" stroke-width="2"/>
        </pattern>
      </defs>

      <!-- Warm daylight sky fill -->
      <rect x="0" y="0" width="1080" height="1200" fill="url(#house_sky)"/>

      <!-- Distant Village Foliage (Muted olive & sage greens) -->
      <g id="distant_trees">
        <circle cx="120" cy="880" r="140" fill="#4D6E42" stroke="#283F20" stroke-width="3.5"/>
        <circle cx="280" cy="860" r="160" fill="#3F6136" stroke="#283F20" stroke-width="3.5"/>
        <circle cx="480" cy="870" r="130" fill="#496B3E" stroke="#283F20" stroke-width="3.5"/>
        <!-- Banana plant leaves on left -->
        <g transform="translate(80, 940)">
          <ellipse cx="-40" cy="-60" rx="22" ry="90" transform="rotate(-30)" fill="#537A40" stroke="#2B451E" stroke-width="3.5"/>
          <ellipse cx="40" cy="-60" rx="22" ry="90" transform="rotate(30)" fill="#537A40" stroke="#2B451E" stroke-width="3.5"/>
          <ellipse cx="0" cy="-70" rx="24" ry="100" fill="#5C8747" stroke="#2B451E" stroke-width="3.5"/>
        </g>
      </g>

      <!-- House Structure -->
      <g id="main_house">
        <!-- Terracotta clay wall base (warm muted terracotta) -->
        <rect x="180" y="800" width="860" height="650" fill="#BA6E4C" stroke="#36221A" stroke-width="5.5"/>
        <!-- Wall plaster texture lines -->
        <path d="M220 950H980M200 1150H1000M240 1350H960" stroke="#A25B3B" stroke-width="3.5" stroke-dasharray="14 24" fill="none"/>

        <!-- Overhanging dark green tin roof -->
        <polygon points="120,830 1060,830 1020,880 160,880" fill="rgba(35,22,16,0.22)"/>
        <!-- Dark green corrugated tin awning -->
        <polygon points="110,680 1060,680 1040,840 130,840" fill="#284433" stroke="#1C3023" stroke-width="6"/>
        <polygon points="110,680 1060,680 1040,840 130,840" fill="url(#tin_roof)" opacity="0.6"/>

        <!-- Eaves wooden trim -->
        <rect x="120" y="830" width="930" height="18" fill="#523930" stroke="#34221A" stroke-width="4"/>

        <!-- Dusty Muted Blue Wooden Door -->
        <g id="blue_door" transform="translate(380, 910)">
          <!-- Wooden frame -->
          <rect x="-14" y="-14" width="288" height="528" rx="8" fill="#423229" stroke="#261A13" stroke-width="5.5"/>
          <!-- Dusty desaturated blue door panel -->
          <rect x="0" y="0" width="260" height="500" rx="4" fill="#41728E" stroke="#335E77" stroke-width="4.5"/>
          <!-- Door wood planks -->
          <line x1="65" y1="0" x2="65" y2="500" stroke="#335E77" stroke-width="3.5"/>
          <line x1="130" y1="0" x2="130" y2="500" stroke="#26485D" stroke-width="4"/>
          <line x1="195" y1="0" x2="195" y2="500" stroke="#335E77" stroke-width="3.5"/>
          <!-- Horizontal door battens -->
          <rect x="10" y="50" width="240" height="24" fill="#3B6882" stroke="#26485D" stroke-width="2.5"/>
          <rect x="10" y="240" width="240" height="24" fill="#3B6882" stroke="#26485D" stroke-width="2.5"/>
          <rect x="10" y="420" width="240" height="24" fill="#3B6882" stroke="#26485D" stroke-width="2.5"/>
          <!-- Brass latch & handle (warm muted gold) -->
          <circle cx="36" cy="252" r="10" fill="#E0BC62" stroke="#36251C" stroke-width="2.5"/>
          <rect x="28" y="248" width="40" height="8" rx="3" fill="#D4AE52" stroke="#36251C" stroke-width="2"/>
        </g>

        <!-- Window with wooden shutters -->
        <g id="house_window" transform="translate(740, 950)">
          <rect x="-8" y="-8" width="196" height="216" fill="#423229" stroke="#261A13" stroke-width="4.5"/>
          <rect x="0" y="0" width="180" height="200" fill="#354045"/>
          <!-- Window iron security bars -->
          <line x1="36" y1="0" x2="36" y2="200" stroke="#6C7F87" stroke-width="3.5"/>
          <line x1="72" y1="0" x2="72" y2="200" stroke="#6C7F87" stroke-width="3.5"/>
          <line x1="108" y1="0" x2="108" y2="200" stroke="#6C7F87" stroke-width="3.5"/>
          <line x1="144" y1="0" x2="144" y2="200" stroke="#6C7F87" stroke-width="3.5"/>
          <!-- Open shutters in dusty blue -->
          <rect x="-50" y="0" width="50" height="200" fill="#41728E" stroke="#335E77" stroke-width="3.5"/>
          <rect x="180" y="0" width="50" height="200" fill="#41728E" stroke="#335E77" stroke-width="3.5"/>
        </g>

        <!-- Veranda Wooden Pillars -->
        <rect x="190" y="840" width="24" height="580" fill="#523930" stroke="#2A1B14" stroke-width="4.5"/>
        <rect x="1000" y="840" width="24" height="580" fill="#523930" stroke="#2A1B14" stroke-width="4.5"/>
      </g>

      <!-- Courtyard Warm Sand Ground -->
      <g id="sand_ground">
        <rect x="0" y="1400" width="1080" height="520" fill="#D9C7A1"/>
        <path d="M0 1440Q540 1410 1080 1440L1080 1920L0 1920Z" fill="#CBB68F" stroke="#94805A" stroke-width="3.5"/>
        <ellipse cx="540" cy="1750" rx="360" ry="80" fill="#BEA87F" opacity="0.35"/>
      </g>

      <!-- Cast-Iron Hand Pump (Tubewell) -->
      <g id="hand_pump" transform="translate(860, 1420)">
        <!-- Concrete base / circular washing platform -->
        <ellipse cx="40" cy="130" rx="130" ry="42" fill="#B5BFC2" stroke="#4F5D63" stroke-width="5"/>
        <ellipse cx="40" cy="144" rx="130" ry="36" fill="#9BA5A8" stroke="#4F5D63" stroke-width="4.5"/>
        <!-- Water puddle around pump (soft muted aqua) -->
        <ellipse cx="60" cy="136" rx="60" ry="16" fill="#78C2CA" opacity="0.6"/>

        <!-- Pump base cylinder (muted iron) -->
        <rect x="24" y="0" width="32" height="120" rx="4" fill="#3D484D" stroke="#1D2426" stroke-width="4.5"/>
        <rect x="16" y="90" width="48" height="18" fill="#4B585E" stroke="#1D2426" stroke-width="3.5"/>
        <!-- Pump body / head -->
        <circle cx="40" cy="-20" r="28" fill="#4B585E" stroke="#1D2426" stroke-width="4.5"/>
        <rect x="28" y="-60" width="24" height="42" fill="#3D484D" stroke="#1D2426" stroke-width="3.5"/>
        <rect x="20" y="-72" width="40" height="14" rx="3" fill="#2D363B" stroke="#1D2426" stroke-width="3.5"/>

        <!-- Water Spout -->
        <path d="M26 20L-25 35L-22 55L26 40Z" fill="#3D484D" stroke="#1D2426" stroke-width="3.5"/>
        <!-- Water drop trickling -->
        <ellipse cx="-24" cy="72" rx="4" ry="7" fill="#58B2BC"/>

        <!-- Long pump handle -->
        <line x1="50" y1="-20" x2="160" y2="40" stroke="#1D2426" stroke-width="8" stroke-linecap="round"/>
        <line x1="50" y1="-20" x2="160" y2="40" stroke="#6E7E85" stroke-width="4.5" stroke-linecap="round"/>
        <circle cx="160" cy="40" r="10" fill="#2D363B" stroke="#1D2426" stroke-width="3.5"/>
      </g>
    </g>
  `;
}
