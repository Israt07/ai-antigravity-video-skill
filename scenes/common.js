// Shared visual helpers and characters for all scenes
import * as THREE from 'three';
import { ctx, clamp, lerp, seg, eo, eio, eob } from '../src/core/lib.js';
import { Toon } from '../src/core/toon.js';

export { ctx, clamp, lerp, seg, eo, eio, eob };
export const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
export const mix = (a, b, k) => a.clone().lerp(b, k);
export const talk = (t, on = 1) => (on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0);
export const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);

// Hand props
export const binocularsProp = (g, x, y) => {
  g.save();
  g.translate(x, y - 40);
  g.fillStyle = '#263238';
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 5;
  g.beginPath();
  g.roundRect(-24, -30, 20, 50, 6);
  g.roundRect(4, -30, 20, 50, 6);
  g.fill();
  g.stroke();
  g.fillRect(-6, -15, 12, 8);
  g.restore();
};

export const whiteFlagProp = (g, x, y) => {
  g.save();
  g.translate(x, y - 50);
  g.strokeStyle = '#5D4037';
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(0, 80);
  g.lineTo(0, -60);
  g.stroke();
  g.fillStyle = '#FFFFFF';
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(0, -60);
  g.lineTo(75, -45);
  g.lineTo(0, -30);
  g.closePath();
  g.fill();
  g.stroke();
  g.restore();
};

// 2D Cartoon Emu Drawing
export function drawEmu(g, x, y, scale = 1, mood = 'smug', phase = 0, hat = 'none') {
  g.save();
  g.translate(x, y);
  g.scale(scale, scale);
  g.lineCap = 'round';
  g.lineJoin = 'round';

  // Legs
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 12;
  const legSwing = Math.sin(phase) * 35;
  g.beginPath();
  g.moveTo(-15, 60);
  g.lineTo(-25 + legSwing, 140);
  g.lineTo(-40 + legSwing, 155);
  g.stroke();
  g.beginPath();
  g.moveTo(15, 60);
  g.lineTo(25 - legSwing, 140);
  g.lineTo(10 - legSwing, 155);
  g.stroke();

  // Fluffy oval body
  g.fillStyle = '#4A3728';
  g.beginPath();
  g.ellipse(0, 30, 85, 65, -0.1, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  // Feathers
  g.fillStyle = '#3E2723';
  for (let i = -50; i <= 50; i += 25) {
    g.beginPath();
    g.ellipse(i, 35, 18, 25, 0.2, 0, Math.PI * 2);
    g.fill();
  }

  // S-curved neck
  g.strokeStyle = '#5D4037';
  g.lineWidth = 26;
  g.beginPath();
  g.moveTo(40, 10);
  g.quadraticCurveTo(80, -70, 50, -140);
  g.stroke();
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 6;
  g.stroke();

  // Head
  g.fillStyle = '#4A3728';
  g.beginPath();
  g.ellipse(55, -145, 34, 26, 0.1, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  // Beak
  g.fillStyle = '#FFB300';
  g.beginPath();
  g.moveTo(85, -152);
  g.lineTo(130, -142);
  g.lineTo(85, -132);
  g.closePath();
  g.fill();
  g.stroke();

  // Cartoon Eyes
  g.fillStyle = '#FFFFFF';
  g.beginPath();
  g.arc(65, -155, 14, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  g.fillStyle = '#1F1C33';
  const pupilX = mood === 'smug' ? 70 : 65;
  g.beginPath();
  g.arc(pupilX, -155, 6, 0, Math.PI * 2);
  g.fill();

  // Eyebrow
  g.strokeStyle = '#1F1C33';
  g.lineWidth = 4;
  g.beginPath();
  g.arc(65, -172, 10, 0.2, 2.8);
  g.stroke();

  // Optional military beret
  if (hat === 'beret') {
    g.fillStyle = '#2E7D32';
    g.beginPath();
    g.ellipse(52, -170, 22, 10, -0.3, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    g.fillStyle = '#FFD700';
    g.beginPath();
    g.arc(42, -172, 4, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

// Cast definitions
export const LOOK = {
  major: { body: '#6D4C41', hat: 'cap', hatCol: '#3E2723', pattern: 'vest', patCol: '#271B14', neck: 'tie', neckCol: '#C62828', extra: ['mustache'] },
  soldier1: { body: '#8D7B68', hat: 'boater', hatCol: '#A79277', pattern: 'overalls', patCol: '#543310' },
  soldier2: { body: '#A79277', hat: 'cap', hatCol: '#543310', pattern: 'plain' },
  minister: { body: '#37474F', hat: 'tophat', hatCol: '#212121', neck: 'bowtie', neckCol: '#B71C1C', extra: ['monocle'] },
  farmer: { body: '#4E342E', hat: 'bowler', hatCol: '#3E2723', pattern: 'apron', patCol: '#FFF8E1' },
};

export const person = (k, opts) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, opts);
