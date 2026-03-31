import React from 'react';

// themes: stillness at the edge of vastness, height as clarity
// visualization: Topographic contour lines pull apart revealing a mountain range — complexity at the base resolving into open space above, inner range moves faster suggesting forward motion and depth

const MountainAnimation = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    function getMountainY(x, layer, t, scale) {
      const nx = x / W;
      const spread = 1 + Math.sin(t * 0.2 + layer * 0.5) * 0.04;

      const peaks = scale === 'large' ? [
        { pos: 0.5,  height: 0.28, width: 1.2 },
        { pos: 0.3,  height: 0.38, width: 1.4 },
        { pos: 0.7,  height: 0.42, width: 1.3 },
        { pos: 0.18, height: 0.52, width: 1.6 },
        { pos: 0.82, height: 0.55, width: 1.5 },
      ] : [
        { pos: 0.42, height: 0.58, width: 2.2 },
        { pos: 0.58, height: 0.62, width: 2.0 },
        { pos: 0.25, height: 0.64, width: 2.4 },
        { pos: 0.75, height: 0.66, width: 2.2 },
        { pos: 0.12, height: 0.70, width: 2.6 },
        { pos: 0.88, height: 0.72, width: 2.5 },
        { pos: 0.5,  height: 0.68, width: 2.8 },
      ];

      let minY = 1.0;
      peaks.forEach(p => {
        const dx = nx - (0.5 + (p.pos - 0.5) * spread);
        const peakY = p.height + layer * (scale === 'large' ? 0.06 : 0.04) + Math.abs(dx) * p.width;
        const noiseFreq = scale === 'large' ? 12 : 18;
        const noiseAmp = scale === 'large' ? 0.012 : 0.008;
        const noise =
          Math.sin(dx * noiseFreq + t * 0.25 + layer * 1.3) * noiseAmp +
          Math.sin(dx * (noiseFreq + 8) - t * 0.15 + layer) * (noiseAmp * 0.5);
        minY = Math.min(minY, peakY + noise);
      });

      return Math.min(0.88, minY) * H;
    }

    function drawRange(numLines, scale, alphaScale, tOffset) {
      for (let l = 0; l < numLines; l++) {
        const progress = l / numLines;
        const pullWave = Math.sin(t * 0.4 + tOffset - progress * Math.PI * 2) * 0.5 + 0.5;

        let alpha;
        if (scale === 'large') {
          if (progress < 0.15) alpha = progress * 0.8 + 0.04;
          else if (progress < 0.5) alpha = 0.16 - (progress - 0.15) * 0.1;
          else alpha = 0.12 - (progress - 0.5) * 0.18;
        } else {
          if (progress < 0.2) alpha = progress * 0.5 + 0.02;
          else alpha = 0.10 - (progress - 0.2) * 0.12;
        }
        alpha = Math.max(0.018, alpha * alphaScale + pullWave * 0.03);

        ctx.beginPath();
        ctx.strokeStyle = `rgba(175, 198, 225, ${alpha})`;
        ctx.lineWidth = scale === 'large' ? 0.75 : 0.55;

        const pts = 100;
        for (let i = 0; i <= pts; i++) {
          const x = (i / pts) * W;
          const y = getMountainY(x, progress, t + tOffset, scale);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // ── SPEED CONTROL ─────────────────────────────────────
      t += 0.006; // base animation speed — increase to speed up everything
      // ──────────────────────────────────────────────────────

      // Inner small range — depth layer
      // ── INNER RANGE SPEED: t * 0.8 controls parallax rate ─
      // increase multiplier (e.g. 1.5) = faster inner range = stronger depth illusion
      // decrease (e.g. 0.3) = slower inner range = more distant feeling
      drawRange(30, 'small', 0.7, t * 0.8);
      // ──────────────────────────────────────────────────────

      // Outer large range — foreground
      drawRange(45, 'large', 1.0, 0);

      // Subtle base ground lines
      for (let b = 0; b < 6; b++) {
        const by = H * (0.80 + b * 0.038);
        const ba = (1 - b / 6) * 0.045;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(160, 185, 215, ${ba})`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 60; i++) {
          const x = (i / 60) * W;
          const y = by + Math.sin(t * 0.3 + b * 1.2 + i * 0.15) * 1.5;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default MountainAnimation;
