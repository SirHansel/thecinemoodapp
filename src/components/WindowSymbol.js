import React from 'react';

const WindowSymbol = () => {
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
      const hw = 26, hh = 30;
      function tl(a, w) {
        ctx.strokeStyle = `rgba(80,210,190,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(60,190,170,0.8)';
      }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 25);
      g.addColorStop(0, `rgba(80,210,190,${0.1 + p * 0.05})`);
      g.addColorStop(1, 'rgba(60,180,160,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      [[8, 0.06], [4, 0.18], [1.5, 0.65], [0.8, 0.9]].forEach(([w, a]) => {
        tl(a, w);
        ctx.beginPath();
        ctx.rect(cx - hw, cy - hh, hw * 2, hh * 2);
        ctx.stroke();
      });
      tl(0.5, 0.8);
      ctx.beginPath();
      ctx.moveTo(cx, cy - hh); ctx.lineTo(cx, cy + hh);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - hw, cy); ctx.lineTo(cx + hw, cy);
      ctx.stroke();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default WindowSymbol;
