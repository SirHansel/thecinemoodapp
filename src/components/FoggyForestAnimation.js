import React from 'react';

// themes: the unknown that invites, ancient stillness that precedes human time
// visualization: Vertical tree forms at varying depths dissolve into organic fog — 
// the forest exists in suggestion, neither welcoming nor refusing

const FoggyForestAnimation = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    const trees = [];
    const NUM_TREES = 28;

    for (let i = 0; i < NUM_TREES; i++) {
      const depth = Math.random();
      trees.push({
        x: Math.random() * W,
        depth,
        width: (2 + Math.random() * 3) * (1 - depth * 0.5),
        height: H * (0.35 + Math.random() * 0.45) * (1 - depth * 0.3),
        phase: Math.random() * Math.PI * 2,
        swayPhase: Math.random() * Math.PI * 2,
        fogPhase: Math.random() * Math.PI * 2,
        baseAlpha: 0.15 + (1 - depth) * 0.45,
      });
    }

    trees.sort((a, b) => b.depth - a.depth);

    function drawOrganicFogForm(cx, cy, rx, ry, alpha, speed, phase, wobble) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(140, 165, 150, ${alpha})`;
      ctx.lineWidth = 0.6;
      const pts = 120;
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        let rx2 = rx + wobble * Math.sin(a * 3 + t * speed + phase);
        rx2 += wobble * 0.5 * Math.cos(a * 6 - t * speed * 0.8 + phase * 1.2);
        rx2 += wobble * 0.3 * Math.sin(a * 10 + t * speed * 0.5);
        let ry2 = ry + wobble * 0.35 * Math.cos(a * 4 + t * speed * 0.6 + phase);
        ry2 += wobble * 0.15 * Math.sin(a * 7 - phase);
        const x = cx + Math.cos(a) * rx2;
        const y = cy + Math.sin(a) * ry2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // ── SPEED CONTROL ─────────────────────────────────────
      t += 0.006; // base animation speed
      // ──────────────────────────────────────────────────────

      // Background organic fog forms
      const fogForms = [
        { cx: W*0.25+Math.sin(t*0.08)*15, cy: H*0.55+Math.cos(t*0.06)*8, rx: 70, ry: 18, alpha: 0.025, speed: 0.4, phase: 0, w: 10 },
        { cx: W*0.75+Math.sin(t*0.07+1)*12, cy: H*0.50+Math.cos(t*0.05+1)*6, rx: 60, ry: 15, alpha: 0.022, speed: 0.35, phase: 1.5, w: 9 },
        { cx: W*0.5+Math.sin(t*0.09+2)*18, cy: H*0.62+Math.cos(t*0.07+2)*7, rx: 80, ry: 20, alpha: 0.028, speed: 0.45, phase: 3.0, w: 11 },
        { cx: W*0.15+Math.sin(t*0.06+3)*10, cy: H*0.70+Math.cos(t*0.05+3)*5, rx: 55, ry: 14, alpha: 0.020, speed: 0.3, phase: 4.5, w: 8 },
        { cx: W*0.85+Math.sin(t*0.08+4)*12, cy: H*0.65+Math.cos(t*0.06+4)*6, rx: 58, ry: 16, alpha: 0.022, speed: 0.38, phase: 2.0, w: 9 },
        { cx: W*0.4+Math.sin(t*0.07+5)*14, cy: H*0.45+Math.cos(t*0.05+5)*8, rx: 65, ry: 13, alpha: 0.018, speed: 0.32, phase: 5.5, w: 8 },
      ];
      fogForms.forEach(f => drawOrganicFogForm(f.cx, f.cy, f.rx, f.ry, f.alpha, f.speed, f.phase, f.w));

      // Horizontal fog bands
      for (let f = 0; f < 5; f++) {
        const fogY = H * (0.45 + f * 0.12) + Math.sin(t * 0.15 + f * 1.3) * 8;
        const fogAlpha = 0.025 + Math.sin(t * 0.2 + f * 0.7) * 0.01;
        const fogH = H * (0.06 + f * 0.02);
        const fogGrad = ctx.createLinearGradient(0, fogY - fogH, 0, fogY + fogH);
        fogGrad.addColorStop(0, 'rgba(140, 160, 150, 0)');
        fogGrad.addColorStop(0.5, `rgba(140, 160, 150, ${fogAlpha})`);
        fogGrad.addColorStop(1, 'rgba(140, 160, 150, 0)');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, fogY - fogH, W, fogH * 2);
      }

      trees.forEach(tr => {
        // ── SWAY SPEED: t * 0.25 ──────────────────────────
        const sway = Math.sin(t * 0.25 + tr.swayPhase) * 1.5;
        // ──────────────────────────────────────────────────
        const breathe = Math.sin(t * 0.3 + tr.phase) * 0.5 + 0.5;
        const fogDissolve = tr.depth * (Math.sin(t * 0.18 + tr.fogPhase) * 0.3 + 0.7);
        const alpha = tr.baseAlpha * fogDissolve + breathe * 0.05;

        const treeX = tr.x + sway;
        const treeBottom = H * 0.92;
        const treeTop = treeBottom - tr.height;

        const g = ctx.createLinearGradient(treeX, treeTop, treeX, treeBottom);
        g.addColorStop(0, `rgba(120, 150, 130, 0)`);
        g.addColorStop(0.15, `rgba(120, 150, 130, ${alpha * 0.6})`);
        g.addColorStop(0.5, `rgba(140, 165, 145, ${alpha})`);
        g.addColorStop(0.85, `rgba(120, 150, 130, ${alpha * 0.8})`);
        g.addColorStop(1, `rgba(100, 130, 110, ${alpha * 0.3})`);

        ctx.beginPath();
        ctx.strokeStyle = g;
        ctx.lineWidth = tr.width;
        ctx.lineCap = 'round';
        const midX = treeX + Math.sin(t * 0.12 + tr.phase) * 0.8;
        ctx.moveTo(treeX, treeBottom);
        ctx.quadraticCurveTo(midX, treeBottom - tr.height * 0.5, treeX + sway * 0.3, treeTop);
        ctx.stroke();

        if (tr.depth < 0.4) {
          const branchY = treeTop + tr.height * 0.3;
          const branchAlpha = alpha * 0.4;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(120, 150, 130, ${branchAlpha})`;
          ctx.lineWidth = tr.width * 0.4;
          ctx.moveTo(treeX, branchY);
          ctx.lineTo(treeX + 8 + Math.sin(t * 0.2) * 2, branchY - 10);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(treeX, branchY + 8);
          ctx.lineTo(treeX - 7 + Math.sin(t * 0.15) * 2, branchY - 5);
          ctx.stroke();
        }
      });

      // Foreground organic fog forms
      const fgForms = [
        { cx: W*0.3+Math.sin(t*0.1)*20, cy: H*0.80+Math.cos(t*0.08)*5, rx: 90, ry: 16, alpha: 0.035, speed: 0.5, phase: 0.8, w: 12 },
        { cx: W*0.7+Math.sin(t*0.09+2)*18, cy: H*0.78+Math.cos(t*0.07+2)*4, rx: 85, ry: 14, alpha: 0.030, speed: 0.45, phase: 2.5, w: 11 },
        { cx: W*0.5+Math.sin(t*0.11+4)*22, cy: H*0.85+Math.cos(t*0.09+4)*4, rx: 100, ry: 18, alpha: 0.040, speed: 0.55, phase: 4.2, w: 13 },
      ];
      fgForms.forEach(f => drawOrganicFogForm(f.cx, f.cy, f.rx, f.ry, f.alpha, f.speed, f.phase, f.w));

      // Ground fog
      const groundFog = ctx.createLinearGradient(0, H * 0.75, 0, H);
      groundFog.addColorStop(0, 'rgba(130, 155, 140, 0)');
      groundFog.addColorStop(1, `rgba(130, 155, 140, ${0.07 + Math.sin(t * 0.25) * 0.025})`);
      ctx.fillStyle = groundFog;
      ctx.fillRect(0, H * 0.75, W, H * 0.25);

      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default FoggyForestAnimation;
