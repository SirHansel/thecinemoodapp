import React from 'react';
// themes: the city as nervous system, every light a thought, every street a synapse — v2

// visualization: A geometric grid breathes and pulses — lines of light surge and fade
// like traffic, like crowds, like neon signs cycling through the night

const NeonCityAnimation = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    const COLS = 12;
    const ROWS = 12;
    const cellW = W / COLS;
    const cellH = H / ROWS;

    const nodes = [];
    const pulses = [];

    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        nodes.push({
          x: c * cellW,
          y: r * cellH,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.4,
          bright: Math.random(),
        });
      }
    }

    function spawnPulse() {
      const isHoriz = Math.random() < 0.5;
      pulses.push({
        horiz: isHoriz,
        pos: isHoriz ? Math.floor(Math.random() * ROWS) : Math.floor(Math.random() * COLS),
        progress: 0,
        // ── PULSE SPEED: 0.008-0.02 range ─────────────────
        // increase both values = faster pulses across grid
        speed: 0.008 + Math.random() * 0.012,
        // ──────────────────────────────────────────────────
        alpha: 0.3 + Math.random() * 0.3,
        color: Math.random() < 0.5 ? '180, 100, 255' : '100, 200, 255',
      });
    }

    for (let i = 0; i < 6; i++) spawnPulse();

    const buildings = [
      { x: 0,   w: 30, h: 0.35 },
      { x: 28,  w: 20, h: 0.45 },
      { x: 46,  w: 35, h: 0.30 },
      { x: 79,  w: 25, h: 0.50 },
      { x: 102, w: 18, h: 0.38 },
      { x: 118, w: 40, h: 0.42 },
      { x: 156, w: 22, h: 0.55 },
      { x: 176, w: 30, h: 0.33 },
      { x: 204, w: 28, h: 0.48 },
      { x: 230, w: 20, h: 0.36 },
      { x: 248, w: 32, h: 0.44 },
      { x: 278, w: 22, h: 0.38 },
    ];

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);

      // ── SPEED CONTROL ─────────────────────────────────────
      t += 0.006; // base animation speed
      // ──────────────────────────────────────────────────────

      // ── PULSE SPAWN RATE: 0.03 probability per frame ──────
      // increase = more frequent pulses = busier city feel
      if (Math.random() < 0.03) spawnPulse();
      // ──────────────────────────────────────────────────────

      for (let r = 0; r <= ROWS; r++) {
        const baseAlpha = 0.04 + Math.sin(t * 0.3 + r * 0.4) * 0.02;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(100, 140, 200, ${baseAlpha})`;
        ctx.lineWidth = 0.4;
        ctx.moveTo(0, r * cellH);
        ctx.lineTo(W, r * cellH);
        ctx.stroke();
      }

      for (let c = 0; c <= COLS; c++) {
        const baseAlpha = 0.04 + Math.sin(t * 0.25 + c * 0.3) * 0.02;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(100, 140, 200, ${baseAlpha})`;
        ctx.lineWidth = 0.4;
        ctx.moveTo(c * cellW, 0);
        ctx.lineTo(c * cellW, H);
        ctx.stroke();
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;

        const fadeIn = Math.min(1, p.progress * 5);
        const fadeOut = Math.max(0, 1 - (p.progress - 0.8) * 5);
        const alpha = p.alpha * fadeIn * fadeOut;

        if (p.horiz) {
          const y = p.pos * cellH;
          const x = p.progress * W;
          const grad = ctx.createLinearGradient(x - 40, 0, x + 10, 0);
          grad.addColorStop(0, `rgba(${p.color}, 0)`);
          grad.addColorStop(0.6, `rgba(${p.color}, ${alpha * 0.8})`);
          grad.addColorStop(1, `rgba(${p.color}, ${alpha})`);
          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.moveTo(Math.max(0, x - 40), y);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          const x = p.pos * cellW;
          const y = p.progress * H;
          const grad = ctx.createLinearGradient(0, y - 40, 0, y + 10);
          grad.addColorStop(0, `rgba(${p.color}, 0)`);
          grad.addColorStop(0.6, `rgba(${p.color}, ${alpha * 0.8})`);
          grad.addColorStop(1, `rgba(${p.color}, ${alpha})`);
          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.moveTo(x, Math.max(0, y - 40));
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        if (p.progress > 1.2) pulses.splice(i, 1);
      }

      nodes.forEach(n => {
        const pulse = Math.sin(t * n.speed + n.phase) * 0.5 + 0.5;
        const alpha = 0.08 + pulse * 0.25;
        const size = 0.8 + pulse * 1.2;
        const color = n.bright > 0.7 ? '180, 100, 255' : n.bright > 0.4 ? '100, 200, 255' : '140, 170, 210';
        ctx.beginPath();
        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fill();
      });

      buildings.forEach(b => {
        const bh = b.h * H;
        const by = H - bh;
        ctx.fillStyle = `rgba(10, 12, 28, 0.85)`;
        ctx.fillRect(b.x, by, b.w, bh);
        for (let wy = by + 8; wy < H - 5; wy += 10) {
          for (let wx = b.x + 4; wx < b.x + b.w - 4; wx += 8) {
            if (Math.random() < 0.003) continue;
            const winAlpha = 0.15 + Math.sin(t * 0.4 + wx + wy) * 0.05;
            const winColor = Math.random() < 0.3 ? '255, 200, 100' : '180, 220, 255';
            ctx.fillStyle = `rgba(${winColor}, ${winAlpha})`;
            ctx.fillRect(wx, wy, 3, 4);
          }
        }
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

export default NeonCityAnimation;
