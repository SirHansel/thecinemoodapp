import React from 'react';

const HallwaySymbol = () => {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const S = 100;
    let t = 0;
    let animId = null;
    function tl(a, w) {
      ctx.strokeStyle = `rgba(80,210,190,${a})`;
      ctx.lineWidth = w;
      ctx.shadowBlur = w * 8;
      ctx.shadowColor = 'rgba(60,190,170,0.8)';
    }
    function draw() {
      ctx.fillStyle = '#0a0a18';
      ctx.fillRect(0, 0, S, S);
      t += 0.02;
      const p = Math.sin(t * 0.5) * 0.5 + 0.5;
      const cx = S * 0.38;
      const top = S * 0.15, bot = S * 0.85, w = 20;

      const g = ctx.createRadialGradient(cx, top + 15, 0, cx, S / 2, 28);
      g.addColorStop(0, `rgba(80,210,190,${0.12 + p * 0.06})`);
      g.addColorStop(1, 'rgba(60,180,160,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);

      [[8, 0.06], [4, 0.18], [1.5, 0.65], [0.8, 0.9]].forEach(([ww, a]) => {
        tl(a, ww);
        ctx.beginPath();
        ctx.moveTo(cx - w, bot);
        ctx.lineTo(cx - w, top + w);
        ctx.arc(cx, top + w, w, Math.PI, 0);
        ctx.lineTo(cx + w, bot);
        ctx.stroke();
      });

      tl(0.4, 0.8);
      ctx.beginPath();
      ctx.moveTo(cx - w, bot); ctx.lineTo(cx + w, bot);
      ctx.stroke();

      const farX = S - 6, farY = S * 0.42;
      [[cx + w, bot, 0.35], [cx + w, top + w, 0.25]].forEach(([fx, fy, a]) => {
        tl(a, 0.8);
        ctx.beginPath();
        ctx.moveTo(fx, fy); ctx.lineTo(farX, farY);
        ctx.stroke();
      });

      tl(0.3, 0.7);
      ctx.beginPath();
      ctx.moveTo(cx + w, bot); ctx.lineTo(farX, farY);
      ctx.stroke();

      tl(0.25, 0.6);
      ctx.beginPath();
      ctx.moveTo(cx - w, bot);
      ctx.lineTo(farX, bot - (bot - farY) * 0.3);
      ctx.stroke();

      ctx.shadowBlur = 14;
      ctx.shadowColor = 'rgba(60,190,170,0.9)';
      ctx.fillStyle = `rgba(80,220,200,${0.45 + p * 0.3})`;
      ctx.beginPath();
      ctx.arc(farX, farY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default HallwaySymbol;
