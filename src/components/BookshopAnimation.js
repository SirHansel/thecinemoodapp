import React from 'react';

// themes: accumulated worlds waiting to be entered, comfort in the presence of stories
// visualization: Book spines arranged in shifting rows — rectangles that breathe and lean gently,
// suggesting shelves of infinite possibility, some pulling forward as if calling to be chosen

const BookshopAnimation = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    const books = [];

    const rowConfig = [
      { y: 0.72, bookH: 0.18, count: 14, baseAlpha: 0.55 },
      { y: 0.50, bookH: 0.22, count: 12, baseAlpha: 0.45 },
      { y: 0.26, bookH: 0.16, count: 16, baseAlpha: 0.32 },
    ];

    rowConfig.forEach((row) => {
      const totalW = W * 0.88;
      const startX = W * 0.06;
      let x = startX;
      for (let i = 0; i < row.count; i++) {
        const w = (totalW / row.count) * (0.72 + Math.random() * 0.38);
        books.push({
          x: x,
          w: Math.min(w, totalW / row.count * 0.95),
          h: row.bookH * H * (0.8 + Math.random() * 0.4),
          baseY: row.y * H,
          phase: Math.random() * Math.PI * 2,
          leanPhase: Math.random() * Math.PI * 2,
          pullPhase: Math.random() * Math.PI * 2,
          pullProb: Math.random(),
          baseAlpha: row.baseAlpha,
          colorShift: Math.random(),
        });
        x += totalW / row.count;
      }
    });

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // ── SPEED CONTROL ─────────────────────────────────────
      t += 0.006; // base animation speed
      // ──────────────────────────────────────────────────────

      // Shelf lines
      rowConfig.forEach((row, ri) => {
        const shelfY = row.y * H + 2;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(160, 140, 110, ${0.12 - ri * 0.03})`;
        ctx.lineWidth = 1.5;
        ctx.moveTo(W * 0.04, shelfY);
        ctx.lineTo(W * 0.96, shelfY);
        ctx.stroke();
      });

      books.forEach(b => {
        // ── BOOK BREATHE SPEED: t * 0.35 ──────────────────
        // increase multiplier = faster breathing
        const breathe = Math.sin(t * 0.35 + b.phase) * 0.5 + 0.5;
        // ──────────────────────────────────────────────────

        // ── LEAN SPEED: t * 0.18 ──────────────────────────
        // increase multiplier = faster leaning
        const lean = Math.sin(t * 0.18 + b.leanPhase) * 1.8;
        // ──────────────────────────────────────────────────

        // ── PULL SPEED: t * 0.22 ──────────────────────────
        // only books with pullProb > 0.85 pull forward
        // increase multiplier = faster pull cycle
        const pull = b.pullProb > 0.85 ? Math.max(0, Math.sin(t * 0.22 + b.pullPhase)) * 6 : 0;
        // ──────────────────────────────────────────────────

        const bookY = b.baseY - b.h - pull;
        const alpha = b.baseAlpha + breathe * 0.12;

        const r = Math.round(160 + b.colorShift * 40);
        const g = Math.round(130 + b.colorShift * 30);
        const bl = Math.round(90 + b.colorShift * 20);

        ctx.save();
        ctx.translate(b.x + b.w / 2, b.baseY);
        ctx.rotate((lean * Math.PI) / 180);
        ctx.translate(-(b.x + b.w / 2), -b.baseY);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${bl}, ${alpha * 0.3})`;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.rect(b.x, bookY, b.w, b.h);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r + 20}, ${g + 20}, ${bl + 20}, ${alpha * 0.5})`;
        ctx.lineWidth = 0.4;
        ctx.moveTo(b.x + b.w * 0.15, bookY + b.h * 0.2);
        ctx.lineTo(b.x + b.w * 0.15, bookY + b.h * 0.8);
        ctx.stroke();

        ctx.restore();
      });

      const glow = ctx.createRadialGradient(W/2, H*0.5, 0, W/2, H*0.5, 80);
      glow.addColorStop(0, `rgba(200, 170, 120, ${0.04 + Math.sin(t*0.3)*0.02})`);
      glow.addColorStop(1, 'rgba(200, 170, 120, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default BookshopAnimation;
