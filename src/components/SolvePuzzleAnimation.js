import React from 'react';

// themes: ordered thinking finding resolution, the pleasure of pattern recognition
// visualization: Puzzle pieces scatter and converge — interlocking forms finding
// their place, the satisfaction of completion cycling endlessly

const SolvePuzzleAnimation = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    const COLS = 6;
    const ROWS = 6;
    const cellW = W / (COLS + 2);
    const cellH = H / (ROWS + 2);
    const offsetX = cellW;
    const offsetY = cellH;

    const pieces = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const targetX = offsetX + c * cellW + cellW / 2;
        const targetY = offsetY + r * cellH + cellH / 2;
        pieces.push({
          tx: targetX,
          ty: targetY,
          x: targetX + (Math.random() - 0.5) * W * 0.6,
          y: targetY + (Math.random() - 0.5) * H * 0.6,
          phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.003,
          row: r,
          col: c,
          nubs: {
            top:    Math.random() < 0.5 ? 1 : -1,
            right:  Math.random() < 0.5 ? 1 : -1,
            bottom: Math.random() < 0.5 ? 1 : -1,
            left:   Math.random() < 0.5 ? 1 : -1,
          }
        });
      }
    }

    function drawPiece(x, y, w, h, nubs, alpha) {
      const nubSize = Math.min(w, h) * 0.22;
      const r = w / 2;
      const l = -w / 2;
      const top = -h / 2;
      const bot = h / 2;
      const mx = 0;
      const my = 0;

      ctx.beginPath();
      ctx.moveTo(l, top);
      ctx.lineTo(mx - nubSize, top);
      if (nubs.top !== 0) ctx.arc(mx, top, nubSize, Math.PI, 0, nubs.top < 0);
      ctx.lineTo(r, top);
      ctx.lineTo(r, my - nubSize);
      if (nubs.right !== 0) ctx.arc(r, my, nubSize, -Math.PI/2, Math.PI/2, nubs.right < 0);
      ctx.lineTo(r, bot);
      ctx.lineTo(mx + nubSize, bot);
      if (nubs.bottom !== 0) ctx.arc(mx, bot, nubSize, 0, Math.PI, nubs.bottom < 0);
      ctx.lineTo(l, bot);
      ctx.lineTo(l, my + nubSize);
      if (nubs.left !== 0) ctx.arc(l, my, nubSize, Math.PI/2, -Math.PI/2, nubs.left < 0);
      ctx.lineTo(l, top);
      ctx.closePath();

      ctx.fillStyle = `rgba(140, 160, 185, ${alpha * 0.12})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(160, 185, 215, ${alpha})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // ── SPEED CONTROL ─────────────────────────────────────
      t += 0.004;
      // ──────────────────────────────────────────────────────

      // ── CYCLE LENGTH: 500 frames ───────────────────────────
      // increase = slower scatter/solve cycle
      const cycleLen = 500;
      // ──────────────────────────────────────────────────────
      const cycleT = (t * 60) % cycleLen;
      const solveProgress = cycleT < cycleLen * 0.5
        ? cycleT / (cycleLen * 0.5)
        : 1 - (cycleT - cycleLen * 0.5) / (cycleLen * 0.5);
      const eased = solveProgress < 0.5
        ? 2 * solveProgress * solveProgress
        : 1 - Math.pow(-2 * solveProgress + 2, 2) / 2;

      const breathe = Math.sin(t * 0.4) * 0.5 + 0.5;

      pieces.forEach((p) => {
        // ── PIECE STAGGER DELAY: 0.3 total spread ─────────────
        // increase for more sequential piece movement
        const delay = (p.row + p.col) / (ROWS + COLS) * 0.3;
        // ──────────────────────────────────────────────────────
        const localProgress = Math.max(0, Math.min(1, (eased - delay) / (1 - delay)));

        const px = p.x + (p.tx - p.x) * localProgress;
        const py = p.y + (p.ty - p.y) * localProgress;

        // ── PIECE OPACITY: 0.2 scattered → 0.6 solved ─────────
        const alpha = 0.2 + localProgress * 0.4 + breathe * 0.05;
        // ──────────────────────────────────────────────────────

        ctx.save();
        ctx.translate(px, py);
        drawPiece(0, 0, cellW * 0.85, cellH * 0.85, p.nubs, alpha);
        ctx.restore();
      });

      // ── COMPLETION GLOW: fires when eased > 0.85 ──────────
      // increase 0.08 for stronger glow at completion
      if (eased > 0.85) {
        const glowAlpha = (eased - 0.85) / 0.15 * 0.08;
        const glow = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 100);
        glow.addColorStop(0, `rgba(160, 185, 215, ${glowAlpha})`);
        glow.addColorStop(1, 'rgba(160, 185, 215, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
      }
      // ──────────────────────────────────────────────────────

      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default SolvePuzzleAnimation;
