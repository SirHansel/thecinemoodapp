import React from 'react';

// themes: every lock has its answer, the key as permission, threshold as transformation
// visualization: A key slides through a lock mechanism — teeth align with tumblers,
// the satisfying click of potential becoming passage

const OldKeyAnimation = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    const NUM_PINS = 6;
    const pins = [];
    for (let i = 0; i < NUM_PINS; i++) {
      pins.push({
        x: W * (0.28 + (i / (NUM_PINS - 1)) * 0.44),
        height: 30 + Math.random() * 25,
        phase: Math.random() * Math.PI * 2,
        speed: 0.006 + Math.random() * 0.005,
        width: 8 + Math.random() * 5,
        alpha: 0.25 + Math.random() * 0.15,
      });
    }

    function drawKey(kx, ky, alpha) {
      ctx.save();
      ctx.translate(kx, ky);

      const bLen = 70;
      const bowX = -bLen / 2 - 14;
      const bowR = 18;

      // Bow
      ctx.beginPath();
      ctx.arc(bowX, 0, bowR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(220, 190, 120, ${alpha})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(bowX, 0, bowR * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(220, 190, 120, ${alpha * 0.5})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      const bStart = bowX + bowR - 4;
      const bEnd = bStart + bLen;

      // Bottom blade edge
      ctx.beginPath();
      ctx.moveTo(bStart, 5);
      ctx.lineTo(bEnd, 5);
      ctx.strokeStyle = `rgba(220, 190, 120, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Top blade edge
      ctx.beginPath();
      ctx.moveTo(bStart, -5);
      ctx.lineTo(bEnd, -5);
      ctx.strokeStyle = `rgba(220, 190, 120, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tip
      ctx.beginPath();
      ctx.moveTo(bEnd, -5);
      ctx.lineTo(bEnd + 7, 0);
      ctx.lineTo(bEnd, 5);
      ctx.strokeStyle = `rgba(220, 190, 120, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── TEETH — pointing upward (negative y from top edge) ─
      const teeth = [
        { x: 5,  h: 10 },
        { x: 16, h: 6  },
        { x: 27, h: 14 },
        { x: 40, h: 8  },
        { x: 52, h: 11 },
      ];

      teeth.forEach(tooth => {
        const tx = bStart + tooth.x;
        ctx.beginPath();
        ctx.moveTo(tx, -5);
        ctx.lineTo(tx, -5 - tooth.h);
        ctx.lineTo(tx + 7, -5 - tooth.h);
        ctx.lineTo(tx + 7, -5);
        ctx.strokeStyle = `rgba(220, 190, 120, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = `rgba(200, 170, 100, ${alpha * 0.15})`;
        ctx.fillRect(tx, -5 - tooth.h, 7, tooth.h);
      });

      // Blade fill
      ctx.fillStyle = `rgba(200, 170, 100, ${alpha * 0.12})`;
      ctx.fillRect(bStart, -5, bLen, 10);

      ctx.restore();
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // ── SPEED CONTROL ─────────────────────────────────────
      t += 0.006;
      // ──────────────────────────────────────────────────────

      const cx = W / 2;
      const cy = H / 2 - 20;

      // ── ALIGNMENT PULSE SPEED: t * 0.2 ────────────────────
      // increase = more frequent alignment moments
      const alignWave = Math.pow(Math.max(0, Math.sin(t * 0.2)), 6);
      // ──────────────────────────────────────────────────────

      const barrelW = W * 0.55;
      const barrelH = 22;
      const barrelX = cx - barrelW / 2;
      const barrelY = cy - barrelH / 2;

      ctx.beginPath();
      ctx.strokeStyle = `rgba(160, 140, 90, 0.18)`;
      ctx.lineWidth = 0.8;
      ctx.rect(barrelX, barrelY, barrelW, barrelH);
      ctx.stroke();

      const shearY = cy;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(200, 175, 120, ${0.06 + alignWave * 0.12})`;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([3, 5]);
      ctx.moveTo(barrelX, shearY);
      ctx.lineTo(barrelX + barrelW, shearY);
      ctx.stroke();
      ctx.setLineDash([]);

      pins.forEach(p => {
        const drift = Math.sin(t * p.speed * 80 + p.phase) * 12;
        const alignPush = alignWave * (p.height - 15);
        const keyPinH = p.height + drift - alignPush;
        const driverPinH = 40 - keyPinH;
        const keyPinY = shearY - keyPinH;
        const driverPinY = shearY - keyPinH - driverPinH - 2;
        const a = p.alpha * 0.6 + alignWave * 0.1;

        ctx.beginPath();
        ctx.fillStyle = `rgba(180, 155, 90, ${a * 0.2})`;
        ctx.strokeStyle = `rgba(180, 155, 90, ${a * 0.5})`;
        ctx.lineWidth = 0.6;
        ctx.rect(p.x - p.width/2, keyPinY, p.width, keyPinH);
        ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = `rgba(140, 115, 60, ${a * 0.15})`;
        ctx.strokeStyle = `rgba(140, 115, 60, ${a * 0.4})`;
        ctx.lineWidth = 0.6;
        ctx.rect(p.x - p.width/2, driverPinY, p.width, driverPinH);
        ctx.fill(); ctx.stroke();

        if (alignWave > 0.4) {
          ctx.beginPath();
          ctx.arc(p.x, shearY, p.width * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240, 215, 150, ${alignWave * 0.18})`;
          ctx.fill();
        }
      });

      // ── KEY TRAVEL SPEED: t * 0.18 ────────────────────────
      // increase = faster horizontal movement
      const keyProgress = Math.sin(t * 0.18) * 0.5 + 0.5;
      // ──────────────────────────────────────────────────────
      const keyX = barrelX + 60 + keyProgress * (barrelW - 90);
      const keyY = barrelY + barrelH + 16;
      const keyAlpha = 0.55 + alignWave * 0.3 + Math.sin(t * 0.3) * 0.08;

      const glowGrad = ctx.createRadialGradient(keyX, keyY, 0, keyX, keyY, 55);
      glowGrad.addColorStop(0, `rgba(200, 170, 100, ${0.07 + alignWave * 0.08})`);
      glowGrad.addColorStop(1, 'rgba(200, 170, 100, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, W, H);

      drawKey(keyX, keyY, keyAlpha);

      if (alignWave > 0.5) {
        const flashGrad = ctx.createLinearGradient(barrelX, shearY - 2, barrelX, shearY + 2);
        flashGrad.addColorStop(0, 'rgba(240, 215, 150, 0)');
        flashGrad.addColorStop(0.5, `rgba(240, 215, 150, ${alignWave * 0.18})`);
        flashGrad.addColorStop(1, 'rgba(240, 215, 150, 0)');
        ctx.fillStyle = flashGrad;
        ctx.fillRect(barrelX, shearY - 10, barrelW, 20);
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

export default OldKeyAnimation;
