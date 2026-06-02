import React from 'react';

const OldPhotographSymbol = () => {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const S = 100;
    let t = 0;
    let animId = null;
    function draw() {
      ctx.fillStyle = '#0a0a18';
      ctx.fillRect(0, 0, S, S);
      t += 0.02;
      const cx = S / 2, cy = S / 2;
      const p = Math.sin(t * 0.4) * 0.5 + 0.5;
      const hw = 28, hh = 22;
      function pl(a, w) {
        ctx.strokeStyle = `rgba(180,120,255,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(150,80,255,0.8)';
      }
      [[8, 0.06], [4, 0.18], [1.5, 0.65], [0.8, 0.9]].forEach(([w, a]) => {
        pl(a, w);
        ctx.beginPath();
        ctx.rect(cx - hw, cy - hh, hw * 2, hh * 2);
        ctx.stroke();
      });
      pl(0.4, 0.7);
      ctx.beginPath();
      ctx.rect(cx - 20, cy - 15, 40, 30);
      ctx.stroke();
      // subtle figure silhouette inside
      pl(0.25, 0.6);
      ctx.beginPath();
      ctx.arc(cx, cy - 5, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy + 2);
      ctx.quadraticCurveTo(cx, cy + 5, cx + 6, cy + 2);
      ctx.lineTo(cx + 4, cy + 14);
      ctx.lineTo(cx - 4, cy + 14);
      ctx.closePath();
      ctx.stroke();
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
      g.addColorStop(0, `rgba(180,120,255,${0.12 + p * 0.08})`);
      g.addColorStop(1, 'rgba(150,80,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, S, S);
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default OldPhotographSymbol;
