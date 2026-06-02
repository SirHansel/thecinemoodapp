import React from 'react';

const CompassRoseSymbol = () => {
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
      const rot = t * 0.1;
      const p = Math.sin(t * 0.6) * 0.5 + 0.5;
      [0, Math.PI / 2, Math.PI, Math.PI * 3 / 2].forEach((a, i) => {
        const len = i % 2 === 0 ? 28 : 18;
        const bright = i === 0 ? 1 : 0.6;
        [[8, 0.06], [4, 0.15], [1.5, 0.6 * bright], [0.8, 0.9 * bright]].forEach(([w, al]) => {
          ctx.strokeStyle = `rgba(220,175,80,${al})`;
          ctx.lineWidth = w;
          ctx.shadowBlur = w * 8;
          ctx.shadowColor = 'rgba(200,150,50,0.8)';
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(a + rot) * len, cy + Math.sin(a + rot) * len);
          ctx.stroke();
        });
      });
      ctx.strokeStyle = 'rgba(220,175,80,0.4)';
      ctx.lineWidth = 0.8;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(200,150,50,0.8)';
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(200,150,50,0.9)';
      ctx.fillStyle = `rgba(220,180,70,${0.7 + p * 0.25})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default CompassRoseSymbol;
