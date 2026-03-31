import React from 'react';

// themes: dawn and dusk are thresholds, time is most alive at its transitions
// visualization: A single source of light shifts and breathes — particles gather and disperse around it, suggesting either restless energy or deep stillness depending on where the light falls

const TimeAnimation = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    const NUM_PARTICLES = 120;
    const particles = [];

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 110;
      particles.push({
        angle,
        dist,
        baseDist: dist,
        speed: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
        size: Math.random() * 1.4 + 0.3,
        phase: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.0008 + 0.0002,
        driftAmp: Math.random() * 15 + 5,
      });
    }

    function getLightPos(t) {
      const cx = W/2 + Math.sin(t * 0.18) * 45;
      const cy = H/2 + Math.cos(t * 0.13) * 35;
      return { cx, cy };
    }

    function getLightColor(t) {
      const cycle = (Math.sin(t * 0.12) * 0.5 + 0.5);
      const r = Math.round(180 + cycle * 60);
      const g = Math.round(160 + cycle * 50);
      const b = Math.round(200 - cycle * 40);
      return { r, g, b, cycle };
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      t += 0.006;

      const { cx, cy } = getLightPos(t);
      const { r, g, b } = getLightColor(t);

      const breathe = Math.sin(t * 0.4) * 0.5 + 0.5;
      const lightRadius = 55 + breathe * 30;
      const lightAlpha = 0.08 + breathe * 0.07;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, lightRadius);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${lightAlpha + 0.05})`);
      grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${lightAlpha})`);
      grad.addColorStop(1, 'rgba(26, 26, 46, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, lightRadius, 0, Math.PI * 2);
      ctx.fill();

      particles.forEach(p => {
        p.angle += p.speed;
        const driftDist = p.baseDist + Math.sin(t * p.driftSpeed * 10 + p.phase) * p.driftAmp;
        const attraction = breathe * 0.35 + 0.1;
        const px = cx + Math.cos(p.angle) * driftDist * (1 - attraction * 0.4);
        const py = cy + Math.sin(p.angle) * driftDist * (1 - attraction * 0.4);
        const distToLight = Math.hypot(px - cx, py - cy);
        const proximity = Math.max(0, 1 - distToLight / lightRadius);
        const alpha = 0.08 + proximity * 0.45 + breathe * 0.15;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      });

      const coreAlpha = 0.25 + breathe * 0.3;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8 + breathe * 4);
      coreGrad.addColorStop(0, `rgba(240, 238, 230, ${coreAlpha})`);
      coreGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 12 + breathe * 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default TimeAnimation;
