import React from 'react';

const AirSymbol = () => {
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
      for (let i = 0; i < 6; i++) {
        const y = cy - 20 + i * 8 + Math.sin(t * 0.4 + i) * 4;
        const xoff = Math.sin(t * 0.25 + i * 0.8) * 12;
        const len = 20 + Math.sin(t * 0.3 + i) * 10;
        const a = (0.25 + Math.sin(t * 0.5 + i) * 0.12) * 1.3;
        ctx.strokeStyle = `rgba(160,200,255,${a})`;
        ctx.lineWidth = 1.2; ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(120,170,255,0.8)';
        ctx.beginPath();
        ctx.moveTo(cx - len + xoff, y);
        ctx.quadraticCurveTo(cx + xoff, y - 3, cx + len + xoff, y);
        ctx.stroke();
      }
      for (let i = 0; i < 12; i++) {
        const px = 20 + ((t * 8 + i * 17) % 80);
        const py = 20 + i * 5 + Math.sin(t * 0.4 + i) * 6;
        const a = 0.3 + Math.sin(t + i) * 0.15;
        ctx.fillStyle = `rgba(180,215,255,${a})`;
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default AirSymbol;
