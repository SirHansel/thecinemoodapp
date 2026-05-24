import React from 'react';

// themes: harshness, endurance, texture, permanence
// visualization: angular jagged shapes, slow heavy rotation, rough edges

const RoughStoneAnimation = () => {
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;
    
    const NUM_STONES = 8;
    const stones = [];
    
    // Create jagged stone shapes
    for (let i = 0; i < NUM_STONES; i++) {
      const numPoints = 6 + Math.floor(Math.random() * 4); // 6-9 points
      const points = [];
      const baseRadius = 20 + Math.random() * 30;
      
      for (let j = 0; j < numPoints; j++) {
        const angle = (Math.PI * 2 * j) / numPoints;
        const radiusVariation = 0.6 + Math.random() * 0.8; // jagged variation
        const r = baseRadius * radiusVariation;
        points.push({
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r
        });
      }
      
      stones.push({
        x: 80 + Math.random() * 140,
        y: 80 + Math.random() * 140,
        points: points,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.003,
        vx: (Math.random() - 0.5) * 0.1,  // velocity x
        vy: (Math.random() - 0.5) * 0.1,  // velocity y
        maxRadius: baseRadius,  // for edge detection
        opacity: 0.3 + Math.random() * 0.4,
        gray: 100 + Math.floor(Math.random() * 100)
      });
    }
    
    function drawStone(stone) {
      ctx.save();
      ctx.translate(stone.x, stone.y);
      ctx.rotate(stone.rotation);
      
      // Draw jagged polygon
      ctx.beginPath();
      ctx.moveTo(stone.points[0].x, stone.points[0].y);
      for (let i = 1; i < stone.points.length; i++) {
        ctx.lineTo(stone.points[i].x, stone.points[i].y);
      }
      ctx.closePath();
      
      // Fill with gray
      ctx.fillStyle = `rgba(${stone.gray}, ${stone.gray}, ${stone.gray}, ${stone.opacity})`;
      ctx.fill();
      
      // Stroke for sharp edges
      ctx.strokeStyle = `rgba(${stone.gray + 40}, ${stone.gray + 40}, ${stone.gray + 40}, ${stone.opacity * 0.8})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.restore();
    }
    
    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      
      // ── SPEED CONTROL ─────────────────────
      t += 0.006;
      // ──────────────────────────────────────
      
      // Subtle background texture
      for (let i = 0; i < 3; i++) {
        const offset = Math.sin(t * 0.3 + i) * 20;
        ctx.strokeStyle = `rgba(80, 80, 80, ${0.05 - i * 0.015})`;
        ctx.lineWidth = 40;
        ctx.beginPath();
        ctx.moveTo(0, 100 + i * 80 + offset);
        ctx.lineTo(W, 100 + i * 80 + offset);
        ctx.stroke();
      }
      
      // Update and draw stones
      stones.forEach(stone => {
        // Slow rotation
        stone.rotation += stone.rotationSpeed;
        
        // Update position
        stone.x += stone.vx;
        stone.y += stone.vy;
        
        // Bounce off edges
        const margin = stone.maxRadius;
        if (stone.x - margin < 0) {
          stone.x = margin;
          stone.vx *= -1;
        }
        if (stone.x + margin > W) {
          stone.x = W - margin;
          stone.vx *= -1;
        }
        if (stone.y - margin < 0) {
          stone.y = margin;
          stone.vy *= -1;
        }
        if (stone.y + margin > H) {
          stone.y = H - margin;
          stone.vy *= -1;
        }
        
        drawStone(stone);
      });
      
      // Overlay grit texture (small angular marks)
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        const angle = Math.random() * Math.PI;
        const len = 3 + Math.random() * 5;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
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

export default RoughStoneAnimation;
