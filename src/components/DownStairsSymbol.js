import React from 'react';

const DownStairsSymbol = () => {
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
      const steps = [
        { x: 12, y: 82, w: 32, h: 10 },
        { x: 24, y: 72, w: 28, h: 10 },
        { x: 36, y: 62, w: 24, h: 10 },
        { x: 46, y: 52, w: 20, h: 10 },
        { x: 56, y: 42, w: 16, h: 10 },
        { x: 64, y: 32, w: 13, h: 10 },
      ];
      steps.forEach((s, i) => {
        const my = S - s.y - s.h;
        const a = 0.4 + (steps.length - 1 - i) * 0.08;
        [[6, 0.06], [3, 0.15], [1.2, 0.55], [0.7, a]].forEach(([w, al]) => {
          tl(al, w);
          ctx.beginPath();
          ctx.moveTo(s.x, my + s.h); ctx.lineTo(s.x + s.w, my + s.h);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(s.x, my); ctx.lineTo(s.x, my + s.h);
          ctx.stroke();
        });
      });
      tl(0.4, 0.8);
      ctx.beginPath();
      ctx.moveTo(12, 8); ctx.lineTo(44, 8);
      ctx.stroke();
      tl(0.3, 0.7);
      ctx.beginPath();
      ctx.moveTo(44, 8); ctx.lineTo(44, 18);
      ctx.stroke();
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(60,190,170,0.9)';
      ctx.fillStyle = `rgba(80,220,200,${0.3 + p * 0.25})`;
      ctx.beginPath();
      ctx.arc(72, 72, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default DownStairsSymbol;
