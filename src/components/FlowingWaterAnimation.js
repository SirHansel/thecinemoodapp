import React from 'react';

// themes: water is never the same twice, always moving always itself,
// continuity through constant change
// visualization: Horizontal flow lines ripple across the surface —
// light glints catch the current, depth bands give body beneath

const FlowingWaterAnimation = () => {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    const NUM_LINES = 28;
    const lines = [];
    for (let i = 0; i < NUM_LINES; i++) {
      const progress = i / (NUM_LINES - 1);
      lines.push({
        y: progress * H,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.006,
        amp: 4 + Math.random() * 8,
        freq: 1.2 + Math.random() * 1.4,
        offset: Math.random() * W,
        flowSpeed: 0.4 + Math.random() * 0.6,
        alpha: 0.06 + (1 - Math.abs(progress - 0.5) * 2) * 0.08,
        thickness: 0.4 + Math.random() * 0.5,
      });
    }

    const NUM_GLINTS = 18;
    const glints = [];
    for (let i = 0; i < NUM_GLINTS; i++) {
      glints.push({
        x: Math.random() * W,
        y: Math.random() * H,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.004,
        flowSpeed: 0.5 + Math.random() * 0.8,
        size: 0.8 + Math.random() * 1.4,
        alpha: 0.2 + Math.random() * 0.4,
        lineIdx: Math.floor(Math.random() * NUM_LINES),
      });
    }

    function getLineY(line, x, time) {
      const flow = (x / W + time * line.flowSpeed) * Math.PI * 2 * line.freq;
      return line.y + Math.sin(flow + line.phase + time * line.speed * 60) * line.amp;
    }

    function drawFlowLines(time) {
      lines.forEach(line => {
        const steps = 80;
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * W;
          const y = getLineY(line, x, time);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const breathe = Math.sin(time * line.speed * 40 + line.phase) * 0.5 + 0.5;
        const alpha = line.alpha * (0.7 + breathe * 0.3);
        ctx.strokeStyle = `rgba(100, 160, 200, ${alpha})`;
        ctx.lineWidth = line.thickness;
        ctx.stroke();
      });
    }

    function drawGlints(time) {
      glints.forEach(g => {
        g.x -= g.flowSpeed * 0.5;
        if (g.x < -10) {
          g.x = W + 10;
          g.y = Math.random() * H;
          g.alpha = 0.2 + Math.random() * 0.4;
        }

        const line = lines[g.lineIdx];
        const y = getLineY(line, g.x, time);
        const pulse = Math.sin(time * g.speed * 60 + g.phase) * 0.5 + 0.5;
        const alpha = g.alpha * pulse;

        ctx.beginPath();
        ctx.arc(g.x, y, g.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 220, 245, ${alpha})`;
        ctx.fill();

        if (pulse > 0.7) {
          ctx.beginPath();
          ctx.moveTo(g.x - g.size * 2.5, y);
          ctx.lineTo(g.x + g.size * 2.5, y);
          ctx.strokeStyle = `rgba(200, 235, 255, ${alpha * 0.5})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      });
    }

    function drawDepthBands(time) {
      const numBands = 5;
      for (let i = 0; i < numBands; i++) {
        const progress = i / numBands;
        const bandY = progress * H;
        const breathe = Math.sin(time * 0.2 + progress * Math.PI) * 0.5 + 0.5;
        const alpha = 0.03 + breathe * 0.02;
        ctx.fillStyle = `rgba(60, 110, 160, ${alpha})`;
        ctx.fillRect(0, bandY, W, H / numBands);
      }
    }

    function drawSurfaceGlow(time) {
      const breathe = Math.sin(time * 0.22) * 0.5 + 0.5;
      const grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 140);
      grd.addColorStop(0, `rgba(80, 140, 190, ${0.05 + breathe * 0.03})`);
      grd.addColorStop(1, 'rgba(40, 80, 130, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      // ── SPEED CONTROL ─────────────────────
      t += 0.006;
      // ──────────────────────────────────────
      drawDepthBands(t);
      drawSurfaceGlow(t);
      drawFlowLines(t);
      drawGlints(t);
      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default FlowingWaterAnimation;
