import React from 'react';

const TowerSymbol = () => {
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
      const base = S * 0.88, top = S * 0.1, hw = 13;
      function tl(a, w) {
        ctx.strokeStyle = `rgba(80,210,190,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 8;
        ctx.shadowColor = 'rgba(60,190,170,0.8)';
      }
      [[8, 0.06], [4, 0.18], [1.5, 0.65], [0.8, 0.9]].forEach(([w, a]) => {
        tl(a, w);
        ctx.beginPath();
        ctx.moveTo(cx - hw, base);
        ctx.lineTo(cx - hw, top + 8);
        ctx.lineTo(cx, top);
        ctx.lineTo(cx + hw, top + 8);
        ctx.lineTo(cx + hw, base);
        ctx.stroke();
      });
      [[-8, -3, 3], [0, -6, 3], [8, -3, 3]].forEach(([dx, dy, w]) => {
        tl(0.6, 0.8);
        ctx.beginPath();
        ctx.rect(cx + dx - w / 2, top + 8 + dy, w, 6);
        ctx.stroke();
      });
      [[cx, S * 0.4], [cx, S * 0.56], [cx, S * 0.7]].forEach(([wx, wy]) => {
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(60,190,170,0.8)';
        ctx.fillStyle = `rgba(80,210,190,${0.2 + p * 0.2})`;
        ctx.fillRect(wx - 3, wy - 4, 6, 7);
      });
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default TowerSymbol;
