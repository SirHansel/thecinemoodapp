import React from 'react';

// themes: clarity, drama, simplicity, tension
// visualization: sharp geometric shapes, black/white tiles shifting, clean lines

const ContrastTonesAnimation = () => {
  const canvasRef = React.useRef(null);
  
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;
    
    const GRID_SIZE = 6;
    const CELL_SIZE = W / GRID_SIZE;
    
    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      
      // ── SPEED CONTROL ─────────────────────
      t += 0.006;
      // ──────────────────────────────────────
      
      // Checkerboard pattern with shifting tiles
      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const x = col * CELL_SIZE;
          const y = row * CELL_SIZE;
          
          // Wave pattern determines tile brightness
          const wave = Math.sin(t * 0.8 + row * 0.5 + col * 0.5);
          const brightness = wave > 0 ? 255 : 40;
          
          // Fade transition
          const fadeAmount = Math.abs(wave);
          const currentBrightness = brightness * fadeAmount + 40 * (1 - fadeAmount);
          
          ctx.fillStyle = `rgb(${currentBrightness}, ${currentBrightness}, ${currentBrightness})`;
          ctx.fillRect(x, y, CELL_SIZE - 2, CELL_SIZE - 2);
        }
      }
      
      // Diagonal lines sweeping across
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 3; i++) {
        const offset = (t * 30 + i * 100) % (W + H);
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset - H, H);
        ctx.stroke();
      }
      
      // Central rotating square
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(t * 0.5);
      
      const squareSize = 40 + Math.sin(t * 0.7) * 10;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.strokeRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);
      
      ctx.restore();
      
      // Corner accents
      const accentSize = 20 + Math.sin(t * 0.9) * 5;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      
      // Top-left
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(accentSize, 0);
      ctx.lineTo(0, accentSize);
      ctx.fill();
      
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(W, H);
      ctx.lineTo(W - accentSize, H);
      ctx.lineTo(W, H - accentSize);
      ctx.fill();
      
      animId = requestAnimationFrame(animate);
    }
    
    animate();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);
  
  return (
    <canvas ref={canvasRef} width={300} height={300} style={{display:'block', margin:'auto'}} />
  );
};

export default ContrastTonesAnimation;
