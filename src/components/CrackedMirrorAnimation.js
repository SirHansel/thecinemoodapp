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
      ctx.strokeStyle = getCrackColor(Math.min(1, progress * 0.8 + breathe * 0.2), breathe);
      // ── CRACK LINE WEIGHT: 0.6 base + 0.5 for primary cracks ──────────
      // increase for bolder crack lines
      ctx.lineWidth = 0.6 + (1 - depth * 0.3) * 0.5;
      // ──────────────────────────────────────────────────────────────────
      ctx.stroke();
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // ── SPEED CONTROL ─────────────────────────────────────────────────
      t += 0.004; // base animation speed
      // ──────────────────────────────────────────────────────────────────

      const breathe = Math.sin(t * 0.4) * 0.5 + 0.5;

      // ── CRACK CYCLE LENGTH: 400 frames ────────────────────────────────
      // increase cycleLen = slower crack growth cycle
      // 0.6 = cracks grow for 60% of cycle, hold, then fade in last 15%
      const cycleLen = 400;
      const cycleT = (t * 60) % cycleLen;
      const growProgress = Math.min(1, cycleT / (cycleLen * 0.6));
      const fadeProgress = cycleT > cycleLen * 0.85 ? 1 - (cycleT - cycleLen * 0.85) / (cycleLen * 0.15) : 1;
      const crackProgress = growProgress * fadeProgress;
      // ──────────────────────────────────────────────────────────────────

      // Mirror frame
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx + 6, ry + 6, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(160, 145, 110, 0.35)`;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Mirror surface sheen
      const mirrorGrad = ctx.createRadialGradient(cx - 20, cy - 30, 0, cx, cy, rx);
      mirrorGrad.addColorStop(0, `rgba(100, 110, 130, ${0.08 + breathe * 0.03})`);
      mirrorGrad.addColorStop(1, `rgba(60, 65, 85, 0.05)`);
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = mirrorGrad;
      ctx.fillRect(0, 0, W, H);

      // Cracks
      cracks.forEach((crack, ci) => {
        // ── CRACK STAGGER DELAY: 0.06 per crack ───────────────────────
        // increase for more sequential crack appearance
        const crackDelay = ci * 0.06;
        // ──────────────────────────────────────────────────────────────
        const cp = Math.max(0, crackProgress - crackDelay);
        drawCrackLine(cx + crack.ox, cy + crack.oy, crack.angle, crack.len, cp, breathe, 0);

        crack.branches.forEach((branch) => {
          const branchProgress = Math.max(0, cp - 0.4);
          const bStartX = cx + crack.ox + Math.cos(crack.angle) * crack.len * rx * 0.5;
          const bStartY = cy + crack.oy + Math.sin(crack.angle) * crack.len * ry * 0.5;
          drawCrackLine(bStartX, bStartY, crack.angle + branch.a, branch.l, branchProgress, breathe, 1);
        });
      });

      // Impact glows
      impacts.forEach((imp, ii) => {
        const impDelay = ii * 0.3;
        const impProgress = Math.max(0, crackProgress - impDelay);
        if (impProgress <= 0) return;
        const impGlow = ctx.createRadialGradient(imp.x, imp.y, 0, imp.x, imp.y, 12);
        impGlow.addColorStop(0, `rgba(210, 185, 130, ${impProgress * 0.35 + breathe * 0.1})`);
        impGlow.addColorStop(1, 'rgba(210, 185, 130, 0)');
        ctx.fillStyle = impGlow;
        ctx.beginPath();
        ctx.arc(imp.x, imp.y, 12, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // Mirror outline
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180, 165, 130, ${0.3 + breathe * 0.1})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default CrackedMirrorAnimation;
