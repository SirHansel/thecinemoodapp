import React from 'react';

// themes: one small light changes everything around it, stillness and flicker
// visualization: A flame that breathes and shifts — warm halos pulse outward
// holding the dark at bay, soft motes drift through the circle of light

const SoftCandleAnimation = () => {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    const NUM_HALOS = 10;
    const halos = [];
    for (let i = 0; i < NUM_HALOS; i++) {
      halos.push({
        baseR: 18 + i * 16,
        phase: (i / NUM_HALOS) * Math.PI * 2,
        speed: 0.004 + Math.random() * 0.003,
        driftX: (Math.random() - 0.5) * 6,
        driftY: (Math.random() - 0.5) * 4,
      });
    }

    const NUM_MOTES = 22;
    const motes = [];
    for (let i = 0; i < NUM_MOTES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 70;
      motes.push({
        angle,
        dist,
        speed: (0.0003 + Math.random() * 0.0004) * (Math.random() < 0.5 ? 1 : -1),
        riseSpeed: 0.12 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.15 + Math.random() * 0.35,
        size: 0.6 + Math.random() * 1.1,
        y: H * 0.42 - Math.random() * 60,
        baseY: H * 0.42 - Math.random() * 60,
      });
    }

    function getCandleCenter(time) {
      return {
        cx: W * 0.5 + Math.sin(time * 0.37) * 2.5,
        cy: H * 0.52,
      };
    }

    function drawAmbientGlow(time) {
      const { cx, cy } = getCandleCenter(time);
      const flameY = cy - 52;
      const breathe = Math.sin(time * 0.9) * 0.5 + 0.5;
      const flicker = Math.sin(time * 3.1) * 0.15 + Math.sin(time * 5.7) * 0.08;
      const r = 88 + breathe * 18 + flicker * 12;

      const grd = ctx.createRadialGradient(cx, flameY, 0, cx, flameY + 10, r);
      grd.addColorStop(0, `rgba(255, 200, 90, ${0.09 + breathe * 0.05 + flicker * 0.03})`);
      grd.addColorStop(0.35, `rgba(220, 140, 50, ${0.055 + breathe * 0.03})`);
      grd.addColorStop(0.7, `rgba(180, 90, 30, ${0.025})`);
      grd.addColorStop(1, 'rgba(160, 70, 20, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }

    function drawHalos(time) {
      const { cx, cy } = getCandleCenter(time);
      const flameY = cy - 52;
      const breathe = Math.sin(time * 0.9) * 0.5 + 0.5;

      halos.forEach((h, i) => {
        const pulse = Math.sin(time * h.speed * 60 + h.phase) * 0.5 + 0.5;
        const r = h.baseR + pulse * 8 + breathe * 4;
        const alpha = (0.07 - i * 0.005) * (0.5 + pulse * 0.5);
        const hx = cx + h.driftX * pulse;
        const hy = flameY + h.driftY * pulse;

        ctx.beginPath();
        ctx.ellipse(hx, hy, r, r * 0.72, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 190, 80, ${Math.max(0, alpha)})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });
    }

    function drawCandle(time) {
      const { cx, cy } = getCandleCenter(time);
      const cw = 22, ch = 58;

      ctx.beginPath();
      ctx.roundRect(cx - cw / 2, cy - ch / 2, cw, ch, 3);
      ctx.fillStyle = 'rgba(210, 185, 150, 0.13)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(210, 185, 150, 0.22)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - cw / 2 + 5, cy - ch / 2);
      ctx.lineTo(cx - cw / 2 + 5, cy + ch / 2);
      ctx.strokeStyle = 'rgba(180, 155, 120, 0.09)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    function drawWick(time) {
      const { cx, cy } = getCandleCenter(time);
      const wickTop = cy - 29;
      const wickBot = cy - 22;

      ctx.beginPath();
      ctx.moveTo(cx, wickBot);
      ctx.lineTo(cx + Math.sin(time * 0.9) * 1.2, wickTop);
      ctx.strokeStyle = 'rgba(180, 140, 80, 0.55)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function drawFlame(time) {
      const { cx, cy } = getCandleCenter(time);
      const flickerA = Math.sin(time * 3.1) * 0.5 + Math.sin(time * 7.3) * 0.25;
      const flickerB = Math.sin(time * 2.7 + 1.2) * 0.4;
      const breathe = Math.sin(time * 0.9) * 0.5 + 0.5;

      const fx = cx + flickerA * 3.5;
      const fy = cy - 29;
      const fh = 22 + breathe * 5 + flickerA * 3;
      const fw = 7 + breathe * 2 + Math.abs(flickerB) * 2;

      ctx.save();
      ctx.translate(fx, fy);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(fw, -fh * 0.3, fw * 0.6, -fh * 0.75, flickerA * 2, -fh);
      ctx.bezierCurveTo(-fw * 0.6, -fh * 0.75, -fw, -fh * 0.3, 0, 0);
      ctx.fillStyle = `rgba(255, 220, 100, ${0.55 + breathe * 0.15})`;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -2);
      ctx.bezierCurveTo(fw * 0.45, -fh * 0.35, fw * 0.3, -fh * 0.65, flickerA * 1.5, -fh * 0.82);
      ctx.bezierCurveTo(-fw * 0.3, -fh * 0.65, -fw * 0.45, -fh * 0.35, 0, -2);
      ctx.fillStyle = `rgba(255, 245, 180, ${0.7 + breathe * 0.2})`;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.bezierCurveTo(fw * 0.18, -fh * 0.4, fw * 0.1, -fh * 0.55, flickerA * 0.8, -fh * 0.65);
      ctx.bezierCurveTo(-fw * 0.1, -fh * 0.55, -fw * 0.18, -fh * 0.4, 0, -4);
      ctx.fillStyle = `rgba(255, 255, 230, 0.85)`;
      ctx.fill();

      ctx.restore();
    }

    function drawMotes(time) {
      const { cx, cy } = getCandleCenter(time);
      const flameY = cy - 52;

      motes.forEach(m => {
        m.angle += m.speed;
        m.y -= m.riseSpeed * 0.08;
        if (m.y < flameY - 90) {
          m.y = m.baseY;
          m.alpha = 0.1 + Math.random() * 0.3;
        }

        const wobble = Math.sin(time * 1.2 + m.phase) * 3;
        const x = cx + Math.cos(m.angle) * m.dist + wobble;
        const distFromCenter = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(m.y - flameY, 2));
        const fade = Math.max(0, 1 - distFromCenter / 110);

        ctx.beginPath();
        ctx.arc(x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 100, ${m.alpha * fade})`;
        ctx.fill();
      });
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      // ── SPEED CONTROL ─────────────────────
      t += 0.006;
      // ──────────────────────────────────────
      drawAmbientGlow(t);
      drawHalos(t);
      drawMotes(t);
      drawCandle(t);
      drawWick(t);
      drawFlame(t);
      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default SoftCandleAnimation;
