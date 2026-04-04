import React from 'react';

// themes: stone breaks along hidden lines, structure reveals itself through pressure
// visualization: Angular voronoi shards fracture outward from center —
// cleavage planes catch light, each facet breathes at its own pace, dust at the edges

const RoughStoneAnimation = () => {
  const canvasRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 300, H = 300;
    let t = 0;
    let animId = null;

    function seededRand(seed) {
      let s = seed;
      return function() {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
      };
    }

    const rng = seededRand(42);

    function voronoi(numPoints, w, h) {
      const pts = [];
      for (let i = 0; i < numPoints; i++) {
        pts.push({ x: rng() * w, y: rng() * h });
      }
      return pts;
    }

    const NUM_SHARDS = 18;
    const basePts = voronoi(NUM_SHARDS, W, H);

    function getShards(time) {
      const cx = W / 2, cy = H / 2;
      return basePts.map((p, i) => {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const phase = i * 0.71 + dist * 0.01;
        const breathe = Math.sin(time * 0.4 + phase) * 0.5 + 0.5;
        const drift = 1.5 + breathe * 3.5;
        return {
          x: p.x + Math.cos(angle) * drift,
          y: p.y + Math.sin(angle) * drift,
          breathe,
          phase,
          dist,
        };
      });
    }

    function drawVoronoiShards(time) {
      const shards = getShards(time);
      const cx = W / 2, cy = H / 2;

      for (let i = 0; i < shards.length; i++) {
        const cell = [];
        const px = shards[i].x;
        const py = shards[i].y;

        const GRID = 12;
        for (let gx = 0; gx <= GRID; gx++) {
          for (let gy = 0; gy <= GRID; gy++) {
            const sx = (gx / GRID) * W;
            const sy = (gy / GRID) * H;
            let minDist = Infinity;
            let minIdx = -1;
            for (let j = 0; j < shards.length; j++) {
              const d = Math.pow(sx - shards[j].x, 2) + Math.pow(sy - shards[j].y, 2);
              if (d < minDist) { minDist = d; minIdx = j; }
            }
            if (minIdx === i) cell.push({ x: sx, y: sy });
          }
        }

        if (cell.length < 3) continue;

        const centX = cell.reduce((s, p) => s + p.x, 0) / cell.length;
        const centY = cell.reduce((s, p) => s + p.y, 0) / cell.length;
        cell.sort((a, b) => Math.atan2(a.y - centY, a.x - centX) - Math.atan2(b.y - centY, b.x - centX));

        const distFromCenter = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
        const edgeFactor = Math.min(distFromCenter / 110, 1);
        const breathe = shards[i].breathe;

        const baseLight = 35 + edgeFactor * 25;
        const lightVar = breathe * 18;
        const light = Math.floor(baseLight + lightVar);
        const alpha = 0.55 + breathe * 0.2 - edgeFactor * 0.15;

        ctx.beginPath();
        ctx.moveTo(cell[0].x, cell[0].y);
        for (let k = 1; k < cell.length; k++) ctx.lineTo(cell[k].x, cell[k].y);
        ctx.closePath();
        ctx.fillStyle = `rgba(${light + 10}, ${light + 5}, ${light}, ${alpha * 0.35})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${light + 30}, ${light + 25}, ${light + 20}, ${alpha * 0.6})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }

    function drawFractureLines(time) {
      const shards = getShards(time);
      const cx = W / 2, cy = H / 2;

      for (let i = 0; i < shards.length; i++) {
        for (let j = i + 1; j < shards.length; j++) {
          const dx = shards[j].x - shards[i].x;
          const dy = shards[j].y - shards[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 80) continue;

          const midX = (shards[i].x + shards[j].x) / 2;
          const midY = (shards[i].y + shards[j].y) / 2;
          const distFromCenter = Math.sqrt(Math.pow(midX - cx, 2) + Math.pow(midY - cy, 2));
          const fade = Math.max(0, 1 - distFromCenter / 145);

          const breathe = (shards[i].breathe + shards[j].breathe) / 2;
          const alpha = (0.12 + breathe * 0.1) * fade * (1 - dist / 80);

          ctx.beginPath();
          ctx.moveTo(shards[i].x, shards[i].y);
          ctx.lineTo(shards[j].x, shards[j].y);
          ctx.strokeStyle = `rgba(160, 150, 140, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    function drawCenterGlow(time) {
      const breathe = Math.sin(time * 0.35) * 0.5 + 0.5;
      const r = 55 + breathe * 15;
      const grd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, r);
      grd.addColorStop(0, `rgba(140, 130, 115, ${0.07 + breathe * 0.04})`);
      grd.addColorStop(1, 'rgba(100, 90, 80, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }

    function drawEdgeDust(time) {
      const shards = getShards(time);
      shards.forEach((s) => {
        const distFromCenter = Math.sqrt(Math.pow(s.x - W/2, 2) + Math.pow(s.y - H/2, 2));
        if (distFromCenter < 60) return;
        const fade = Math.max(0, (distFromCenter - 60) / 90);
        const alpha = s.breathe * 0.18 * fade;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(170, 160, 145, ${alpha})`;
        ctx.fill();
      });
    }

    function animate() {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      // ── SPEED CONTROL ─────────────────────
      t += 0.006;
      // ──────────────────────────────────────
      drawCenterGlow(t);
      drawVoronoiShards(t);
      drawFractureLines(t);
      drawEdgeDust(t);
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
