import React from 'react';

const BrokenClockSymbol = () => {
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
        ctx.arc(cx, cy, 28, 0, Math.PI * 2);
        ctx.stroke();
      });
      const markers = [
        { a: -Math.PI / 2, label: '12', tx: cx, ty: cy - 20 },
        { a: 0, label: '3', tx: cx + 21, ty: cy + 1 },
        { a: Math.PI / 2, label: '6', tx: cx, ty: cy + 22 },
        { a: Math.PI, label: '9', tx: cx - 21, ty: cy + 1 },
      ];
      markers.forEach(({ a, label, tx, ty }) => {
        pl(0.7, 1.2);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * 28, cy + Math.sin(a) * 28);
        ctx.lineTo(cx + Math.cos(a) * 22, cy + Math.sin(a) * 22);
        ctx.stroke();
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(150,80,255,0.6)';
        ctx.fillStyle = 'rgba(180,120,255,0.85)';
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, tx, ty);
      });
      pl(0.9, 1.8);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 10, cy - 16);
      ctx.stroke();
      pl(0.7, 1.2);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 7, cy + 13);
      ctx.stroke();
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(150,80,255,0.9)';
      ctx.fillStyle = 'rgba(180,120,255,0.9)';
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();
      pl(0.5, 0.8);
      ctx.beginPath();
      ctx.moveTo(cx + 10, cy - 24);
      ctx.lineTo(cx + 17, cy - 10);
      ctx.lineTo(cx + 11, cy + 2);
      ctx.lineTo(cx + 19, cy + 14);
      ctx.stroke();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default BrokenClockSymbol;
