import React from 'react';

const RuinSymbol = () => {
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
      const p = Math.sin(t * 0.4) * 0.5 + 0.5;
      const ground = S * 0.82;
      function tl(a, w) {
        ctx.strokeStyle = `rgba(80,210,190,${a})`;
        ctx.lineWidth = w;
        ctx.shadowBlur = w * 6;
        ctx.shadowColor = 'rgba(60,190,170,0.7)';
      }
      tl(0.3, 0.8);
      ctx.beginPath();
      ctx.moveTo(8, ground); ctx.lineTo(S - 8, ground);
      ctx.stroke();
      [[6, 0.06], [3, 0.2], [1.2, 0.65], [0.7, 0.9]].forEach(([w, a]) => {
        tl(a, w);
        ctx.beginPath();
        ctx.moveTo(8, ground); ctx.lineTo(8, S * 0.28);
        ctx.lineTo(16, S * 0.28); ctx.lineTo(16, S * 0.22);
        ctx.lineTo(24, S * 0.22); ctx.lineTo(24, S * 0.3);
        ctx.lineTo(36, S * 0.3); ctx.lineTo(36, S * 0.18);
        ctx.lineTo(46, S * 0.18); ctx.lineTo(46, S * 0.35);
        ctx.lineTo(50, S * 0.42); ctx.lineTo(48, S * 0.5);
        ctx.lineTo(52, ground);
        ctx.stroke();
      });
      tl(0.4, 0.7);
      ctx.beginPath();
      ctx.moveTo(8, S * 0.55); ctx.lineTo(46, S * 0.55);
      ctx.stroke();
      [[8, 0.05], [4, 0.15], [1.5, 0.6], [0.8, 0.88]].forEach(([w, a]) => {
        tl(a, w);
        ctx.beginPath();
        ctx.moveTo(54, ground); ctx.lineTo(54, S * 0.3);
        ctx.arc(S / 2, S * 0.3, Math.max(1, S / 2 - 54), Math.PI, 0);

        ctx.lineTo(S - 54, ground);
        ctx.stroke();
      });
      [[4, 0.1], [1.2, 0.55], [0.7, 0.85]].forEach(([w, a]) => {
        tl(a, w);
        ctx.beginPath();
        ctx.moveTo(54, S * 0.3); ctx.lineTo(54, S * 0.15);
        ctx.lineTo(62, S * 0.15); ctx.lineTo(62, S * 0.1);
        ctx.lineTo(S - 62, S * 0.1); ctx.lineTo(S - 62, S * 0.15);
        ctx.lineTo(S - 54, S * 0.15); ctx.lineTo(S - 54, S * 0.3);
        ctx.stroke();
      });
      ctx.shadowBlur = 14;
      ctx.shadowColor = 'rgba(60,190,170,0.8)';
      ctx.fillStyle = `rgba(80,210,190,${0.08 + p * 0.06})`;
      ctx.beginPath();
      ctx.arc(S / 2, S * 0.3, Math.max(1, S / 2 - 58), Math.PI, 0);
      ctx.lineTo(S - 58, ground); ctx.lineTo(58, ground);
      ctx.fill();
      [[6, 0.06], [3, 0.2], [1.2, 0.65], [0.7, 0.9]].forEach(([w, a]) => {
        tl(a, w);
        ctx.beginPath();
        ctx.moveTo(S - 54, ground); ctx.lineTo(S - 54, S * 0.25);
        ctx.lineTo(S - 44, S * 0.25); ctx.lineTo(S - 44, S * 0.18);
        ctx.lineTo(S - 30, S * 0.18); ctx.lineTo(S - 30, S * 0.28);
        ctx.lineTo(S - 18, S * 0.28); ctx.lineTo(S - 18, S * 0.22);
        ctx.lineTo(S - 10, S * 0.22); ctx.lineTo(S - 10, ground);
        ctx.stroke();
      });
      tl(0.4, 0.7);
      ctx.beginPath();
      ctx.moveTo(S - 54, S * 0.5); ctx.lineTo(S - 10, S * 0.5);
      ctx.stroke();
      tl(0.5, 0.6);
      ctx.beginPath();
      ctx.moveTo(S - 36, S * 0.28); ctx.lineTo(S - 34, S * 0.38);
      ctx.lineTo(S - 37, S * 0.48);
      ctx.stroke();
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', margin: 'auto' }} />;
};

export default RuinSymbol;
