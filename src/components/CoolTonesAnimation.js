import React from 'react';

// themes: distance, mystery, calm, depth
// visualization: drifting particles in blues/purples, gentle waves, misty depth

const CoolTonesAnimation = () => {
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;
    
    const NUM_PARTICLES = 35;
    const particles = [];
    
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 2 + Math.random() * 4,
        depth: Math.random(),
        phase: Math.random() * Math.PI * 2
      });
    }
    
    function getCoolColor(depth, alpha) {
      const r = Math.floor(80 + depth * 100);
      const g = Math.floor(100 + depth * 120);
      const b = Math.floor(200 + depth * 55);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      
      // ── SPEED CONTROL ─────────────────────
      t += 0.006;
      // ──────────────────────────────────────
      
      // Deep background glow
      const bgGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.7);
      bgGrad.addColorStop(0, 'rgba(60, 80, 150, 0.1)');
      bgGrad.addColorStop(1, 'rgba(26, 26, 46, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);
      
      // Horizontal waves (like water ripples)
      for (let i = 0; i < 4; i++) {
        const waveY = 60 + i * 60;
        const wavePhase = t * 0.3 + i * 0.8;
        ctx.strokeStyle = `rgba(100, 150, 220, ${0.08 - i * 0.015})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const y = waveY + Math.sin(x * 0.015 + wavePhase) * 12;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      // Drifting particles
      particles.forEach(p => {
        p.x += p.vx + Math.sin(t * 0.2 + p.phase) * 0.15;
        p.y += p.vy + Math.cos(t * 0.15 + p.phase) * 0.15;
        
        // Wrap around edges
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        
        const pulse = Math.sin(t * 0.6 + p.phase) * 0.3 + 0.7;
        const alpha = (0.3 + p.depth * 0.4) * pulse;
        
        // Draw particle
        ctx.fillStyle = getCoolColor(p.depth, alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Soft glow
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        glowGrad.addColorStop(0, getCoolColor(p.depth, alpha * 0.3));
        glowGrad.addColorStop(1, 'rgba(100, 150, 220, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animId = requestAnimationFrame(animate);
    }
    
    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  
  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default CoolTonesAnimation;
