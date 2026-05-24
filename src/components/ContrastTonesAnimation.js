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
    
    const GRID_SIZE = 10;  // ← Changed from 6 to 10 (more tiles)
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
          ctx.fillRect(x, y, CELL_SIZE - 1, CELL_SIZE - 1);  // ← Adjusted gap for smaller tiles
        }
      }
      
      // ← REMOVED: Central rotating square
      
      // Diagonal lines sweeping across - TWO SETS OF TWO (4 total)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      
      // First set of two
      for (let i = 0; i < 2; i++) {
        const offset = (t * 30 + i * 150) % (W + H);
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset - H, H);
        ctx.stroke();
      }
      
      // Second set of two (opposite direction)
      for (let i = 0; i < 2; i++) {
        const offset = (t * 30 + i * 150) % (W + H);
        ctx.beginPath();
        ctx.moveTo(0, offset);
        ctx.lineTo(W, offset - W);
        ctx.stroke();
      }
      
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
