// Background: Mosque and green field (1080x1920)
// Serene village mosque with minaret and green dome, expansive green paddy fields, and mud paths.

export function renderBackground(opts = {}) {
  return `
    <g id="bg_mosque_field">
      <defs>
        <linearGradient id="mosque_sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#9BC7E5"/>
          <stop offset="60%" stop-color="#DEEAD7"/>
          <stop offset="100%" stop-color="#F5F1DA"/>
        </linearGradient>
        <linearGradient id="field_grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7CB342"/>
          <stop offset="50%" stop-color="#558B2F"/>
          <stop offset="100%" stop-color="#33691E"/>
        </linearGradient>
      </defs>

      <!-- Soft Sky -->
      <rect x="0" y="0" width="1080" height="950" fill="url(#mosque_sky)"/>

      <!-- Distant Village Treeline -->
      <path d="M0 720Q280 660 540 690T1080 680L1080 950L0 950Z" fill="#3E6B34" stroke="#243F1D" stroke-width="4"/>

      <!-- Distant Village Mosque -->
      <g id="distant_mosque" transform="translate(680, 520)">
        <!-- Mosque Main Hall -->
        <rect x="60" y="160" width="220" height="150" fill="#F5F5F5" stroke="#37474F" stroke-width="5"/>
        <!-- Arched Doorway and Windows -->
        <path d="M140 310V220Q170 190 200 220V310Z" fill="#1E88E5" stroke="#37474F" stroke-width="4"/>
        <path d="M85 240V210Q100 195 115 210V240Z" fill="#455A64"/>
        <path d="M225 240V210Q240 195 255 210V240Z" fill="#455A64"/>

        <!-- Main Green Dome -->
        <path d="M120 160Q170 80 220 160Z" fill="#2E7D32" stroke="#1B5E20" stroke-width="4"/>
        <!-- Golden Crescent on Dome -->
        <line x1="170" y1="80" x2="170" y2="55" stroke="#FFD700" stroke-width="4"/>
        <path d="M165 55A8 8 0 1 0 175 42A11 11 0 1 1 165 55" fill="#FFD700"/>

        <!-- Tall Minaret Tower -->
        <g id="minaret" transform="translate(20, -10)">
          <!-- Base shaft -->
          <rect x="0" y="100" width="45" height="220" fill="#EEEEEE" stroke="#37474F" stroke-width="4"/>
          <!-- Minaret balcony -->
          <rect x="-8" y="100" width="61" height="18" rx="3" fill="#2E7D32" stroke="#1B5E20" stroke-width="3"/>
          <line x1="-8" y1="92" x2="53" y2="92" stroke="#37474F" stroke-width="3"/>
          <!-- Minaret cupola dome -->
          <rect x="5" y="50" width="35" height="50" fill="#F5F5F5" stroke="#37474F" stroke-width="3"/>
          <path d="M5 50Q22 10 40 50Z" fill="#2E7D32" stroke="#1B5E20" stroke-width="3"/>
          <line x1="22" y1="10" x2="22" y2="-5" stroke="#FFD700" stroke-width="3"/>
        </g>
      </g>

      <!-- Betel Nut / Supari Palm Grove on Left -->
      <g id="betel_palms" transform="translate(60, 480)">
        <line x1="80" y1="460" x2="90" y2="80" stroke="#4E342E" stroke-width="12" stroke-linecap="round"/>
        <circle cx="90" cy="80" r="40" fill="#2E523C"/>
        <line x1="140" y1="480" x2="145" y2="120" stroke="#4E342E" stroke-width="11" stroke-linecap="round"/>
        <circle cx="145" cy="120" r="36" fill="#3B694C"/>
        <line x1="200" y1="490" x2="195" y2="150" stroke="#4E342E" stroke-width="11" stroke-linecap="round"/>
        <circle cx="195" cy="150" r="34" fill="#2E523C"/>
      </g>

      <!-- Expansive Lush Green Paddy Field -->
      <g id="paddy_fields">
        <!-- Far field -->
        <rect x="0" y="850" width="1080" height="300" fill="#8BC34A"/>
        <!-- Field ridges (Ail / earthen bunds) -->
        <path d="M0 980Q450 940 1080 970L1080 1020Q540 990 0 1030Z" fill="#5D4037"/>

        <!-- Main lush foreground field -->
        <rect x="0" y="1020" width="1080" height="450" fill="url(#field_grad)"/>
        <!-- Paddy crop texture lines -->
        <g stroke="#7CB342" stroke-width="4" stroke-linecap="round">
          <line x1="120" y1="1100" x2="140" y2="1060"/>
          <line x1="140" y1="1100" x2="140" y2="1055"/>
          <line x1="160" y1="1100" x2="140" y2="1060"/>

          <line x1="420" y1="1200" x2="440" y2="1150"/>
          <line x1="440" y1="1200" x2="440" y2="1145"/>
          <line x1="460" y1="1200" x2="440" y2="1150"/>

          <line x1="780" y1="1150" x2="800" y2="1110"/>
          <line x1="800" y1="1150" x2="800" y2="1105"/>
          <line x1="820" y1="1150" x2="800" y2="1110"/>
        </g>
      </g>

      <!-- Sandy Village Path (foreground where characters stand) -->
      <g id="field_path">
        <path d="M0 1420Q540 1380 1080 1440L1080 1920L0 1920Z" fill="#D7BE8A" stroke="#9A8256" stroke-width="4"/>
        <path d="M0 1480Q500 1450 1080 1510L1080 1920L0 1920Z" fill="#CBB07B"/>
      </g>
    </g>
  `;
}
