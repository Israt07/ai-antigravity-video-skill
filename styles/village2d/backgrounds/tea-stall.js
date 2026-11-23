// Background: Tea Stall with palm trees (1080x1920)
// Roadside Bengali village tea stall (Tong-er dokan), tall coconut palms, wooden bench, and dirt road.

export function renderBackground(opts = {}) {
  return `
    <g id="bg_tea_stall">
      <defs>
        <linearGradient id="tea_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#A5CDE3"/>
          <stop offset="65%" stop-color="#E2E8D5"/>
          <stop offset="100%" stop-color="#EBDDBE"/>
        </linearGradient>
      </defs>

      <!-- Sky -->
      <rect x="0" y="0" width="1080" height="1200" fill="url(#tea_sky)"/>

      <!-- Distant Hills & Trees -->
      <path d="M0 900Q300 840 600 880T1080 870L1080 1300L0 1300Z" fill="#5B8749"/>
      <path d="M0 930Q400 880 800 920L1080 940L1080 1300L0 1300Z" fill="#477336"/>

      <!-- Tall Coconut / Date Palm Trees in Background -->
      <!-- Palm 1 (Left) -->
      <g id="palm_left">
        <!-- Trunk -->
        <path d="M140 1400C120 1100 130 800 150 500" stroke="#5D4037" stroke-width="26" stroke-linecap="round" fill="none"/>
        <path d="M140 1400C120 1100 130 800 150 500" stroke="#3E2723" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Palm fronds -->
        <g transform="translate(150, 500)">
          <path d="M0 0C-80 -80 -220 -60 -280 20" stroke="#2E523C" stroke-width="18" fill="none" stroke-linecap="round"/>
          <path d="M0 0C-40 -120 -150 -180 -220 -140" stroke="#3B694C" stroke-width="18" fill="none" stroke-linecap="round"/>
          <path d="M0 0C40 -130 140 -170 210 -110" stroke="#2E523C" stroke-width="18" fill="none" stroke-linecap="round"/>
          <path d="M0 0C90 -90 220 -80 270 -10" stroke="#3B694C" stroke-width="18" fill="none" stroke-linecap="round"/>
          <path d="M0 0C20 -60 50 -120 70 -200" stroke="#1D3828" stroke-width="16" fill="none" stroke-linecap="round"/>
        </g>
      </g>

      <!-- Palm 2 (Right) -->
      <g id="palm_right">
        <path d="M960 1400C940 1100 910 820 900 560" stroke="#5D4037" stroke-width="24" stroke-linecap="round" fill="none"/>
        <g transform="translate(900, 560)">
          <path d="M0 0C-70 -70 -180 -50 -230 10" stroke="#2E523C" stroke-width="16" fill="none" stroke-linecap="round"/>
          <path d="M0 0C-30 -110 -110 -150 -170 -120" stroke="#3B694C" stroke-width="16" fill="none" stroke-linecap="round"/>
          <path d="M0 0C30 -120 120 -150 180 -100" stroke="#2E523C" stroke-width="16" fill="none" stroke-linecap="round"/>
          <path d="M0 0C80 -80 180 -60 230 0" stroke="#3B694C" stroke-width="16" fill="none" stroke-linecap="round"/>
        </g>
      </g>

      <!-- Tea Stall Shack Structure -->
      <g id="tea_shack" transform="translate(180, 800)">
        <!-- Back wooden wall -->
        <rect x="60" y="60" width="700" height="520" fill="#795548" stroke="#3E2723" stroke-width="6"/>
        <line x1="60" y1="200" x2="760" y2="200" stroke="#4E342E" stroke-width="4"/>
        <line x1="60" y1="360" x2="760" y2="360" stroke="#4E342E" stroke-width="4"/>

        <!-- Shelves with glass biscuit jars & tea cups -->
        <rect x="100" y="220" width="620" height="14" fill="#3E2723"/>
        <!-- Glass jars -->
        <rect x="130" y="150" width="55" height="70" rx="6" fill="rgba(255,255,255,0.7)" stroke="#37474F" stroke-width="4"/>
        <rect x="140" y="165" width="35" height="45" rx="3" fill="#FFB74D"/>
        <rect x="220" y="150" width="55" height="70" rx="6" fill="rgba(255,255,255,0.7)" stroke="#37474F" stroke-width="4"/>
        <rect x="230" y="165" width="35" height="45" rx="3" fill="#D7CCC8"/>
        <rect x="310" y="150" width="55" height="70" rx="6" fill="rgba(255,255,255,0.7)" stroke="#37474F" stroke-width="4"/>
        <rect x="320" y="165" width="35" height="45" rx="3" fill="#81C784"/>

        <!-- Hanging bunch of yellow bananas -->
        <g transform="translate(640, 160)">
          <path d="M0 0C-10 30 -20 50 -10 70" stroke="#3E2723" stroke-width="4" fill="none"/>
          <ellipse cx="-12" cy="40" rx="6" ry="24" transform="rotate(25)" fill="#FDD835" stroke="#F57F17" stroke-width="2"/>
          <ellipse cx="6" cy="42" rx="6" ry="24" transform="rotate(-15)" fill="#FDD835" stroke="#F57F17" stroke-width="2"/>
          <ellipse cx="-4" cy="45" rx="6" ry="26" transform="rotate(5)" fill="#FFEE58" stroke="#F57F17" stroke-width="2"/>
        </g>

        <!-- Slanted Tin Awning Roof -->
        <polygon points="-20,-20 840,-20 800,120 20,120" fill="#2E523C" stroke="#1D3828" stroke-width="6"/>
        <polygon points="20,120 800,120 780,140 40,140" fill="#B71C1C"/>

        <!-- Wooden Counter Table -->
        <rect x="60" y="440" width="700" height="150" fill="#8D6E63" stroke="#3E2723" stroke-width="6"/>
        <rect x="40" y="420" width="740" height="30" rx="4" fill="#5D4037" stroke="#2B1B17" stroke-width="5"/>

        <!-- Big Metal Tea Kettle & Stove -->
        <g id="kettle" transform="translate(140, 360)">
          <!-- Clay stove base -->
          <path d="M0 60Q40 40 80 60L75 90L5 90Z" fill="#C17852" stroke="#4E342E" stroke-width="4"/>
          <!-- Metal kettle body -->
          <ellipse cx="40" cy="30" rx="36" ry="26" fill="#B0BEC5" stroke="#263238" stroke-width="4"/>
          <ellipse cx="40" cy="10" rx="22" ry="8" fill="#CFD8DC" stroke="#263238" stroke-width="3"/>
          <path d="M40 0L40 10" stroke="#263238" stroke-width="4"/>
          <!-- Kettle Spout -->
          <path d="M12 25L-15 10L-18 18L6 35Z" fill="#90A4AE" stroke="#263238" stroke-width="3"/>
          <!-- Handle -->
          <path d="M18 10C18 -20 62 -20 62 10" stroke="#37474F" stroke-width="6" fill="none"/>
          <!-- Steam curls -->
          <path d="M-18 6Q-30 -10 -20 -30" stroke="rgba(255,255,255,0.7)" stroke-width="3" fill="none" stroke-linecap="round"/>
        </g>

        <!-- Long Bamboo / Wooden Bench in front -->
        <g id="wooden_bench" transform="translate(240, 500)">
          <!-- Seat plank -->
          <rect x="-40" y="80" width="480" height="26" rx="5" fill="#5D4037" stroke="#2E1C14" stroke-width="5"/>
          <!-- Bench legs -->
          <rect x="-20" y="106" width="20" height="120" fill="#4E342E" stroke="#2E1C14" stroke-width="4"/>
          <rect x="180" y="106" width="20" height="120" fill="#4E342E" stroke="#2E1C14" stroke-width="4"/>
          <rect x="380" y="106" width="20" height="120" fill="#4E342E" stroke="#2E1C14" stroke-width="4"/>
        </g>
      </g>

      <!-- Sand Road Ground -->
      <g id="road_ground">
        <rect x="0" y="1380" width="1080" height="540" fill="#D7BE8A"/>
        <path d="M0 1460Q540 1420 1080 1480L1080 1920L0 1920Z" fill="#C9AD77"/>
      </g>
    </g>
  `;
}
