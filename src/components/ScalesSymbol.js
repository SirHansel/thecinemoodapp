import React from 'react';

const ScalesSymbol = () => {
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
      const cx = S / 2, cy = S * 0.35;
      const tilt = Math.sin(t * 0.5) * 8;
      const p = Math.sin(t * 0.6) * 0.5 + 0.5;
      function al(a, w) {
        ctx.strokeStyle = `rgba(220,175,80,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(200,150,50,0.8)';
      }
      al(0.8, 1.2);
      ctx.beginPath();
      ctx.moveTo(cx - 32, cy + tilt * 0.5);
      ctx.lineTo(cx + 32, cy - tilt * 0.5);
      ctx.stroke();
      al(0.6, 1);
      ctx.beginPath();
      ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + 28);
      ctx.stroke();
      al(0.5, 1.2);
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy + 28); ctx.lineTo(cx + 12, cy + 28);
      ctx.stroke();
      const lx = cx - 32, ly = cy + tilt * 0.5;
      al(0.5, 0.8);
      ctx.beginPath();
      ctx.moveTo(lx, ly); ctx.lineTo(lx - 8, ly + 18);
      ctx.moveTo(lx, ly); ctx.lineTo(lx + 8, ly + 18);
      ctx.stroke();
      al(0.7, 1);
      ctx.beginPath();
      ctx.moveTo(lx - 10, ly + 18); ctx.lineTo(lx + 10, ly + 18);
      ctx.stroke();
      const rx = cx + 32, ry = cy - tilt * 0.5;
      al(0.5, 0.8);
      ctx.beginPath();
      ctx.moveTo(rx, ry); ctx.lineTo(rx - 8, ry + 18);
      ctx.moveTo(rx, ry); ctx.lineTo(rx + 8, ry + 18);
      ctx.stroke();
      al(0.7, 1);
      ctx.beginPath();
      ctx.moveTo(rx - 10, ry + 18); ctx.lineTo(rx + 10, ry + 18);
      ctx.stroke();
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(200,150,50,0.8)';
      ctx.fillStyle = `rgba(220,175,70,${0.6 + p * 0.3})`;
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

export default ScalesSymbol;
