import React from 'react';

const ThresholdSymbol = () => {
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
      const cx = S / 2, p = Math.sin(t * 0.5) * 0.5 + 0.5;
      const top = S * 0.15, bot = S * 0.85, w = 20;
      const g = ctx.createRadialGradient(cx, top + 15, 0, cx, S / 2, 28);
      g.addColorStop(0, `rgba(80,210,190,${0.12 + p * 0.06})`);
      g.addColorStop(1, 'rgba(60,180,160,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      [[8, 0.06], [4, 0.18], [1.5, 0.65], [0.8, 0.9]].forEach(([ww, a]) => {
        ctx.strokeStyle = `rgba(80,210,190,${a})`;
        ctx.lineWidth = ww;
        ctx.shadowBlur = ww * 8;
        ctx.shadowColor = 'rgba(60,190,170,0.8)';
        ctx.beginPath();
        ctx.moveTo(cx - w, bot);
        ctx.lineTo(cx - w, top + w);
        ctx.arc(cx, top + w, w, Math.PI, 0);
        ctx.lineTo(cx + w, bot);
        ctx.stroke();
      });
      ctx.strokeStyle = 'rgba(80,210,190,0.4)';
      ctx.lineWidth = 0.8;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(60,190,170,0.8)';
      ctx.beginPath();
      ctx.moveTo(cx - w, bot);
      ctx.lineTo(cx + w, bot);
      ctx.stroke();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default ThresholdSymbol;
