import React from 'react';

// themes: passion, energy, warmth, fire, vitality
// visualization: flowing flame-like particles with warm gradients

const WarmTonesAnimation = () => {
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;
    
    const NUM_EMBERS = 40;
    const embers = [];
    
    for (let i = 0; i < NUM_EMBERS; i++) {
      embers.push({
        x: Math.random() * W,
        y: H + Math.random() * 100,
        vy: -0.3 - Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 0.3,
        size: 1 + Math.random() * 3,
        life: Math.random(),
        heat: Math.random()
      });
    }
    
    function getWarmColor(heat, life) {
      const r = 255;
      const g = Math.floor(100 + heat * 120);
      const b = Math.floor(20 + heat * 40);
      const a = life * (0.5 + heat * 0.4);
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    
    function animate() {
      // Fade trail effect
      ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
      ctx.fillRect(0, 0, W, H);
      
      // ── SPEED CONTROL ─────────────────────
      t += 0.006;
      // ──────────────────────────────────────
      
      const flicker = Math.sin(t * 1.5) * 0.3 + 0.7;
      
      // Background warm glow
      const grad = ctx.createRadialGradient(W/2, H * 0.7, 0, W/2, H * 0.7, W * 0.6);
      grad.addColorStop(0, `rgba(255, 100, 30, ${0.15 * flicker})`);
      grad.addColorStop(0.5, `rgba(255, 150, 50, ${0.08 * flicker})`);
      grad.addColorStop(1, 'rgba(26, 26, 46, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      
      // Update and draw embers
      embers.forEach(ember => {
        ember.y += ember.vy;
        ember.x += ember.vx + Math.sin(t * 0.5 + ember.y * 0.01) * 0.2;
        ember.life -= 0.004;
        
        // Reset ember when it dies or leaves screen
        if (ember.life <= 0 || ember.y < -10) {
          ember.x = Math.random() * W;
          ember.y = H + Math.random() * 20;
          ember.life = 1;
          ember.heat = Math.random();
        }
        
        // Draw ember
        const size = ember.size * ember.life;
        ctx.fillStyle = getWarmColor(ember.heat, ember.life);
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow around ember
        if (ember.heat > 0.6) {
          const glowGrad = ctx.createRadialGradient(
            ember.x, ember.y, 0, 
            ember.x, ember.y, size * 4
          );
          glowGrad.addColorStop(0, `rgba(255, 180, 80, ${ember.life * 0.3})`);
          glowGrad.addColorStop(1, 'rgba(255, 100, 30, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(ember.x, ember.y, size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Heat waves at bottom
      for (let i = 0; i < 3; i++) {
        const waveY = H - 40 + i * 15;
        const wavePhase = t * 0.8 + i * 0.5;
        ctx.strokeStyle = `rgba(255, 120, 40, ${0.15 - i * 0.04})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 5) {
          const y = waveY + Math.sin(x * 0.02 + wavePhase) * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      animId = requestAnimationFrame(animate);
    }
    
    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  
  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default WarmTonesAnimation;
