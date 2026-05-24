import React from 'react';

// themes: ease, growth, lightness, nature, hope
// visualization: floating bubbles/seeds in soft yellows/greens, gentle organic drift

const SoftTonesAnimation = () => {
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;
    
    const NUM_BUBBLES = 25;
    const bubbles = [];
    
    for (let i = 0; i < NUM_BUBBLES; i++) {
      bubbles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vy: -0.2 - Math.random() * 0.3,
        vx: (Math.random() - 0.5) * 0.2,
        size: 3 + Math.random() * 6,
        hue: Math.random() > 0.5 ? 'yellow' : 'green',
        phase: Math.random() * Math.PI * 2,
        wobble: Math.random() * 0.5 + 0.3
      });
    }
    
    function getSoftColor(hue, alpha) {
      if (hue === 'yellow') {
        return `rgba(255, 240, 150, ${alpha})`;
      } else {
        return `rgba(180, 230, 150, ${alpha})`;
      }
    }
    
    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      
      // ── SPEED CONTROL ─────────────────────
      t += 0.006;
      // ──────────────────────────────────────
      
      // Soft ambient glow
      const ambientGrad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.8);
      ambientGrad.addColorStop(0, 'rgba(200, 220, 150, 0.06)');
      ambientGrad.addColorStop(1, 'rgba(26, 26, 46, 0)');
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, W, H);
      
      // Update and draw bubbles
      bubbles.forEach(bubble => {
        bubble.y += bubble.vy;
        bubble.x += bubble.vx + Math.sin(t * bubble.wobble + bubble.phase) * 0.3;
        
        // Reset when bubble floats off top
        if (bubble.y < -bubble.size) {
          bubble.y = H + bubble.size;
          bubble.x = Math.random() * W;
        }
        
        const breathe = Math.sin(t * 0.8 + bubble.phase) * 0.5 + 0.5;
        const size = bubble.size * (0.8 + breathe * 0.2);
        const alpha = 0.4 + breathe * 0.3;
        
        // Draw bubble
        const bubbleGrad = ctx.createRadialGradient(
          bubble.x - size * 0.3, 
          bubble.y - size * 0.3, 
          0,
          bubble.x, 
          bubble.y, 
          size
        );
        bubbleGrad.addColorStop(0, getSoftColor(bubble.hue, alpha * 0.8));
        bubbleGrad.addColorStop(0.7, getSoftColor(bubble.hue, alpha * 0.4));
        bubbleGrad.addColorStop(1, getSoftColor(bubble.hue, 0));
        
        ctx.fillStyle = bubbleGrad;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight (makes it look more bubble-like)
        ctx.fillStyle = `rgba(255, 255, 240, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(bubble.x - size * 0.3, bubble.y - size * 0.3, size * 0.3, 0, Math.PI * 2);
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

export default SoftTonesAnimation;
