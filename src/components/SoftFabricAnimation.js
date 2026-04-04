import React from 'react';

// themes: fabric is geometry that gives, structure that yields — folds and drape
// visualization: Warp and weft threads ripple beneath rolling drape folds —
// the weave visible underneath, light on the ridge, shadow in the valley

const SoftFabricAnimation = () => {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    const NUM_WARP = 14;
    const NUM_WEFT = 14;

    const warpLines = [];
    for (let i = 0; i < NUM_WARP; i++) {
      warpLines.push({
        x: (i / (NUM_WARP - 1)) * W,
        phase: (i / NUM_WARP) * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.002,
        amp: 6 + Math.random() * 8,
        waveFreq: 1.5 + Math.random() * 1.0,
      });
    }

    const weftLines = [];
    for (let i = 0; i < NUM_WEFT; i++) {
      weftLines.push({
        y: (i / (NUM_WEFT - 1)) * H,
        phase: (i / NUM_WEFT) * Math.PI * 2 + Math.PI * 0.5,
        speed: 0.0025 + Math.random() * 0.002,
        amp: 5 + Math.random() * 7,
        waveFreq: 1.5 + Math.random() * 1.0,
      });
    }

    const NUM_FOLDS = 6;
    const folds = [];
    for (let i = 0; i < NUM_FOLDS; i++) {
      folds.push({
        yBase: (i / NUM_FOLDS) * H + H / (NUM_FOLDS * 2),
        phase: (i / NUM_FOLDS) * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.0015,
        amp: 12 + Math.random() * 16,
        depth: 0.4 + Math.random() * 0.4,
        waveFreq: 0.8 + Math.random() * 0.6,
      });
    }

    function getWarpX(line, y, time) {
      const progress = y / H;
      const fold = Math.sin(progress * Math.PI * line.waveFreq + line.phase + time * line.speed * 60) * line.amp;
      const drape = Math.sin(progress * Math.PI) * 4;
      return line.x + fold + drape;
    }

    function getWeftY(line, x, time) {
      const progress = x / W;
      const fold = Math.sin(progress * Math.PI * line.waveFreq + line.phase + time * line.speed * 60) * line.amp;
      const drape = Math.sin(progress * Math.PI) * 3;
      return line.y + fold + drape;
    }

    function drawWarpThreads(time) {
      warpLines.forEach((line) => {
        const steps = 60;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const y = (i / steps) * H;
          const x = getWarpX(line, y, time);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const centerDist = Math.abs(line.x - W / 2) / (W / 2);
        const alpha = (0.09 - centerDist * 0.03) + Math.sin(time * 0.4 + line.phase) * 0.02;
        ctx.strokeStyle = `rgba(190, 175, 155, ${Math.max(0.03, alpha)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });
    }

    function drawWeftThreads(time) {
      weftLines.forEach((line) => {
        const steps = 60;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * W;
          const y = getWeftY(line, x, time);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const centerDist = Math.abs(line.y - H / 2) / (H / 2);
        const alpha = (0.07 - centerDist * 0.02) + Math.sin(time * 0.35 + line.phase) * 0.02;
        ctx.strokeStyle = `rgba(175, 165, 148, ${Math.max(0.03, alpha)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
    }

    function drawDrapeFolds(time) {
      folds.forEach((fold) => {
        const steps = 80;
        const breathe = Math.sin(time * fold.speed * 60 + fold.phase) * 0.5 + 0.5;
        const yShift = Math.sin(time * fold.speed * 40 + fold.phase) * 8;
        const currentY = fold.yBase + yShift;

        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * W;
          const y = currentY + Math.sin((i / steps) * Math.PI * fold.waveFreq * 2 + time * fold.speed * 50 + fold.phase) * fold.amp * (0.6 + breathe * 0.4);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const alpha = 0.08 + breathe * 0.07;
        ctx.strokeStyle = `rgba(210, 195, 170, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * W;
          const y = currentY + Math.sin((i / steps) * Math.PI * fold.waveFreq * 2 + time * fold.speed * 50 + fold.phase) * fold.amp * (0.6 + breathe * 0.4) + 3;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(120, 110, 95, ${alpha * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
    }

    function drawSoftGlow(time) {
      const breathe = Math.sin(time * 0.28) * 0.5 + 0.5;
      const grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 100 + breathe * 20);
      grd.addColorStop(0, `rgba(190, 175, 150, ${0.04 + breathe * 0.03})`);
      grd.addColorStop(1, 'rgba(150, 135, 115, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      // ── SPEED CONTROL ─────────────────────
      t += 0.006;
      // ──────────────────────────────────────
      drawSoftGlow(t);
      drawWarpThreads(t);
      drawWeftThreads(t);
      drawDrapeFolds(t);
      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default SoftFabricAnimation;
