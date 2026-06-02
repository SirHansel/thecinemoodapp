import React from 'react';

const OuroborosSymbol = () => {
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
      const cx = S / 2, cy = S / 2, r = 26;
      const p = Math.sin(t * 0.6) * 0.5 + 0.5;
      [[8, 0.06], [4, 0.18], [1.5, 0.65], [0.8, 0.9]].forEach(([w, a]) => {
        ctx.strokeStyle = `rgba(220,175,80,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(200,150,50,0.8)';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0.5, Math.PI * 2 + 0.2);
        ctx.stroke();
      });
      const headAngle = 0.18;
      const hx = cx + Math.cos(headAngle) * r;
      const hy = cy + Math.sin(headAngle) * r;
      const hdir = headAngle + Math.PI / 2;
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(hdir + Math.PI);
      ctx.fillStyle = 'rgba(180,130,40,0.7)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(200,150,50,0.8)';
      ctx.strokeStyle = 'rgba(220,175,80,0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, -6, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(220,180,60,1)';
      ctx.fillStyle = `rgba(240,200,80,${0.8 + p * 0.2})`;
      ctx.beginPath();
      ctx.arc(3, -1, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(220,175,80,0.7)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -9); ctx.lineTo(-2, -13);
      ctx.moveTo(0, -9); ctx.lineTo(2, -13);
      ctx.stroke();
      ctx.restore();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default OuroborosSymbol;
