import React from 'react';

const LabyrinthSymbol = () => {
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
      [28, 22, 16, 10, 5].forEach((r, i) => {
        const gap = Math.PI * 0.35 + i * 0.1;
        const rot = t * 0.08 * (i % 2 === 0 ? 1 : -1);
        const a = 0.4 + i * 0.1;
        ctx.strokeStyle = `rgba(220,175,80,${a})`;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(200,150,50,0.8)';
        ctx.beginPath();
        ctx.arc(cx, cy, r, gap + rot, Math.PI * 2 - gap + rot);
        ctx.stroke();
      });
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(200,150,50,0.8)';
      ctx.fillStyle = `rgba(220,180,80,${0.6 + p * 0.3})`;
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

export default LabyrinthSymbol;
