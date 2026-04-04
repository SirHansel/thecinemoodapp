import React from 'react';

// themes: crystals grow together, each one perfect, the cluster more beautiful than any single form
// visualization: Single terminated quartz points — hexagonal body, vertical facets,
// horizontal striations, multi-faced termination, light shifting across faces

const SharpCrystalAnimation = () => {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    const spires = [
      { x: 150, baseY: 240, width: 32, height: 130, phase: 0,   speed: 0.0018 },
      { x: 105, baseY: 245, width: 22, height: 95,  phase: 1.1, speed: 0.0022 },
      { x: 196, baseY: 243, width: 24, height: 105, phase: 2.3, speed: 0.002  },
      { x: 68,  baseY: 250, width: 15, height: 62,  phase: 0.7, speed: 0.0026 },
      { x: 234, baseY: 248, width: 17, height: 70,  phase: 1.8, speed: 0.0024 },
      { x: 128, baseY: 247, width: 13, height: 50,  phase: 3.1, speed: 0.003  },
      { x: 172, baseY: 246, width: 14, height: 55,  phase: 2.0, speed: 0.0028 },
    ];

    function drawQuartzSpire(s, time) {
      const breathe = Math.sin(time * s.speed * 60 + s.phase) * 0.5 + 0.5;
      const lightShift = Math.sin(time * 0.2 + s.phase) * 0.5 + 0.5;

      const hw = s.width / 2;
      const baseY = s.baseY;
      const bodyH = s.height * 0.68;
      const topY = baseY - bodyH;
      const tipY = baseY - s.height * (0.93 + breathe * 0.07);
      const tipX = s.x + Math.sin(time * s.speed * 35 + s.phase) * 0.8;

      const facets = [
        { x1: s.x - hw,        x2: s.x - hw * 0.55,  light: 0.10 + lightShift * 0.06 },
        { x1: s.x - hw * 0.55, x2: s.x - hw * 0.1,   light: 0.18 + lightShift * 0.14 },
        { x1: s.x - hw * 0.1,  x2: s.x + hw * 0.2,   light: 0.28 + lightShift * 0.18 },
        { x1: s.x + hw * 0.2,  x2: s.x + hw * 0.55,  light: 0.20 + (1-lightShift)*0.14 },
        { x1: s.x + hw * 0.55, x2: s.x + hw,          light: 0.11 + (1-lightShift)*0.08 },
      ];

      facets.forEach(f => {
        ctx.beginPath();
        ctx.moveTo(f.x1, baseY);
        ctx.lineTo(f.x2, baseY);
        ctx.lineTo(f.x2, topY);
        ctx.lineTo(f.x1, topY);
        ctx.closePath();
        ctx.fillStyle = `rgba(180, 220, 245, ${f.light})`;
        ctx.fill();
      });

      ctx.beginPath();
      ctx.rect(s.x - hw, topY, s.width, bodyH);
      ctx.strokeStyle = `rgba(200, 235, 255, 0.18)`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      [-hw*0.55, -hw*0.1, hw*0.2, hw*0.55].forEach(ox => {
        ctx.beginPath();
        ctx.moveTo(s.x + ox, baseY);
        ctx.lineTo(s.x + ox, topY);
        ctx.strokeStyle = `rgba(160, 210, 240, 0.12)`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      });

      const termFacets = [
        { x1: s.x - hw,        x2: s.x - hw * 0.55,  light: 0.08 + lightShift * 0.05 },
        { x1: s.x - hw * 0.55, x2: s.x - hw * 0.1,   light: 0.16 + lightShift * 0.12 },
        { x1: s.x - hw * 0.1,  x2: s.x + hw * 0.2,   light: 0.26 + lightShift * 0.16 },
        { x1: s.x + hw * 0.2,  x2: s.x + hw * 0.55,  light: 0.17 + (1-lightShift)*0.12 },
        { x1: s.x + hw * 0.55, x2: s.x + hw,          light: 0.09 + (1-lightShift)*0.06 },
      ];

      termFacets.forEach(f => {
        ctx.beginPath();
        ctx.moveTo(f.x1, topY);
        ctx.lineTo(f.x2, topY);
        ctx.lineTo(tipX, tipY);
        ctx.closePath();
        ctx.fillStyle = `rgba(200, 235, 255, ${f.light})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(210, 240, 255, ${f.light * 0.8})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      for (let i = 1; i <= 4; i++) {
        const sy = topY + (bodyH / 5) * i;
        ctx.beginPath();
        ctx.moveTo(s.x - hw, sy);
        ctx.lineTo(s.x + hw, sy);
        ctx.strokeStyle = `rgba(160, 210, 240, 0.07)`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }

    function drawBase(time) {
      const breathe = Math.sin(time * 0.28) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.ellipse(W/2, 248, 115, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 150, 190, ${0.07 + breathe * 0.03})`;
      ctx.fill();

      const grd = ctx.createRadialGradient(W/2, 248, 0, W/2, 248, 130);
      grd.addColorStop(0, `rgba(120, 170, 210, ${0.05 + breathe * 0.03})`);
      grd.addColorStop(1, 'rgba(80, 120, 160, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      // ── SPEED CONTROL ─────────────────────
      t += 0.006;
      // ──────────────────────────────────────
      drawBase(t);
      const sorted = [...spires].sort((a, b) => b.height - a.height);
      sorted.forEach(s => drawQuartzSpire(s, t));
      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default SharpCrystalAnimation;
