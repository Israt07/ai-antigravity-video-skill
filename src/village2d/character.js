// Village 2D Character Engine – Ported from Character Studio
// Fully vector SVG characters with swappable traits, Bangladeshi outfits, and animations.

export const C = {
  red: '#e53935', blue: '#1e88e5', green: '#43a047', yellow: '#fdd835', purple: '#9a78bd',
  olive: '#6b7f2a', maroon: '#8e2b3a', magenta: '#c2185b', pink: '#f06292', orange: '#fb8c00',
  black: '#1b1b1b', white: '#f5f5f5', brown: '#6d4c41', blonde: '#f2c94c', gray: '#9e9e9e',
  grey: '#9e9e9e', teal: '#00897b', navy: '#1a237e', silver: '#cfd8dc', gold: '#fbc02d'
};

export const SK = {
  light: '#e0ac80', fair: '#e0ac80', medium: '#c68a5a', tan: '#c68a5a', brown: '#a8693f', dark: '#7a4a2a'
};

export const DEF = {
  skin: '#b57a4c', hair: '#1b1411', shirt: '#c94f4f', pants: '#2f6f8f', bg: '#e3ecd2',
  scene: 'village', age: 'adult', style: 'sleek', outfit: 'shirt', hat: 'none',
  expr: 'happy', build: 'normal', glasses: false, beard: false, mustache: false,
  bindi: false, gamchha: false, kolshi: false, toon: true, sandals: true,
  nosepin: false, phone: false, longbeard: false, necklace: false, earring: false,
  sleeping: false, sitting: false, mat: false, blouse: '#e6b422', baby: false,
  x: 0, y: 0, scale: 1
};

export const dk = (h, a) => {
  const n = parseInt(h.replace('#', ''), 16);
  return '#' + [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round(v * (1 - a)).toString(16).padStart(2, '0')).join('');
};

/**
 * Render character SVG markup.
 * All internal IDs, clipPaths, and patterns are prefixed with `inst` so multiple characters can coexist.
 */
export function renderCharacter(customState = {}, inst = 'c1') {
  const s = { ...DEF, ...customState };
  const tw = { slim: 60, normal: 72, chunky: 92 }[s.build] || 72;
  const hw = tw / 2;
  const sk = s.skin;
  const skd = dk(sk, 0.15);
  const sh = s.shirt;
  const shd = dk(sh, 0.2);
  const pn = s.pants;
  const el = s.age === 'elder';
  const hr = el ? '#dcdcdc' : s.hair;
  const hrd = dk(hr, 0.25);
  const ou = s.outfit;
  const lx = 14;

  const isMat = s.mat && !s.sleeping;
  const isSit = s.sitting && !s.sleeping && !s.mat;
  const still = isSit || isMat;

  const ph = ou === 'shirt' ? (s.age === 'child' ? 72 : 124) : ou === 'kameez' ? 124 : 0;
  const chkId = `${inst}_chk`;
  const scId = `${inst}_sc`;
  const chkPattern = `<pattern id="${chkId}" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M0 0H14M0 0V14" stroke="rgba(255,255,255,.35)" stroke-width="3"/></pattern>`;

  const bigP = s.hat === 'pallu' && ou === 'saree';
  const K = s.toon ? 1.28 : 1;
  const YY = y => 205 + (y - 205) * K;
  const kk = bigP ? 0.8 : K;
  const hh = y => 205 + (y - 205) * kk;
  const bw = 40 * kk + 8;
  const BH = s.style === 'waist-length'
    ? `<path d="M${200 - bw} ${hh(150)}C${200 - bw - 4} ${hh(100)} ${200 - bw * 0.6} ${hh(92)} 200 ${hh(92)}C${200 + bw * 0.6} ${hh(92)} ${200 + bw + 4} ${hh(100)} ${200 + bw} ${hh(150)}C${200 + bw + 6} 230 ${200 + bw + 8} 300 ${200 + bw - 2} 340Q200 354 ${200 - bw + 2} 340C${200 - bw - 8} 300 ${200 - bw - 6} 230 ${200 - bw} ${hh(150)}Z" fill="${hr}"/>`
    : '';

  const RT = `<g transform="translate(200 226) scale(.72) translate(-340 -232)">`;
  const FD = dk(sh, 0.25);

  const REFLOW = `${RT}<path d="M306 298L374 298C384 390 400 470 418 536L262 536C280 470 296 400 306 298Z" fill="${sh}" stroke="#3B2A20" stroke-width="2.5" stroke-linejoin="round"/><path d="M298 340L280 520M382 340L400 520M330 330L322 530M352 330L360 530" fill="none" stroke="${FD}" stroke-width="2" opacity=".7" class="nl"/><path d="M296 150C298 178 306 198 316 215L324 246L386 246L384 150Z" fill="${sh}" class="nl"/><path d="M330 214C328 228 328 238 330 246M352 212C354 226 356 238 356 246M372 190C374 210 376 228 376 246" fill="none" stroke="${FD}" stroke-width="1.6" opacity=".6" class="nl"/><rect x="330" y="184" width="20" height="54" rx="8" fill="${skd}" stroke="#3B2A20" stroke-width="2.5"/><ellipse cx="340" cy="238" rx="14" ry="9" fill="${sk}" class="nl"/><path d="M304 232C314 226 324 224 330 224C336 240 344 240 350 224C356 224 366 226 376 232C380 260 380 280 376 298L304 298C300 280 300 260 304 232Z" fill="${s.blouse}" stroke="#3B2A20" stroke-width="2.5" stroke-linejoin="round"/></g>`;

  const REFPALLU = `${RT}<path fill-rule="evenodd" fill="${sh}" stroke="#3B2A20" stroke-width="2.5" stroke-linejoin="miter" stroke-miterlimit="6" d="M340 54C374 54 400 90 394 150C392 175 396 200 400 230C404 270 406 310 402 360C400 400 398 430 396 452C365 420 330 380 296 340C280 300 262 270 268 240C272 225 282 212 286 200C290 188 292 175 288 160C282 100 306 54 340 54ZM382 150C384 104 364 80 340 78C316 80 296 104 298 150C300 175 306 195 316 215C338 224 362 234 380 250C382 230 380 205 384 185C385 170 382 160 382 150Z"/><path d="M290 252C304 296 334 340 366 392M316 236C332 282 358 330 384 380M278 262C286 296 306 330 326 362M300 232C306 262 322 300 346 336M394 170C396 210 400 250 400 300C400 340 398 390 394 430" fill="none" stroke="${FD}" stroke-width="1.6" opacity=".6" class="nl"/></g>`;

  let o = `<defs>${chkPattern}</defs>`;
  o += `<ellipse id="${inst}_shadow" cx="200" cy="472" rx="60" ry="9" fill="rgba(0,0,0,.18)"/>`;
  o += `<g id="${inst}_all">`;
  if (still) {
    o += `<clipPath id="${scId}"><rect x="0" y="0" width="400" height="${isMat ? 404 : 408}"/></clipPath><g clip-path="url(#${scId})">`;
  }

  const sleepingTr = `translate(200 ${s.age === 'child' ? 319 : 307}) rotate(-90) scale(${s.age === 'child' ? 0.5 : 0.6}) translate(-200 -268)`;
  const normalTr = `${isSit ? `translate(0 ${s.age === 'child' ? 54 : 78}) ` : isMat ? `translate(0 ${s.age === 'child' ? 55 : 80}) ` : ''}translate(200 460) scale(${s.age === 'child' ? 0.82 : 1}) translate(-200 -460)`;
  o += `<g transform="${s.sleeping ? sleepingTr : normalTr}">${BH}`;

  // Legs
  [-1, 1].forEach((d, i) => {
    const x = 200 + d * lx;
    o += `<g id="${inst}_leg${i}" data-px="${x}" data-py="325">`;
    o += `<rect x="${x - 11}" y="320" width="22" height="130" rx="10" fill="${sk}"/>`;
    if (ph) o += `<rect x="${x - 12}" y="318" width="24" height="${ph}" rx="10" fill="${pn}"/>`;
    if (s.sandals) o += `<ellipse cx="${x + d * 2}" cy="458" rx="19" ry="6" fill="#6b4a2f"/>`;
    o += `<ellipse cx="${x + d * 2}" cy="452" rx="17" ry="8" fill="${skd}"/>`;
    if (s.sandals) o += `<path d="M${x + d * 2 - 13} 453Q${x + d * 2} 441 ${x + d * 2 + 13} 453" stroke="#3b2616" stroke-width="4" fill="none" class="nl"/>`;
    o += `</g>`;
  });

  // Lower garments
  const lg = `M${200 - hw - 2} 316H${200 + hw + 2}L${200 + hw + 12} 428H${200 - hw - 12}Z`;
  if (ou === 'lungi' || ou === 'fatua') {
    o += `<path d="${lg}" fill="${pn}"/><path d="${lg}" fill="url(#${chkId})"/>`;
  }
  if (ou === 'saree' && !bigP) {
    o += `<path d="M${200 - hw} 262H${200 + hw}L${200 + hw + 26} 446H${200 - hw - 26}Z" fill="${sh}"/><path d="M190 330V436M200 330V436M210 330V436" stroke="${dk(sh, 0.25)}" stroke-width="2" opacity=".6" class="nl"/>`;
  }
  if (bigP) o += REFLOW;
  if (!bigP) o += `<rect x="190" y="190" width="20" height="36" fill="${skd}"/>`;

  if (ou === 'saree' && !bigP) {
    o += `<rect x="${200 - hw}" y="226" width="${tw}" height="70" rx="14" fill="${s.blouse}"/>`;
    o += `<path d="M${200 + hw + 2} 226H${200 + hw - 26}L${200 - hw + 2} 346H${200 - hw + 30}Z" fill="${sh}"/>`;
  } else if (bigP) {
    // handled in reflow
  } else if (ou === 'kameez') {
    o += `<path d="M${200 - hw} 226h${tw}L${200 + hw + 8} 366H${200 - hw - 8}Z" fill="${sh}"/><path d="M${200 - hw + 2} 230L${200 + hw - 2} 304L${200 + hw + 4} 292L${200 - hw + 10} 224Z" fill="${pn}" opacity=".9"/><path d="M${200 - hw} 228q-9 60-5 120h13q-3-60 6-120Z" fill="${pn}"/>`;
  } else if (ou === 'fatua') {
    o += `<path d="M${200 - hw} 226h${tw}L${200 + hw + 6} 350H${200 - hw - 6}Z" fill="${sh}"/><path d="M200 232V300" stroke="${shd}" stroke-width="2"/>`;
  } else {
    o += `<rect x="${200 - hw}" y="226" width="${tw}" height="100" rx="14" fill="${sh}"/><path d="M200 232V320" stroke="${shd}" stroke-width="2"/>`;
  }

  if (!bigP) o += `<path d="M190 226L200 242L210 226Z" fill="${skd}"/>`;
  if (s.necklace) o += `<path d="M189 214Q200 232 211 214" fill="none" stroke="#e0b030" stroke-width="2.5" stroke-linecap="round" class="nl"/><circle cx="200" cy="225" r="3.6" fill="#e0b030" stroke="#8a6a10" stroke-width="1" class="nl"/>`;

  // Arms
  const SL = { shirt: 42, kameez: 84, fatua: 84, lungi: 42, saree: 34 }[ou] || 42;
  let AR = '';
  [-1, 1].forEach((d, i) => {
    const x = 200 + d * (hw - 3);
    AR += `<g id="${inst}_arm${i}" data-px="${x}" data-py="232"><rect x="${x - 8}" y="228" width="16" height="92" rx="8" fill="${sk}"/><rect x="${x - 9}" y="226" width="18" height="${SL}" rx="9" fill="${ou === 'saree' ? s.blouse : sh}"/>`;
    if (i === 0 && s.phone) {
      AR += `<g><rect x="${x - 9}" y="306" width="18" height="32" rx="4" fill="#222"/><rect x="${x - 7}" y="309" width="14" height="25" rx="2" fill="#8fd3ff" class="nl"/></g>`;
    }
    AR += `<circle cx="${x}" cy="322" r="9" fill="${sk}"/>`;
    if (i === 1 && s.kolshi) {
      AR += `<g><ellipse cx="${x + 4}" cy="336" rx="15" ry="13" fill="#c9972b"/><rect x="${x - 6}" y="318" width="20" height="10" rx="3" fill="#b8841f"/><ellipse cx="${x + 4}" cy="318" rx="11" ry="3" fill="#e0b445"/><path d="M${x - 6} 332q6-6 12-3" stroke="#f0d27a" stroke-width="2" fill="none"/></g>`;
    }
    AR += `</g>`;
  });

  if (bigP) {
    AR = '';
    [0, 1].forEach(i => {
      const d = i ? 1 : -1, a = i ? 378 : 302, b = i ? 381 : 299, c1 = i ? 386 : 294, c2 = i ? 388 : 292, ex = i ? 391 : 289, hx = 200 + d * 36.7, px = 200 + (a - 340) * 0.72;
      AR += `<g id="${inst}_arm${i}" data-px="${px}" data-py="230.3">${RT}<path d="M${a} 238L${b} 264" fill="none" stroke="#3B2A20" stroke-width="27" stroke-linecap="round" class="nl"/><path d="M${a} 238L${b} 264" fill="none" stroke="${s.blouse}" stroke-width="22" stroke-linecap="round" class="nl"/><path d="M${b} 268C${c1} 296 ${c2} 322 ${ex} 346" fill="none" stroke="#3B2A20" stroke-width="20" stroke-linecap="round" class="nl"/><path d="M${b} 268C${c1} 296 ${c2} 322 ${ex} 346" fill="none" stroke="${sk}" stroke-width="15" stroke-linecap="round" class="nl"/><ellipse cx="${ex}" cy="357" rx="9" ry="12" fill="${sk}" stroke="#3B2A20" stroke-width="2.2" class="nl"/><path d="M${ex - 3} 352V364M${ex + 2} 351V365M${ex + 6} 353V363" stroke="#A8774F" stroke-width="1" fill="none" class="nl"/></g>`;
      if (i === 0 && s.phone) {
        AR += `<g><rect x="${hx - 9}" y="306" width="18" height="32" rx="4" fill="#222"/><rect x="${hx - 7}" y="309" width="14" height="25" rx="2" fill="#8fd3ff" class="nl"/></g>`;
      }
      if (i === 1 && s.kolshi) {
        AR += `<g><ellipse cx="${hx + 4}" cy="336" rx="15" ry="13" fill="#c9972b"/><rect x="${hx - 6}" y="318" width="20" height="10" rx="3" fill="#b8841f"/><ellipse cx="${hx + 4}" cy="318" rx="11" ry="3" fill="#e0b445"/></g>`;
      }
      AR += `</g>`;
    });
  }

  if (!bigP) o += AR;
  if (s.gamchha) {
    const g = `M${200 + hw - 20} 224q24 4 26 36l-4 72h-18l2-68q0-24-14-28Z`;
    o += `<path d="${g}" fill="#c0392b"/><path d="${g}" fill="url(#${chkId})"/>`;
  }

  // Head - Bigger, rounder head (~130% of previous size relative to body), clean flat skin tone with thin outline
  const headSc = bigP ? 1.04 : (s.toon ? 1.66 : 1.30);
  o += `<g id="${inst}_head" data-px="200" data-py="205" data-sc="${headSc}"${bigP ? ' data-nr="1"' : ''} transform="translate(200 205) scale(${headSc}) translate(-200 -205)">`;
  if (s.style === 'bob') o += `<path d="M156 148C160 106 240 106 244 148C230 124 170 124 156 148Z" fill="${hr}" stroke="#2B1B1B" stroke-width="1.8" class="nl"/><path d="M154 144C158 100 242 100 246 144" fill="none" stroke="${pn}" stroke-width="8" stroke-linecap="round" class="nl"/>`;
  if (s.style === 'braids') [-1, 1].forEach(d => o += `<path d="M${200 + d * 38} 156q${d * 14} 30 ${d * 6} 60q${-d * 4} 25 ${d * 4} 50" stroke="${hr}" stroke-width="13" stroke-linecap="round" fill="none" class="nl"/><circle cx="${200 + d * (38 + 6)}" cy="270" r="6" fill="#d33" class="nl"/>`);
  if (s.style === 'ponytail') o += `<path d="M236 118C290 110 300 180 270 232C270 190 258 160 236 146Z" fill="${hr}" stroke="#2B1B1B" stroke-width="1.8" class="nl"/>`;

  // Ears & Rounder Head with flat skin tone and thin outline
  o += `<circle cx="155" cy="150" r="7.5" fill="${sk}" stroke="#2B1B1B" stroke-width="1.8" class="nl"/><circle cx="245" cy="150" r="7.5" fill="${sk}" stroke="#2B1B1B" stroke-width="1.8" class="nl"/>`;
  const headPath = `M156 148C156 106 175 96 200 96S244 106 244 148C244 178 228 198 200 198S156 178 156 148Z`;
  o += `<path d="${headPath}" fill="${sk}" stroke="#2B1B1B" stroke-width="1.8" stroke-linejoin="round" class="nl"/>`;

  if (s.earring) o += `<g>${[155, 245].map(x => `<circle cx="${x}" cy="160" r="3" fill="#f2c94c" stroke="#8a6a10" stroke-width="1" class="nl"/><ellipse cx="${x}" cy="166" rx="2.5" ry="3.5" fill="#f2c94c" stroke="#8a6a10" stroke-width="1" class="nl"/>`).join('')}</g>`;

  // Hair styles adapted to rounder head
  const F = `M156 148C152 104 176 92 200 92S248 104 244 148C236 126 224 114 200 114S164 126 156 148Z`;
  if (['short', 'braids', 'ponytail', 'bun'].includes(s.style)) o += `<path d="${F}" fill="${hr}" stroke="#2B1B1B" stroke-width="1.8" stroke-linejoin="round" class="nl"/>`;
  if (s.style === 'bun') o += `<circle cx="200" cy="86" r="17" fill="${hr}" stroke="#2B1B1B" stroke-width="1.8" class="nl"/>`;
  if (s.style === 'sleek' || s.style === 'waist-length') o += `<path d="M156 152C148 96 180 88 200 88S252 96 244 152C242 128 224 108 200 106C176 108 158 128 156 152Z" fill="${hr}" stroke="#2B1B1B" stroke-width="1.8" stroke-linejoin="round" class="nl"/><path d="M200 90V106" stroke="${hrd}" stroke-width="2" class="nl"/>`;

  // No cheek shading: removed cheek blush circles
  if (s.bindi) o += `<circle cx="200" cy="132" r="3.5" fill="#c62828" class="nl"/>`;

  // Simple oval eyes with small black pupil, no eyelash or eye detail
  const E = { happy: [0, -2], neutral: [0, 0], sad: [-14, 0], crying: [-16, 1], angry: [14, 3], surprised: [0, -6] }[s.expr] || [0, 0];
  [186, 214].forEach(x => {
    o += s.sleeping
      ? `<g class="${inst}_eye"><path d="M${x - 6} 152Q${x} 157 ${x + 6} 152" stroke="#2B1B1B" stroke-width="2" fill="none" stroke-linecap="round" class="nl"/></g>`
      : `<g class="${inst}_eye">` +
          `<ellipse cx="${x}" cy="152" rx="6.5" ry="8.5" fill="#FFFFFF" stroke="#2B1B1B" stroke-width="1.8" class="nl"/>` +
          `<ellipse cx="${x}" cy="152" rx="2.4" ry="3.2" fill="#1A110D" class="nl"/>` +
        `</g>`;
  });

  // Eyebrows
  o += `<line x1="177" y1="137" x2="194" y2="137" stroke="${hrd}" stroke-width="3" stroke-linecap="round" transform="translate(0 ${E[1]}) rotate(${E[0]} 185 137)" class="nl"/><line x1="206" y1="137" x2="223" y2="137" stroke="${hrd}" stroke-width="3" stroke-linecap="round" transform="translate(0 ${E[1]}) rotate(${-E[0]} 215 137)" class="nl"/>`;

  // Simplified nose to tiny curved line, flat skin tone
  o += `<path d="M198 163Q202 165.5 199 168" stroke="#2B1B1B" stroke-width="1.8" fill="none" stroke-linecap="round" class="nl"/>`;
  if (s.nosepin) o += `<circle cx="194" cy="166" r="2" fill="#f2c94c" class="nl"/>`;

  if (s.longbeard) o += `<path d="M158 156C156 212 180 242 200 252C220 242 244 212 242 156C232 190 218 196 200 196S168 190 158 156Z" fill="${hr}" stroke="#2B1B1B" stroke-width="1.8" class="nl"/>`;
  else if (s.beard) o += `<path d="M158 158C158 214 242 214 242 158C232 188 218 194 200 194S168 188 158 158Z" fill="${hr}" stroke="#2B1B1B" stroke-width="1.8" class="nl"/>`;
  if (s.mustache) o += `<path d="M178 172Q200 164 222 172Q212 181 200 174Q188 181 178 172Z" fill="${hr}" stroke="#2B1B1B" stroke-width="1.5" class="nl"/>`;

  // Mouth flap (animated procedurally via scaleY)
  const M = {
    happy: `<path d="M191 177Q200 189 209 177Z" fill="#6B2A2A" stroke="#2B1B1B" stroke-width="1.8" stroke-linejoin="round" class="nl"/>`,
    neutral: `<path d="M192 178H208" stroke="#2B1B1B" stroke-width="2.5" stroke-linecap="round" class="nl"/>`,
    sad: `<path d="M191 183Q200 175 209 183" stroke="#2B1B1B" stroke-width="2.5" fill="none" stroke-linecap="round" class="nl"/>`,
    angry: `<path d="M191 183Q200 177 209 181" stroke="#2B1B1B" stroke-width="2.5" fill="none" stroke-linecap="round" class="nl"/>`,
    surprised: `<ellipse cx="200" cy="180" rx="4.5" ry="6.5" fill="#6B2A2A" stroke="#2B1B1B" stroke-width="1.8" class="nl"/>`,
    crying: `<path d="M190 185Q200 174 210 185Z" fill="#6B2A2A" stroke="#2B1B1B" stroke-width="1.8" stroke-linejoin="round" class="nl"/>`
  };
  o += `<g id="${inst}_mouth">${M[s.expr] || M.neutral}</g>`;

  if (s.expr === 'crying') o += `<path d="M186 160q-4 14-1 26M214 160q4 14 1 26" stroke="#7cc7f0" stroke-width="3" fill="none" stroke-linecap="round" class="nl"/><ellipse cx="184" cy="190" rx="3" ry="4.5" fill="#7cc7f0" class="nl"/><ellipse cx="216" cy="190" rx="3" ry="4.5" fill="#7cc7f0" class="nl"/>`;
  if (s.glasses) o += `<g fill="rgba(180,220,255,.18)" stroke="#222" stroke-width="2"><circle cx="186" cy="152" r="12" class="nl"/><circle cx="214" cy="152" r="12" class="nl"/><path d="M198 152h4M174 150l-12-3M226 150l12-3" fill="none" class="nl"/></g>`;
  if (el) o += `<path d="M192 124h16M190 129h20" stroke="#2B1B1B" stroke-width="1.5" fill="none" stroke-linecap="round" class="nl"/>`;

  if (s.hat === 'pallu' && !bigP) o += `<path d="M144 190C134 88 174 72 200 72S266 88 256 190L246 188C246 148 234 110 200 108C166 110 154 148 154 188Z" fill="${sh}" stroke="#2B1B1B" stroke-width="1.8" stroke-linejoin="round" class="nl"/>`;
  if (s.hat === 'topi') o += `<path d="M160 120C160 92 240 92 240 120Q200 130 160 120Z" fill="#f4f1ea" stroke="#2B1B1B" stroke-width="1.8" class="nl"/><path d="M168 110Q200 102 232 110" stroke="#cfc9bb" stroke-width="1.8" fill="none" class="nl"/>`;
  if (s.hat === 'tokai') o += `<path d="M136 120L200 66L264 120Q200 134 136 120Z" fill="#d9b25f" stroke="#2B1B1B" stroke-width="1.8" class="nl"/><path d="M158 108L242 108M170 94L230 94" stroke="#a9842f" stroke-width="1.8" class="nl"/>`;
  if (s.hat === 'gamchha') {
    const g = `M154 124C156 88 244 88 246 124Q200 112 154 124Z`;
    o += `<path d="${g}" fill="#c0392b" stroke="#2B1B1B" stroke-width="1.8" class="nl"/><path d="${g}" fill="url(#${chkId})" class="nl"/>`;
  }

  let P = '';
  if (bigP) P = REFPALLU;

  const cl = ou === 'saree' ? sh : pn;
  const cl2 = ou === 'saree' ? sh : pn;
  const SIT = isSit ? `<g transform="translate(0 16)">${(() => {
    const long = ou === 'kameez' || (ou === 'shirt' && s.age !== 'child'), dr = ou === 'saree' || ou === 'lungi' || ou === 'fatua', shorts = ou === 'shirt' && s.age === 'child', sx = ou === 'saree' ? 438 : 424;
    let r = '';
    [-1, 1].forEach(d => {
      const kx = 200 + d * 22, ax = kx;
      if (dr) { r += `<rect x="${kx - 11}" y="410" width="22" height="30" rx="8" fill="${sk}"/>`; }
      else r += `<rect x="${kx - 14}" y="${shorts ? 366 : 384}" width="28" height="${shorts ? 76 : 58}" rx="14" fill="${long ? pn : sk}"/>`;
      r += `<ellipse cx="${ax + d * 3}" cy="445" rx="16" ry="9" fill="${skd}"/>${s.sandals ? `<ellipse cx="${ax + d * 3}" cy="451" rx="20" ry="5" fill="#6b4a2f"/>` : ''}`;
    });
    if (dr) { r += `<path d="M${200 - hw - 4} 384H${200 + hw + 4}L${200 + hw + 20} 414L${200 + hw + 22} ${sx}H${200 - hw - 22}L${200 - hw - 20} 414Z" fill="${cl2}"/>`; }
    else if (shorts) [-1, 1].forEach(d => { r += `<rect x="${200 + d * 22 - 15}" y="366" width="30" height="48" rx="12" fill="${pn}"/>`; });
    return r;
  })()}</g>` : '';

  const MAT = isMat ? `<g><ellipse cx="200" cy="428" rx="${hw + 48}" ry="26" fill="${cl}"/><ellipse cx="${200 - hw - 36}" cy="434" rx="22" ry="17" fill="${dk(cl, 0.15)}"/><ellipse cx="${200 + hw + 36}" cy="434" rx="22" ry="17" fill="${dk(cl, 0.15)}"/><ellipse cx="184" cy="448" rx="20" ry="8" fill="${skd}"/><ellipse cx="216" cy="448" rx="20" ry="8" fill="${skd}"/></g>` : '';
  const BL = s.sleeping ? `<g><path d="M214 338Q226 298 250 300Q290 296 322 306L324 346H214Z" fill="#d9694f"/><path d="M214 338Q226 298 250 300Q290 296 322 306" fill="none" stroke="#b04a35" stroke-width="3" class="nl"/><path d="M262 304V344M296 304V344" stroke="#b04a35" stroke-width="2" opacity=".6" class="nl"/></g>` : '';

  // Baby in arms if baby: true
  let BABY = '';
  if (s.baby || s.holdingBaby) {
    BABY = `
      <g id="${inst}_baby" transform="translate(195 285) rotate(-15)">
        <!-- Swaddling blanket / Kantha bundle -->
        <ellipse cx="0" cy="8" rx="34" ry="20" fill="#E57373" stroke="#2B1B1B" stroke-width="2.5"/>
        <path d="M-22 0Q0 14 22 2" stroke="#B71C1C" stroke-width="2.5" fill="none" class="nl"/>
        <path d="M-18 10Q0 22 18 12" stroke="#B71C1C" stroke-width="2" fill="none" class="nl"/>
        <!-- Baby Head -->
        <circle cx="-16" cy="-4" r="14" fill="${s.skin || '#c68a5a'}" stroke="#2B1B1B" stroke-width="2.5"/>
        <!-- Baby closed sleeping eyes & face -->
        <path d="M-22 -4q3 3 6 0" stroke="#2B1B1B" stroke-width="1.8" fill="none" stroke-linecap="round" class="nl"/>
        <circle cx="-16" cy="2" r="1.5" fill="#D32F2F" class="nl"/>
        <!-- Baby cap / tuft of hair -->
        <path d="M-28 -8C-28 -18 -10 -20 -4 -8Z" fill="#FFE082" stroke="#2B1B1B" stroke-width="2"/>
        <!-- Tender hand resting on baby -->
        <ellipse cx="14" cy="4" rx="10" ry="7" fill="${skd}" stroke="#2B1B1B" stroke-width="2"/>
      </g>
    `;
  }

  o += `</g>`; // close head
  if (bigP) o += P + AR;
  o += `</g>`; // close inner
  if (still) o += `</g>`;
  o += SIT + MAT + BL + BABY + `</g>`; // close all

  // Outer wrapper for position and scale
  const transform = `translate(${s.x ?? 0} ${s.y ?? 0}) scale(${s.scale ?? 1})`;
  const olClass = s.toon ? 'ol' : '';
  return `<g id="${inst}" class="${olClass}" transform="${transform}">${o}</g>`;
}

/**
 * Animate character elements in a DOM context.
 * Supports 'talk-still' (body still, mouth flap, subtle head tilt).
 */
export function animate(inst, t, anim = 'idle', root = null) {
  const doc = root || (typeof document !== 'undefined' ? document : null);
  if (!doc) return;

  const q = id => doc.getElementById(`${inst}_${id}`);
  const rot = (el, a) => {
    if (el) {
      const x = el.dataset.px, y = el.dataset.py, c = el.dataset.sc;
      el.setAttribute('transform', `rotate(${a} ${x} ${y})` + (c ? ` translate(${x} ${y}) scale(${c}) translate(-${x} -${y})` : ''));
    }
  };

  let bob = Math.sin(t * 2) * 2;
  let sway = 0;
  let lA = 4 + Math.sin(t * 2) * 3;
  let rA = -lA;
  let lL = 0, rL = 0, jump = 0, m = 1, sh = 1;
  let headTilt = 0;

  if (anim === 'wave') {
    rA = -150 + Math.sin(t * 9) * 18;
  } else if (anim === 'walk') {
    const p = Math.sin(t * 6);
    lL = p * 26; rL = -p * 26;
    lA = -p * 30 + 4; rA = -p * 30 - 4;
    bob = -Math.abs(Math.cos(t * 6)) * 5;
  } else if (anim === 'dance') {
    const p = Math.sin(t * 5);
    bob = -Math.abs(p) * 10;
    sway = p * 6;
    lA = 130 + Math.sin(t * 10) * 25;
    rA = -130 - Math.cos(t * 10) * 25;
    lL = p * 14; rL = -p * 14;
  } else if (anim === 'jump') {
    const j = Math.abs(Math.sin(t * 3));
    jump = -j * 70;
    lA = 140 * j; rA = -140 * j;
    lL = j * 15; rL = -j * 15;
    sh = 1 - j * 0.4;
  } else if (anim === 'talk') {
    rA = -35 + Math.sin(t * 3) * 15;
    m = 0.3 + Math.abs(Math.sin(t * 9)) * 0.9;
    headTilt = Math.sin(t * 3) * 2;
  } else if (anim === 'talk-still') {
    // Body remains completely still, only mouth flaps and subtle head movement
    bob = 0;
    sway = 0;
    lA = 0;
    rA = 0;
    lL = 0;
    rL = 0;
    jump = 0;
    sh = 1;
    m = 0.25 + Math.abs(Math.sin(t * 10)) * 0.95;
    headTilt = Math.sin(t * 3) * 1.5;
  }

  // Blinking (blink every ~3.5 seconds)
  const k = (t % 3.5) < 0.15 ? 0.1 : 1;

  const all = q('all');
  if (all) {
    all.setAttribute('transform', `translate(0 ${bob + jump}) rotate(${sway} 200 460)`);
  }

  rot(q('arm0'), lA);
  rot(q('arm1'), rA);
  rot(q('leg0'), lL);
  rot(q('leg1'), rL);

  const head = q('head');
  if (head) {
    const nr = head.dataset.nr;
    const baseRot = nr ? 0 : Math.sin(t * 2) * 2 + sway * 0.5;
    rot(head, baseRot + headTilt);
  }

  const eyes = doc.querySelectorAll(`.${inst}_eye`);
  eyes.forEach(e => e.setAttribute('transform', `translate(0 152) scale(1 ${k}) translate(0 -152)`));

  const mouth = q('mouth');
  if (mouth) {
    mouth.setAttribute('transform', `translate(200 178) scale(1 ${m}) translate(-200 -178)`);
  }

  const shadow = q('shadow');
  if (shadow) {
    shadow.setAttribute('rx', 60 * sh);
  }
}
