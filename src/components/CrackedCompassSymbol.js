import React from 'react';

const CrackedCompassSymbol = () => {
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
      const p = Math.sin(t * 0.5) * 0.5 + 0.5;
      function pl(a, w) {
        ctx.strokeStyle = `rgba(180,120,255,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(150,80,255,0.8)';
      }
      [[12, 0.06], [7, 0.18], [3, 0.5], [1.5, 0.85]].forEach(([w, a]) => {
        pl(a, w);
        ctx.beginPath();
        ctx.arc(cx, cy, 26, 0, Math.PI * 2);
        ctx.stroke();
      });
      // cardinal marks
      [0, Math.PI / 2, Math.PI, Math.PI * 3 / 2].forEach(a => {
        pl(0.5, 0.8);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 26, cy + Math.sin(a) * 26);
        ctx.lineTo(cx + Math.cos(a) * 20, cy + Math.sin(a) * 20);
        ctx.stroke();
      });
      // needle pointing wrong direction
      pl(0.9, 1.5);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(0.8) * 20, cy + Math.sin(0.8) * 20);
      ctx.stroke();
      pl(0.4, 1);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(0.8 + Math.PI) * 14, cy + Math.sin(0.8 + Math.PI) * 14);
      ctx.stroke();
      // crack
      pl(0.5, 0.8);
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy - 18);
      ctx.lineTo(cx - 5, cy - 5);
      ctx.lineTo(cx + 8, cy + 18);
      ctx.stroke();
      // center pin
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(150,80,255,0.9)';
      ctx.fillStyle = `rgba(180,120,255,${0.7 + p * 0.25})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default CrackedCompassSymbol;
