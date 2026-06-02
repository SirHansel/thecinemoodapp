import React from 'react';

const EyeSymbol = () => {
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
      const p = Math.sin(t * 0.7) * 0.5 + 0.5;
      [[8, 0.06], [4, 0.18], [1.5, 0.65], [0.8, 0.9]].forEach(([w, a]) => {
        ctx.strokeStyle = `rgba(220,175,80,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(200,150,50,0.8)';
        ctx.beginPath();
        ctx.moveTo(cx - 30, cy);
        ctx.quadraticCurveTo(cx, cy - 18, cx + 30, cy);
        ctx.quadraticCurveTo(cx, cy + 18, cx - 30, cy);
        ctx.stroke();
      });
      [[10, 0.08], [5, 0.2], [2, 0.6]].forEach(([w, a]) => {
        ctx.strokeStyle = `rgba(220,175,80,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(200,150,50,0.8)';
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(200,150,40,0.9)';
      ctx.fillStyle = `rgba(220,175,70,${0.7 + p * 0.25})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 3 + p * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default EyeSymbol;
