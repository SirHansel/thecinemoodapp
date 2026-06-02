import React from 'react';

const HourglassSymbol = () => {
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
      const flow = (t * 0.4) % 1;
      [[8, 0.06], [4, 0.18], [1.5, 0.65], [0.8, 0.9]].forEach(([w, a]) => {
        ctx.strokeStyle = `rgba(220,175,80,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(200,150,50,0.8)';
        ctx.beginPath();
        ctx.moveTo(cx - 22, cy - 30); ctx.lineTo(cx + 22, cy - 30);
        ctx.lineTo(cx + 2, cy); ctx.lineTo(cx + 22, cy + 30);
        ctx.lineTo(cx - 22, cy + 30); ctx.lineTo(cx - 2, cy);
        ctx.closePath();
        ctx.stroke();
      });
      const sy = cy - 28 + flow * 56;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(200,150,50,0.9)';
      ctx.fillStyle = 'rgba(220,180,70,0.8)';
      ctx.beginPath();
      ctx.arc(cx, sy, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 6;
      ctx.fillStyle = 'rgba(200,160,60,0.3)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 24, 12 * flow, 3 * flow, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(200,160,60,0.25)';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 24, 12 * (1 - flow), 3 * (1 - flow), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default HourglassSymbol;
