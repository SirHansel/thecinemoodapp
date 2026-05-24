import React from 'react';

// themes: connection through service, warmth of being needed, mutual care
// visualization: orbiting particles that occasionally connect and pulse, representing support

const HelpSomeoneAnimation = () => {
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;
    
    const NUM_HELPERS = 12;
    const helpers = [];
    
    for (let i = 0; i < NUM_HELPERS; i++) {
      helpers.push({
        angle: (Math.PI * 2 * i) / NUM_HELPERS,
        speed: 0.008 + Math.random() * 0.004,
        radius: 60 + Math.random() * 40,
        size: 2 + Math.random() * 2,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
    
    function drawConnection(x1, y1, x2, y2, strength) {
      ctx.strokeStyle = `rgba(200, 150, 220, ${strength * 0.3})`;
      ctx.lineWidth = strength * 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      
      // ── SPEED CONTROL ─────────────────────
      t += 0.006;
      // ──────────────────────────────────────
      
      const centerX = W / 2;
      const centerY = H / 2;
      
      // Center core - represents the collective warmth
      const coreBreath = Math.sin(t * 0.5) * 0.5 + 0.5;
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20 + coreBreath * 10);
      coreGrad.addColorStop(0, `rgba(255, 200, 150, ${0.4 + coreBreath * 0.2})`);
      coreGrad.addColorStop(1, 'rgba(200, 150, 220, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20 + coreBreath * 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Update and draw helpers
      const positions = [];
      helpers.forEach(h => {
        h.angle += h.speed;
        const x = centerX + Math.cos(h.angle) * h.radius;
        const y = centerY + Math.sin(h.angle) * h.radius;
        positions.push({ x, y, helper: h });
        
        const pulse = Math.sin(t * 0.7 + h.pulsePhase) * 0.5 + 0.5;
        const alpha = 0.5 + pulse * 0.4;
        
        // Draw helper particle
        ctx.fillStyle = `rgba(200, 180, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, h.size + pulse * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow around helper
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 12);
        glow.addColorStop(0, `rgba(255, 220, 180, ${pulse * 0.3})`);
        glow.addColorStop(1, 'rgba(255, 220, 180, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw connections between nearby helpers
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 80) {
            const strength = 1 - (dist / 80);
            const connectionPulse = Math.sin(t * 0.8 + i + j) * 0.5 + 0.5;
            drawConnection(
              positions[i].x, 
              positions[i].y, 
              positions[j].x, 
              positions[j].y, 
              strength * connectionPulse
            );
          }
        }
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

export default HelpSomeoneAnimation;
