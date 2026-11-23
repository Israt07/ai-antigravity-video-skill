// Speech bubble engine for village2d style.
// Auto-sizes rounded speech bubble, formats text with bold font, and draws an attached tail pointing to speaker.

/**
 * Wrap text into lines based on approximate character width.
 */
function wrapText(text, maxCharsPerLine = 22) {
  const words = text.trim().split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Render speech bubble SVG.
 * @param {Object} opts
 * @param {string} opts.text - Text to display inside the bubble
 * @param {number} opts.speakerX - X coordinate of speaker mouth/head
 * @param {number} opts.speakerY - Y coordinate of speaker mouth/head
 * @param {number} [opts.x] - Optional center X of bubble (defaults to speakerX clamped to stage)
 * @param {number} [opts.y] - Optional top Y of bubble (defaults above speakerY)
 * @param {number} [opts.fontSize=42]
 * @param {number} [opts.maxChars=22]
 */
export function renderBubble({
  text = '',
  speakerX = 540,
  speakerY = 1200,
  x = null,
  y = null,
  fontSize = 44,
  lineHeight = 56,
  paddingX = 36,
  paddingY = 28,
  maxChars = 22,
  id = 'bubble'
} = {}) {
  if (!text) return '';

  const lines = wrapText(text, maxChars);
  const maxLineLen = Math.max(...lines.map(l => l.length), 8);

  // Calculate box dimensions
  // Bengali / Devanagari glyphs are wider than Latin; detect and adjust
  const isBengali = /[\u0980-\u09FF]/.test(text);
  const charWidth = fontSize * (isBengali ? 0.72 : 0.58);
  const bubbleWidth = Math.max(260, Math.min(880, Math.round(maxLineLen * charWidth + paddingX * 2)));
  const bubbleHeight = Math.round(lines.length * lineHeight + paddingY * 2);

  // Position bubble above speaker or at custom position
  let bx = x != null ? x - bubbleWidth / 2 : speakerX - bubbleWidth / 2;
  // Keep within safe stage margins [50, 1080 - 50 - bubbleWidth]
  bx = Math.max(60, Math.min(1080 - 60 - bubbleWidth, bx));

  let by = y != null ? y : speakerY - bubbleHeight - 110;
  by = Math.max(120, by);

  const cx = bx + bubbleWidth / 2;
  const cy = by + bubbleHeight / 2;

  // Tail geometry pointing toward (speakerX, speakerY)
  // Base of tail on the bottom edge of bubble
  const tailBaseX = Math.max(bx + 40, Math.min(bx + bubbleWidth - 40, speakerX));
  const tailWidth = 44;
  const t1x = tailBaseX - tailWidth / 2;
  const t1y = by + bubbleHeight;
  const t2x = tailBaseX + tailWidth / 2;
  const t2y = by + bubbleHeight;

  // Tip of tail reaches toward speaker head
  const tipX = speakerX + (speakerX > cx ? -10 : 10);
  const tipY = Math.min(by + bubbleHeight + 90, speakerY - 20);

  // SVG lines markup
  const textElements = lines.map((line, i) => {
    const textY = by + paddingY + (i + 1) * lineHeight - (lineHeight - fontSize) / 2 - 4;
    return `<tspan x="${cx}" y="${textY}" text-anchor="middle">${escapeXml(line)}</tspan>`;
  }).join('');

  return `
    <g id="${id}">
      <!-- Soft drop shadow -->
      <rect x="${bx + 4}" y="${by + 6}" width="${bubbleWidth}" height="${bubbleHeight}" rx="30" ry="30" fill="rgba(0,0,0,0.16)"/>
      <polygon points="${t1x + 3},${t1y + 4} ${tipX + 3},${tipY + 4} ${t2x + 3},${t2y + 4}" fill="rgba(0,0,0,0.16)"/>

      <!-- Bubble tail -->
      <polygon points="${t1x},${t1y - 2} ${tipX},${tipY} ${t2x},${t2y - 2}" fill="#FFFFFF" stroke="#221815" stroke-width="4.5" stroke-linejoin="round"/>

      <!-- Main rounded speech bubble box -->
      <rect x="${bx}" y="${by}" width="${bubbleWidth}" height="${bubbleHeight}" rx="30" ry="30" fill="#FFFFFF" stroke="#221815" stroke-width="4.5" stroke-linejoin="round"/>

      <!-- White seam cover between tail and box -->
      <line x1="${t1x + 2}" y1="${t1y}" x2="${t2x - 2}" y2="${t2y}" stroke="#FFFFFF" stroke-width="7"/>

      <!-- Dialogue text -->
      <text font-family="'Nirmala UI', 'Kalpurush', 'Inter', system-ui, -apple-system, sans-serif" font-weight="900" font-size="${fontSize}" fill="#1D1B18">
        ${textElements}
      </text>
    </g>
  `;
}

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}
