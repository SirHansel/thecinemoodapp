import React from 'react';

// themes: what surrounds us shapes us, atmosphere as emotional state, the sky we carry inside
// visualization: Atmospheric layers drift and part, revealing light beneath — the weather we choose reflects the weather within

const WeatherAnimation = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    function cloudForm(cx, cy, rx, ry, alpha, speed, phase, wobble) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(160, 185, 215, ${alpha})`;
      ctx.lineWidth = 0.9;
      const pts = 140;
      for (let i = 0; i <= pts; i++) {
        const a = (i / pts) * Math.PI * 2;
        let rx2 = rx + wobble * Math.sin(a * 4 + t * speed + phase);
        rx2 += wobble * 0.5 * Math.cos(a * 7 - t * speed * 0.8 + phase * 1.3);
        rx2 += wobble * 0.3 * Math.sin(a * 11 + t * speed * 0.5);
        let ry2 = ry + wobble * 0.4 * Math.cos(a * 3 + t * speed * 0.6 + phase);
        ry2 += wobble * 0.2 * Math.sin(a * 6 - phase);
        const x = cx + Math.cos(a) * rx2;
        const y = cy + Math.sin(a) * ry2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    function softBreak(cx, cy, rx, ry, alpha) {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
      grad.addColorStop(0, `rgba(240, 238, 230, ${alpha})`);
      grad.addColorStop(0.5, `rgba(220, 218, 210, ${alpha * 0.4})`);
      grad.addColorStop(1, 'rgba(240, 238, 230, 0)');
      ctx.save();
      ctx.scale(1, ry / rx);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy * (rx / ry), rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      t += 0.003;
      const bAlpha = (Math.sin(t * 0.35) * 0.5 + 0.5) * 0.12;
      softBreak(W/2 + Math.sin(t*0.25)*25, H/2 + Math.cos(t*0.18)*12, 70, 28, bAlpha);
      const clouds = [
        { cx: W/2+Math.sin(t*0.12)*22, cy: H/2+Math.cos(t*0.09)*10, rx: 120, ry: 38, alpha: 0.10, speed: 0.6, phase: 0, w: 14 },
        { cx: W/2+Math.sin(t*0.15+1)*18, cy: H/2+Math.cos(t*0.11+1)*8, rx: 105, ry: 32, alpha: 0.13, speed: 0.7, phase: 1.0, w: 12 },
        { cx: W/2+Math.sin(t*0.18+2)*15, cy: H/2+Math.cos(t*0.13+2)*7, rx: 88, ry: 27, alpha: 0.16, speed: 0.8, phase: 2.1, w: 11 },
        { cx: W/2+Math.sin(t*0.21+3)*13, cy: H/2+Math.cos(t*0.16+3)*6, rx: 73, ry: 22, alpha: 0.20, speed: 0.9, phase: 3.2, w: 10 },
        { cx: W/2+Math.sin(t*0.24+4)*11, cy: H/2+Math.cos(t*0.19+4)*5, rx: 58, ry: 18, alpha: 0.24, speed: 1.0, phase: 4.3, w: 9 },
        { cx: W/2+Math.sin(t*0.27+5)*9, cy: H/2+Math.cos(t*0.22+5)*5, rx: 45, ry: 14, alpha: 0.30, speed: 1.1, phase: 5.4, w: 8 },
        { cx: W/2+Math.sin(t*0.30+6)*7, cy: H/2+Math.cos(t*0.25+6)*4, rx: 33, ry: 11, alpha: 0.36, speed: 1.2, phase: 0.5, w: 7 },
        { cx: W/2+Math.sin(t*0.33+7)*5, cy: H/2+Math.cos(t*0.28+7)*3, rx: 22, ry: 8, alpha: 0.42, speed: 1.3, phase: 1.6, w: 6 },
      ];
      clouds.forEach(c => cloudForm(c.cx, c.cy, c.rx, c.ry, c.alpha, c.speed, c.phase, c.w));
      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default WeatherAnimation;
