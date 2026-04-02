import React from 'react';

// themes: every mark on the blade is a story, wear as accumulated history
// visualization: A dagger at 45 degrees — impact marks breathe along the blade,
// geometric angled patterns in the background suggest facets and conflict

const WornBladeAnimation = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    const impacts = [];
    for (let i = 0; i < 8; i++) {
      impacts.push({
        t: 0.2 + Math.random() * 0.6,
        side: Math.random() < 0.5 ? 1 : -1,
        depth: 3 + Math.random() * 8,
        width: 2 + Math.random() * 4,
        alpha: 0.08 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
      });
    }

    function drawDagger(alpha, erosion) {
      const cx = 0, cy = 0;
      const tipY = -90;
      const guardY = 42;
      const gripTop = 46;
      const gripBot = 72;
      const pommelY = 82;

      const edgeWobble = (y) => {
        const norm = (y - tipY) / (guardY - tipY);
        const baseWidth = norm * 20;
        const wear = erosion * Math.sin(norm * 8 + t * 0.3) * 1.5;
        return baseWidth + wear;
      };

      ctx.beginPath();
      ctx.moveTo(cx, tipY);
      const steps = 40;
      for (let i = 0; i <= steps; i++) {
        const y = tipY + (i / steps) * (guardY - tipY);
        ctx.lineTo(cx + edgeWobble(y), y);
      }
      ctx.lineTo(cx + 26, guardY);
      ctx.lineTo(cx + 26, gripTop);
      ctx.lineTo(cx + 9, gripTop);
      ctx.lineTo(cx + 11, gripBot);
      ctx.lineTo(cx + 14, pommelY);
      ctx.lineTo(cx, pommelY + 7);
      ctx.lineTo(cx - 14, pommelY);
      ctx.lineTo(cx - 11, gripBot);
      ctx.lineTo(cx - 9, gripTop);
      ctx.lineTo(cx - 26, gripTop);
      ctx.lineTo(cx - 26, guardY);
      for (let i = steps; i >= 0; i--) {
        const y = tipY + (i / steps) * (guardY - tipY);
        ctx.lineTo(cx - edgeWobble(y), y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(185, 170, 140, ${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.fillStyle = `rgba(160, 145, 110, ${alpha * 0.15})`;
      ctx.fill();

      // Fuller line
      ctx.beginPath();
      for (let i = 0; i <= 30; i++) {
        const y = tipY + 12 + (i / 30) * (guardY - 18 - tipY - 12);
        const wobble = Math.sin(t * 0.2 + i * 0.3) * 0.4;
        i === 0 ? ctx.moveTo(cx + wobble, y) : ctx.lineTo(cx + wobble, y);
      }
      ctx.strokeStyle = `rgba(210, 195, 160, ${alpha * 0.5})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Impact marks along blade edges
      impacts.forEach(imp => {
        const y = tipY + imp.t * (guardY - tipY);
        const norm = (y - tipY) / (guardY - tipY);
        const bladeW = norm * 20;
        const px = cx + imp.side * (bladeW * 0.7);
        const breathe = Math.sin(t * 0.3 + imp.phase) * 0.5 + 0.5;
        const a = imp.alpha * (0.5 + breathe * 0.5);
        ctx.beginPath();
        ctx.moveTo(px, y - imp.width);
        ctx.lineTo(px + imp.side * imp.depth, y);
        ctx.lineTo(px, y + imp.width);
        ctx.strokeStyle = `rgba(200, 185, 150, ${a})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
    }

    function drawBackground() {

      // ── DIAGONAL HATCHING LINES ────────────────────────────
      // alpha controls how bold the diagonal lines appear
      // increase alpha value = bolder/more visible lines
      // spacing controls density — lower = more lines
      const angleLines = [
        { angle: Math.PI / 4,  spacing: 22, alpha: 0.12, speed: 0.008 },
{ angle: -Math.PI / 4, spacing: 28, alpha: 0.10, speed: 0.006 },
{ angle: Math.PI / 6,  spacing: 35, alpha: 0.08, speed: 0.005 },
      ];
      // ──────────────────────────────────────────────────────

      angleLines.forEach(al => {
        const drift = Math.sin(t * al.speed * 50) * 5;
        const cos = Math.cos(al.angle);
        const sin = Math.sin(al.angle);
        const len = W * 2;
        for (let d = -W; d < W * 2; d += al.spacing) {
          const ox = d + drift;
          ctx.beginPath();
          ctx.moveTo(ox - cos * len, -sin * len);
          ctx.lineTo(ox + cos * len, sin * len);
          // ── LINE WEIGHT: lineWidth 0.5 — increase for bolder lines
          ctx.strokeStyle = `rgba(180, 160, 110, ${al.alpha + Math.sin(t * 0.15 + d * 0.05) * 0.02})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });

      // ── DIAMOND SHAPES ─────────────────────────────────────
      // alpha range 0.06-0.10 — increase base alpha for bolder diamonds
      // size controls how large each diamond is
     const diamonds = [
  { x: W*0.15, y: H*0.2,  size: 18, phase: 0,   dx: 0.12, dy: 0.09 },
  { x: W*0.85, y: H*0.25, size: 14, phase: 1.2,  dx: 0.08, dy: 0.11 },
  { x: W*0.1,  y: H*0.75, size: 16, phase: 2.4,  dx: 0.10, dy: 0.07 },
  { x: W*0.88, y: H*0.72, size: 12, phase: 3.6,  dx: 0.09, dy: 0.13 },
  { x: W*0.2,  y: H*0.5,  size: 10, phase: 0.8,  dx: 0.11, dy: 0.08 },
  { x: W*0.8,  y: H*0.5,  size: 11, phase: 1.8,  dx: 0.07, dy: 0.10 },
];
      // ──────────────────────────────────────────────────────

    diamonds.forEach(d => {
  const breathe = Math.sin(t * 0.25 + d.phase) * 0.5 + 0.5;
  const alpha = 0.14 + breathe * 0.08;
  const s = d.size * (0.9 + breathe * 0.1);

  // ── DRIFT SPEED: dx/dy values control direction and speed ─
  // increase values = faster drift, decrease = slower
  const driftX = Math.sin(t * d.dx + d.phase) * 12;
  const driftY = Math.cos(t * d.dy + d.phase) * 10;
  // ──────────────────────────────────────────────────────────

  const px = d.x + driftX;
  const py = d.y + driftY;

  ctx.beginPath();
  ctx.moveTo(px, py - s);
  ctx.lineTo(px + s * 0.6, py);
  ctx.lineTo(px, py + s);
  ctx.lineTo(px - s * 0.6, py);
  ctx.closePath();
  ctx.strokeStyle = `rgba(185, 165, 120, ${alpha})`;
  ctx.lineWidth = 0.9;
  ctx.stroke();
});
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // ── SPEED CONTROL ─────────────────────────────────────
      t += 0.004; // base speed — increase for faster animation
      // ──────────────────────────────────────────────────────

      drawBackground();

      const breathe = Math.sin(t * 0.35) * 0.5 + 0.5;

      ctx.save();
      ctx.translate(W / 2, H / 2);
      // ── DAGGER ROTATION: Math.PI / 4 = 45 degrees ─────────
      ctx.rotate(Math.PI / 4);
      // ──────────────────────────────────────────────────────

      const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 70);
      glowGrad.addColorStop(0, `rgba(185, 165, 110, ${0.05 + breathe * 0.04})`);
      glowGrad.addColorStop(1, 'rgba(185, 165, 110, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(-100, -100, 200, 200);

      drawDagger(0.55 + breathe * 0.1, 0.12);
      ctx.restore();

      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default WornBladeAnimation;
