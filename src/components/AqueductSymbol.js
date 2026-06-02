import React from 'react';

const AqueductSymbol = () => {
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
      const base = S * 0.82, archH = 28, archW = 18;
      const arches = [[S * 0.22, base], [S * 0.5, base], [S * 0.78, base]];
      function tl(a, w) {
        ctx.strokeStyle = `rgba(80,210,190,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(60,190,170,0.8)';
      }
      tl(0.5, 0.8);
      ctx.beginPath();
      ctx.moveTo(8, base - archH - 10);
      ctx.lineTo(S - 8, base - archH - 10);
      ctx.stroke();
      tl(0.3, 0.5);
      ctx.beginPath();
      ctx.moveTo(8, base - archH - 6);
      ctx.lineTo(S - 8, base - archH - 6);
      ctx.stroke();
      arches.forEach(([cx, by]) => {
        [[8, 0.06], [4, 0.18], [1.5, 0.65], [0.8, 0.9]].forEach(([w, a]) => {
          tl(a, w);
          ctx.beginPath();
          ctx.moveTo(cx - archW, by);
          ctx.lineTo(cx - archW, by - archH * 0.5);
          ctx.quadraticCurveTo(cx - archW, by - archH, cx, by - archH - 6);
          ctx.quadraticCurveTo(cx + archW, by - archH, cx + archW, by - archH * 0.5);
          ctx.lineTo(cx + archW, by);
          ctx.stroke();
        });
      });
      tl(0.3, 0.8);
      ctx.beginPath();
      ctx.moveTo(8, base);
      ctx.lineTo(S - 8, base);
      ctx.stroke();
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(60,190,170,0.8)';
      ctx.fillStyle = `rgba(80,210,190,${0.3 + p * 0.2})`;
      ctx.beginPath();
      ctx.arc(S / 2, base - archH - 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default AqueductSymbol;
