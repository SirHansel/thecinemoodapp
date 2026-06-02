import React from 'react';

const UnlitCandleSymbol = () => {
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
      const cx = S / 2;
      const p = Math.sin(t * 0.6) * 0.5 + 0.5;
      const base = S * 0.82, top = S * 0.28, cw = 10;
      function pl(a, w) {
        ctx.strokeStyle = `rgba(180,120,255,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(150,80,255,0.8)';
      }
      [[8, 0.06], [4, 0.18], [1.5, 0.65], [0.8, 0.9]].forEach(([w, a]) => {
        pl(a, w);
        ctx.beginPath();
        ctx.rect(cx - cw, top, cw * 2, base - top);
        ctx.stroke();
      });
      // wax drip
      pl(0.5, 1);
      ctx.beginPath();
      ctx.moveTo(cx + cw, top + 15);
      ctx.quadraticCurveTo(cx + cw + 4, top + 25, cx + cw + 2, top + 35);
      ctx.stroke();
      // wick
      pl(0.3, 1);
      ctx.beginPath();
      ctx.moveTo(cx, top);
      ctx.lineTo(cx + 2, top - 10);
      ctx.stroke();
      // unlit glow - very dim
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(150,80,255,0.4)';
      ctx.fillStyle = `rgba(160,100,220,${0.15 + p * 0.1})`;
      ctx.beginPath();
      ctx.arc(cx + 1, top - 10, 3, 0, Math.PI * 2);
      ctx.fill();
      // base plate
      pl(0.4, 0.8);
      ctx.beginPath();
      ctx.moveTo(cx - cw - 5, base);
      ctx.lineTo(cx + cw + 5, base);
      ctx.stroke();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default UnlitCandleSymbol;
