// Scene Renderer for Village 2D Style
// Assembles background, animated vector characters, directional speech bubbles,
// and filmic post-processing (slight film grain, vignette, cross-dissolve).

import { renderCharacter, animate } from './character.js';
import { getBackground } from './backgrounds/index.js';
import { renderBubble } from './bubble.js';

export { renderCharacter, animate, getBackground, renderBubble };

/**
 * Builds the complete SVG DOM string for a village2d scene at time t.
 */
export function buildSceneSVG({
  background = 'house',
  characters = [],
  dialogue = null,
  t = 0,
  duration = 3.5,
  grain = true,
  vignette = true,
  dissolveDuration = 0.18
}) {
  const bgRenderer = getBackground(background);
  const bgMarkup = bgRenderer();

  // Render character SVGs
  const charMarkup = characters.map(c => renderCharacter(c, c.id)).join('\n');

  // Dialogue bubble markup
  let bubbleMarkup = '';
  if (dialogue && dialogue.text) {
    const dStart = dialogue.start ?? 0.2;
    const dEnd = dialogue.end ?? (duration - 0.2);
    if (t >= dStart && t <= dEnd) {
      bubbleMarkup = renderBubble({
        text: dialogue.text,
        speakerX: dialogue.speakerX ?? 540,
        speakerY: dialogue.speakerY ?? 1050,
        x: dialogue.x,
        y: dialogue.y,
        fontSize: dialogue.fontSize || 42
      });
    }
  }

  // Cross-dissolve opacity: quick fade in at start, fade out at end
  let opacity = 1.0;
  if (dissolveDuration > 0) {
    if (t < dissolveDuration) {
      opacity = Math.max(0, t / dissolveDuration);
    } else if (t > duration - dissolveDuration) {
      opacity = Math.max(0, (duration - t) / dissolveDuration);
    }
  }

  return `
    <svg id="stage" viewBox="0 0 1080 1920" width="1080" height="1920" xmlns="http://www.w3.org/2000/svg" style="background:#F4EFE6;">
      <defs>
        <!-- Subtle Film Grain Filter (gentle organic texture) -->
        <filter id="village_grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.035 0" result="coloredNoise"/>
          <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise"/>
        </filter>

        <!-- Very Light Filmic Vignette (25% strength, warm edge framing, no top grey tint) -->
        <radialGradient id="vignette_grad" cx="50%" cy="54%" r="70%">
          <stop offset="72%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="92%" stop-color="#24150B" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#1A0D06" stop-opacity="0.15"/>
        </radialGradient>
      </defs>

      <!-- Main Scene Content with Cross-Dissolve Fade -->
      <g id="scene_content" opacity="${opacity.toFixed(3)}" ${grain ? 'filter="url(#village_grain)"' : ''}>
        <!-- 1. Background -->
        ${bgMarkup}

        <!-- 2. Characters -->
        <g id="characters_layer">
          ${charMarkup}
        </g>

        <!-- 3. Dialogue Speech Bubble -->
        <g id="dialogue_layer">
          ${bubbleMarkup}
        </g>
      </g>

      <!-- 4. Post-processing Light Warm Vignette -->
      ${vignette ? '<rect x="0" y="0" width="1080" height="1920" fill="url(#vignette_grad)" pointer-events="none"/>' : ''}
    </svg>
  `;
}
