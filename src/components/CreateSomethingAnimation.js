import React from 'react';

// themes: creation through subtraction, the form already exists within
// visualization: A marble block — chisel approaches, a clean line forms,
// a chunk slides free — revealing what was always there

const CreateSomethingAnimation = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    function drawBlock(splitY, chunkOffset) {
      const cx = W / 2, cy = H / 2;
      const w = 130, h = 90, d = 30;

      // Corner points
      const fTL = { x: cx - w/2,     y: cy - h/2 };
      const fTR = { x: cx + w/2,     y: cy - h/2 };
      const fBR = { x: cx + w/2,     y: cy + h/2 };
      const fBL = { x: cx - w/2,     y: cy + h/2 };
      const bTL = { x: cx - w/2 + d, y: cy - h/2 - d };
      const bTR = { x: cx + w/2 + d, y: cy - h/2 - d };
      const bBR = { x: cx + w/2 + d, y: cy + h/2 - d };

      const actualSplit = fTL.y + splitY * h;

      // ── TOP CHUNK ──
      ctx.save();
      ctx.translate(0, chunkOffset);

      // Top face
      ctx.beginPath();
      ctx.moveTo(fTL.x, fTL.y);
      ctx.lineTo(fTR.x, fTR.y);
      ctx.lineTo(bTR.x, bTR.y);
      ctx.lineTo(bTL.x, bTL.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(185, 182, 178, 0.14)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(205, 200, 195, 0.45)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Front face — top chunk
      ctx.beginPath();
      ctx.moveTo(fTL.x, fTL.y);
      ctx.lineTo(fTR.x, fTR.y);
      ctx.lineTo(fTR.x, actualSplit);
      ctx.lineTo(fTL.x, actualSplit);
      ctx.closePath();
      ctx.fillStyle = 'rgba(165, 160, 155, 0.16)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(195, 190, 184, 0.42)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Right face — top chunk
      ctx.beginPath();
      ctx.moveTo(fTR.x, fTR.y);
      ctx.lineTo(bTR.x, bTR.y);
      ctx.lineTo(bTR.x, bTR.y + (actualSplit - fTR.y));
      ctx.lineTo(fTR.x, actualSplit);
      ctx.closePath();
      ctx.fillStyle = 'rgba(130, 126, 122, 0.20)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(165, 160, 154, 0.38)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Grain lines — top chunk
      for (let g = 0; g < 5; g++) {
        const gy = fTL.y + g * (actualSplit - fTL.y) / 5;
        ctx.beginPath();
        ctx.moveTo(fTL.x + 6, gy + Math.sin(g * 1.4) * 2);
        ctx.lineTo(fTR.x - 6, gy + Math.cos(g * 1.0) * 2);
        ctx.strokeStyle = `rgba(215, 210, 205, ${0.06 + Math.sin(t*0.3+g)*0.015})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      ctx.restore();

      // ── BOTTOM CHUNK — stays ──
      // Front face bottom
      ctx.beginPath();
      ctx.moveTo(fTL.x, actualSplit);
      ctx.lineTo(fTR.x, actualSplit);
      ctx.lineTo(fBR.x, fBR.y);
      ctx.lineTo(fBL.x, fBL.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(148, 144, 140, 0.18)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(188, 183, 177, 0.40)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Right face bottom
      ctx.beginPath();
      ctx.moveTo(fTR.x, actualSplit);
      ctx.lineTo(bTR.x, bTR.y + (actualSplit - fTR.y));
      ctx.lineTo(bBR.x, bBR.y);
      ctx.lineTo(fBR.x, fBR.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(112, 108, 104, 0.22)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(152, 148, 143, 0.36)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Grain lines — bottom chunk
      for (let g = 0; g < 6; g++) {
        const gy = actualSplit + g * (fBL.y - actualSplit) / 6;
        ctx.beginPath();
        ctx.moveTo(fTL.x + 6, gy + Math.sin(g * 1.2 + 2) * 2);
        ctx.lineTo(fTR.x - 6, gy + Math.cos(g * 0.9 + 1) * 2);
        ctx.strokeStyle = `rgba(205, 200, 194, ${0.05 + Math.sin(t*0.25+g)*0.015})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }

      // Split line glow
      if (splitY > 0.05) {
        const glowA = Math.min(1, splitY * 4) * 0.22;
        ctx.beginPath();
        ctx.moveTo(fTL.x, actualSplit);
        ctx.lineTo(fTR.x, actualSplit);
        ctx.strokeStyle = `rgba(225, 220, 210, ${glowA})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
    }

    function drawChisel(cx, cy) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 7);

      // Handle
      ctx.beginPath();
      ctx.rect(-4, -52, 8, 38);
      ctx.fillStyle = 'rgba(155, 125, 85, 0.38)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(178, 148, 108, 0.58)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Metal ferrule
      ctx.beginPath();
      ctx.rect(-4.5, -16, 9, 6);
      ctx.fillStyle = 'rgba(185, 180, 172, 0.45)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(205, 200, 192, 0.65)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Shaft
      ctx.beginPath();
      ctx.rect(-3, -10, 6, 18);
      ctx.fillStyle = 'rgba(178, 174, 167, 0.42)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(200, 195, 188, 0.62)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Blade
      ctx.beginPath();
      ctx.moveTo(-6, 8);
      ctx.lineTo(6, 8);
      ctx.lineTo(3, 18);
      ctx.lineTo(-3, 18);
      ctx.closePath();
      ctx.fillStyle = 'rgba(208, 203, 194, 0.58)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(228, 223, 214, 0.78)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Edge
      ctx.beginPath();
      ctx.moveTo(-3, 18);
      ctx.lineTo(3, 18);
      ctx.strokeStyle = 'rgba(242, 238, 228, 0.90)';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.restore();
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // ── SPEED CONTROL ─────────────────────────────────────
      t += 0.004;
      // ──────────────────────────────────────────────────────

      const breathe = Math.sin(t * 0.35) * 0.5 + 0.5;

      // ── CYCLE: 600 frames ──────────────────────────────────
      // phase 0.00-0.42: chisel approaches
      // phase 0.42-0.58: crack line forms
      // phase 0.58-0.82: chunk slides down
      // phase 0.82-1.00: fade and reset
      const cycleLen = 600;
      const cycleT = (t * 60) % cycleLen;
      const gp = cycleT / cycleLen;
      // ──────────────────────────────────────────────────────

      const chiselP  = Math.min(1, gp / 0.42);
      const splitP   = gp > 0.42 ? Math.min(1, (gp - 0.42) / 0.16) : 0;
      const slideP   = gp > 0.58 ? Math.min(1, (gp - 0.58) / 0.24) : 0;
      const fadeP    = gp > 0.82 ? (gp - 0.82) / 0.18 : 0;

      // ── CHUNK SLIDE DISTANCE: 22px max ────────────────────
      const chunkOffset = slideP * 22;
      // ──────────────────────────────────────────────────────

      // Subtle ambient glow
      const glow = ctx.createRadialGradient(W/2, H/2 - 10, 0, W/2, H/2 - 10, 90);
      glow.addColorStop(0, `rgba(185, 180, 170, ${0.03 + breathe * 0.02})`);
      glow.addColorStop(1, 'rgba(185, 180, 170, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      drawBlock(splitP, chunkOffset);

      // Chisel target — upper left area of block face
      const tX = W/2 - 45;
      const tY = H/2 - 30;
      const sX = tX + 85;
      const sY = tY - 35;

      const chisX = sX + (tX - sX) * chiselP;
      const chisY = sY + (tY - sY) * chiselP;

      if (gp < 0.78) drawChisel(chisX, chisY);

      // Fade overlay
      if (fadeP > 0) {
        ctx.fillStyle = `rgba(26, 26, 46, ${fadeP})`;
        ctx.fillRect(0, 0, W, H);
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

export default CreateSomethingAnimation;
