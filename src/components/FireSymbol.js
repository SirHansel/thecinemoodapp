import React from 'react';

const FireSymbol = () => {
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
      const p = Math.sin(t) * 0.5 + 0.5;
      const cx = S / 2, base = S * 0.8;
      const flick = Math.sin(t * 3.1) * 0.5 + Math.sin(t * 5.7) * 0.25;
      function drawFlame(scale, alpha) {
        const fh = S * 0.55 * scale + p * S * 0.05 * scale;
        const fw = S * 0.2 * scale;
        [[10 * scale, 0.08 * alpha], [5 * scale, 0.25 * alpha], [2 * scale, 0.7 * alpha], [1, 0.95 * alpha]].forEach(([w, a]) => {
          ctx.strokeStyle = `rgba(160,200,255,${a})`;
          ctx.lineWidth = w;
          ctx.shadowBlur = w * 8;
          ctx.shadowColor = 'rgba(120,170,255,0.8)';
          ctx.beginPath();
          ctx.moveTo(cx, base);
          ctx.bezierCurveTo(cx + fw, base - fh * 0.3, cx + fw * 0.5, base - fh * 0.75, cx + flick * 3 * scale, base - fh);
          ctx.bezierCurveTo(cx - fw * 0.5, base - fh * 0.75, cx - fw, base - fh * 0.3, cx, base);
          ctx.stroke();
        });
      }
      drawFlame(1, 1);
      drawFlame(0.5, 1.2);
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default FireSymbol;
