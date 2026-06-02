import React from 'react';

const LockedBoxSymbol = () => {
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
      const cx = S / 2, cy = S / 2 + 5;
      const p = Math.sin(t * 0.5) * 0.5 + 0.5;
      function pl(a, w) {
        ctx.strokeStyle = `rgba(180,120,255,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(150,80,255,0.8)';
      }
      [[8, 0.06], [4, 0.18], [1.5, 0.65], [0.8, 0.9]].forEach(([w, a]) => {
        pl(a, w);
        ctx.beginPath();
        ctx.rect(cx - 24, cy - 18, 48, 36);
        ctx.stroke();
      });
      pl(0.5, 0.8);
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy - 8);
      ctx.lineTo(cx + 24, cy - 8);
      ctx.stroke();
      [[6, 0.1], [3, 0.3], [1.5, 0.8]].forEach(([w, a]) => {
        pl(a, w);
        ctx.beginPath();
        ctx.arc(cx, cy - 12, 6, Math.PI, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(cx - 5, cy - 12, 10, 8);
        ctx.stroke();
      });
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(150,80,255,0.8)';
      ctx.fillStyle = `rgba(180,120,255,${0.15 + p * 0.1})`;
      ctx.beginPath();
      ctx.arc(cx, cy + 5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default LockedBoxSymbol;
