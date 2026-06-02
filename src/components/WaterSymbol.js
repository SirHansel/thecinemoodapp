import React from 'react';

const WaterSymbol = () => {
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
      for (let i = 0; i < 5; i++) {
        const phase = (t * 0.6 + i * 0.65) % (Math.PI * 2);
        const r = 6 + i * 13 + Math.sin(phase) * 3;
        const a = (0.7 - i * 0.1) * 1.2;
        ctx.strokeStyle = `rgba(160,200,255,${a})`;
        ctx.lineWidth = 1.4;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(120,170,255,0.8)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.38, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let i = 0; i < 6; i++) {
        const wx = 22 + i * 11 + Math.sin(t * 0.8 + i) * 5;
        const wy = cy - 12 + Math.sin(t * 0.5 + i * 1.2) * 5;
        const a = 0.55 + Math.sin(t + i) * 0.25;
        ctx.strokeStyle = `rgba(160,200,255,${a})`;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(120,170,255,0.8)';
        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.lineTo(wx + 9, wy);
        ctx.stroke();
      }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
      g.addColorStop(0, 'rgba(180,220,255,0.2)');
      g.addColorStop(1, 'rgba(120,170,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default WaterSymbol;
