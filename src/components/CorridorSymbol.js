import React from 'react';

const CorridorSymbol = () => {
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
      const p = Math.sin(t * 0.5) * 0.5 + 0.5;
      const cx = S / 2, cy = S / 2;
      function tl(a, w) {
        ctx.strokeStyle = `rgba(80,210,190,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(60,190,170,0.8)';
      }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 35);
      g.addColorStop(0, `rgba(80,210,190,${0.18 + p * 0.1})`);
      g.addColorStop(1, 'rgba(60,180,160,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      [[12, 0.05], [6, 0.15], [2, 0.55], [1, 0.85]].forEach(([w, a]) => {
        tl(a, w);
        ctx.beginPath();
        ctx.moveTo(8, S - 12);
        ctx.lineTo(8, 30);
        ctx.arc(cx, 30, cx - 8, Math.PI, 0);
        ctx.lineTo(S - 8, S - 12);
        ctx.stroke();
      });
      [[8, 0.04], [4, 0.12], [1.5, 0.5], [0.8, 0.8]].forEach(([w, a]) => {
        tl(a, w);
        ctx.beginPath();
        ctx.moveTo(22, S - 12);
        ctx.lineTo(22, 36);
        ctx.arc(cx, 36, cx - 22, Math.PI, 0);
        ctx.lineTo(S - 22, S - 12);
        ctx.stroke();
      });
      [[8, S - 12], [22, S - 12], [S - 8, S - 12], [S - 22, S - 12]].forEach(([fx, fy]) => {
        tl(0.25, 0.7);
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(cx, cy + 5);
        ctx.stroke();
      });
      tl(0.3, 0.8);
      ctx.beginPath();
      ctx.moveTo(8, S - 12);
      ctx.lineTo(S - 8, S - 12);
      ctx.stroke();
      tl(0.3, 0.7);
      ctx.beginPath();
      ctx.moveTo(8, 30); ctx.lineTo(22, 36);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(S - 8, 30); ctx.lineTo(S - 22, 36);
      ctx.stroke();
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(60,190,170,1)';
      ctx.fillStyle = `rgba(80,220,200,${0.55 + p * 0.35})`;
      ctx.beginPath();
      ctx.arc(cx, cy + 5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default CorridorSymbol;
