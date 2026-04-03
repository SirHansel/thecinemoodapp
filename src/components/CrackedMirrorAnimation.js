import React from 'react';

// themes: every crack is a line of force, the mirror remembers the impact
// visualization: An oval mirror with asymmetric cracks radiating from impact points —
// lines grow from background color to amber, the geometry of breaking

const CrackedMirrorAnimation = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    const cx = W / 2;
    const cy = H / 2;
    const rx = 85;
    const ry = 110;

    const impacts = [
      { x: cx - 20, y: cy - 30, time: 0 },
      { x: cx + 35, y: cy + 20, time: 0.3 },
    ];

    const cracks = [
      { ox: -20, oy: -30, angle: -0.3,  len: 0.55, branches: [{a: 0.5, l: 0.3}, {a: -0.4, l: 0.25}] },
      { ox: -20, oy: -30, angle: 1.2,   len: 0.65, branches: [{a: 0.6, l: 0.28}] },
      { ox: -20, oy: -30, angle: 2.4,   len: 0.50, branches: [{a: -0.5, l: 0.22}] },
      { ox: -20, oy: -30, angle: -1.8,  len: 0.45, branches: [] },
      { ox: -20, oy: -30, angle: 3.5,   len: 0.38, branches: [{a: 0.4, l: 0.18}] },
      { ox: -20, oy: -30, angle: -2.8,  len: 0.42, branches: [] },
      { ox: 35,  oy: 20,  angle: 0.8,   len: 0.48, branches: [{a: -0.5, l: 0.22}] },
      { ox: 35,  oy: 20,  angle: -1.2,  len: 0.55, branches: [{a: 0.6, l: 0.25}] },
      { ox: 35,  oy: 20,  angle: 2.1,   len: 0.40, branches: [] },
      { ox: 35,  oy: 20,  angle: -2.5,  len: 0.35, branches: [{a: -0.4, l: 0.15}] },
    ];

    function getCrackColor(progress, breathe) {
      // ── COLOR TRANSITION: background (#1a1a2e) → amber (200,170,100) ──
      // adjust target rgb values to change the final crack color
      const r = Math.round(26 + progress * (200 - 26));
      const g = Math.round(26 + progress * (170 - 26));
      const b = Math.round(46 + progress * (100 - 46));
      // ── CRACK OPACITY: 0.15 base + 0.7 at full progress ───────────────
      // increase 0.7 for more visible cracks at peak
      const a = 0.15 + progress * 0.7 + breathe * 0.1;
      // ──────────────────────────────────────────────────────────────────
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    function drawCrackLine(startX, startY, angle, length, progress, breathe, depth) {
      if (progress <= 0) return;
      const actualLen = length * Math.min(1, progress) * rx * 1.4;
      const endX = startX + Math.cos(angle) * actualLen;
      const endY = startY + Math.sin(angle) * actualLen;

      const pts = 12;
      ctx.beginPath();
      for (let i = 0; i <= pts; i++) {
        const p = i / pts;
        const x = startX + (endX - startX) * p + Math.sin(p * 5 + angle) * (2 - depth);
        const y = startY + (endY - startY) * p + Math.cos(p * 4 + angle) * (1.5 - depth * 0.5);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = getCrackColor(Math.min(1, progress *
