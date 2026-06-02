import React from 'react';

const EarthSymbol = () => {
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
      const cx = S / 2, base = S * 0.85;
      // trunk
      [[6, 0.08], [3, 0.3], [1.2, 0.75]].forEach(([w, a]) => {
        ctx.strokeStyle = `rgba(160,200,255,${a})`;
        ctx.lineWidth = w; ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(120,170,255,0.8)';
        ctx.beginPath();
        ctx.moveTo(cx - 5, base);
        ctx.lineTo(cx - 4, S * 0.58);
        ctx.lineTo(cx + 4, S * 0.58);
        ctx.lineTo(cx + 5, base);
        ctx.stroke();
      });
      // roots
      [[-14, 12], [-8, 16], [0, 18], [8, 16], [14, 12]].forEach(([dx, dy]) => {
        [[3, 0.06], [1, 0.35]].forEach(([w, a]) => {
          ctx.strokeStyle = `rgba(160,200,255,${a})`;
          ctx.lineWidth = w; ctx.shadowBlur = w * 8;
          ctx.shadowColor = 'rgba(120,170,255,0.8)';
          ctx.beginPath();
          ctx.moveTo(cx, base);
          ctx.quadraticCurveTo(cx + dx * 0.5, base + 4, cx + dx, base + dy);
          ctx.stroke();
        });
      });
      // canopy layers
      [[S * 0.58, 32, 24], [S * 0.44, 26, 18], [S * 0.32, 20, 13]].forEach(([y, hw, h]) => {
        [[8, 0.06], [4, 0.18], [1.5, 0.6], [0.8, 0.9]].forEach(([w, a]) => {
          ctx.strokeStyle = `rgba(160,200,255,${a})`;
          ctx.lineWidth = w; ctx.shadowBlur = w * 8;
          ctx.shadowColor = 'rgba(120,170,255,0.8)';
          ctx.beginPath();
          ctx.moveTo(cx - hw, y + h);
          ctx.lineTo(cx, y);
          ctx.lineTo(cx + hw, y + h);
          ctx.stroke();
        });
      });
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default EarthSymbol;
