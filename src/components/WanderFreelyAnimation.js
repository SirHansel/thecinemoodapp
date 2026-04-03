import from 'react'


const canvas = document.getElementById('wf');
const ctx = canvas.getContext('2d');
const W = 300, H = 300;
let t = 0;
let animId = null;

const NUM_RINGS = 18;
const rings = [];

for (let i = 0; i < NUM_RINGS; i++) {
  const progress = i / NUM_RINGS;
  rings.push({
    progress,
    phase: Math.random() * Math.PI * 2,
    drift: (Math.random() - 0.5) * 30,
    speed: 0.003 + Math.random() * 0.002,
    baseAlpha: 0.08 + progress * 0.18,
  });
}

const NUM_PARTICLES = 38;
const particles = [];
for (let i = 0; i < NUM_PARTICLES; i++) {
  particles.push({
    progress: Math.random(),
    side: Math.random() - 0.5,
    phase: Math.random() * Math.PI * 2,
    speed: 0.0004 + Math.random() * 0.0006,
    size: 0.5 + Math.random() * 1.2,
    alpha: 0.2 + Math.random() * 0.5,
  });
}

function getPathPoint(progress, driftAmt, driftPhase, time) {
  const horizon = H * 0.38;
  const vanishX = W * 0.5 + Math.sin(time * 0.18) * 18;
  const vanishY = horizon;
  const baseY = H * 0.98;

  const y = baseY + (vanishY - baseY) * progress;

  const spread = 1 - progress;
  const wander = Math.sin(progress * Math.PI * 2.5 + driftPhase + time * 0.12) * driftAmt * spread * 1.4;
  const x = vanishX + wander + (vanishX - W / 2) * (progress - 1) * 0.0;

  return { x, y };
}

function drawPath(time) {
  const steps = 80;
  const vanishX = W * 0.5 + Math.sin(time * 0.18) * 18;
  const horizon = H * 0.38;

  const leftEdge = [];
  const rightEdge = [];

  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    const spread = (1 - p);
    const pathW = 62 * spread * spread + 1.5;
    const baseY = H * 0.98;
    const y = baseY + (horizon - baseY) * p;
    const wander = Math.sin(p * Math.PI * 2.5 + time * 0.12) * 18 * spread;
    const cx = vanishX + wander;

    leftEdge.push({ x: cx - pathW, y });
    rightEdge.push({ x: cx + pathW, y });
  }

  ctx.beginPath();
  ctx.moveTo(leftEdge[0].x, leftEdge[0].y);
  for (let i = 1; i < leftEdge.length; i++) {
    const prev = leftEdge[i - 1];
    const curr = leftEdge[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
  }
  for (let i = rightEdge.length - 1; i >= 0; i--) {
    const curr = rightEdge[i];
    const next = rightEdge[Math.max(0, i - 1)];
    const mx = (curr.x + next.x) / 2;
    const my = (curr.y + next.y) / 2;
    ctx.quadraticCurveTo(curr.x, curr.y, mx, my);
  }
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, H * 0.98, 0, horizon);
  grad.addColorStop(0, 'rgba(160, 140, 110, 0.18)');
  grad.addColorStop(0.6, 'rgba(160, 140, 110, 0.07)');
  grad.addColorStop(1, 'rgba(160, 140, 110, 0.02)');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(leftEdge[0].x, leftEdge[0].y);
  for (let i = 1; i < leftEdge.length; i++) {
    const prev = leftEdge[i - 1];
    const curr = leftEdge[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
  }
  ctx.strokeStyle = 'rgba(180, 160, 120, 0.28)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(rightEdge[0].x, rightEdge[0].y);
  for (let i = 1; i < rightEdge.length; i++) {
    const prev = rightEdge[i - 1];
    const curr = rightEdge[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
  }
  ctx.strokeStyle = 'rgba(180, 160, 120, 0.28)';
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

function drawHorizonRings(time) {
  const vanishX = W * 0.5 + Math.sin(time * 0.18) * 18;
  const vanishY = H * 0.38;

  rings.forEach((ring, i) => {
    const breathe = Math.sin(time * ring.speed * 60 + ring.phase) * 0.5 + 0.5;
    const baseR = 4 + ring.progress * 90;
    const r = baseR + breathe * 6;
    const alpha = ring.baseAlpha * (1 - ring.progress * 0.5) * (0.6 + breathe * 0.4);

    ctx.beginPath();
    ctx.ellipse(
      vanishX + ring.drift * ring.progress,
      vanishY,
      r,
      r * 0.32,
      0, 0, Math.PI * 2
    );
    ctx.strokeStyle = `rgba(180, 165, 130, ${alpha})`;
    ctx.lineWidth = 0.6;
    ctx.stroke();
  });
}

function drawParticles(time) {
  const vanishX = W * 0.5 + Math.sin(time * 0.18) * 18;
  const horizon = H * 0.38;
  const baseY = H * 0.98;

  particles.forEach(p => {
    p.progress += p.speed;
    if (p.progress > 1) {
      p.progress = 0.02 + Math.random() * 0.08;
      p.side = (Math.random() - 0.5) * 0.9;
      p.alpha = 0.2 + Math.random() * 0.5;
    }

    const spread = (1 - p.progress);
    const wander = Math.sin(p.progress * Math.PI * 2.5 + p.phase + time * 0.12) * 18 * spread;
    const cx = vanishX + wander;
    const pathW = 62 * spread * spread;
    const x = cx + p.side * pathW;
    const y = baseY + (horizon - baseY) * p.progress;

    const fade = Math.min(p.progress * 8, 1) * Math.min((1 - p.progress) * 5, 1);
    ctx.beginPath();
    ctx.arc(x, y, p.size * (0.3 + spread * 0.7), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 185, 150, ${p.alpha * fade})`;
    ctx.fill();
  });
}

function drawSkyGlow(time) {
  const vanishX = W * 0.5 + Math.sin(time * 0.18) * 18;
  const vanishY = H * 0.38;
  const breathe = Math.sin(time * 0.22) * 0.5 + 0.5;

  const grd = ctx.createRadialGradient(vanishX, vanishY, 0, vanishX, vanishY, 55 + breathe * 10);
  grd.addColorStop(0, `rgba(160, 145, 110, ${0.06 + breathe * 0.04})`);
  grd.addColorStop(1, 'rgba(160, 145, 110, 0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);
}

function drawGroundLines(time) {
  const vanishX = W * 0.5 + Math.sin(time * 0.18) * 18;
  const horizon = H * 0.38;
  const baseY = H * 0.98;

  for (let i = 0; i < 7; i++) {
    const p = 0.15 + i * 0.12;
    const spread = (1 - p);
    const y = baseY + (horizon - baseY) * p;
    const wander = Math.sin(p * Math.PI * 2.5 + time * 0.12) * 18 * spread;
    const cx = vanishX + wander;
    const hw = 65 * spread * spread;

    ctx.beginPath();
    ctx.moveTo(cx - hw * 1.8, y);
    ctx.lineTo(cx - hw * 0.1, y);
    ctx.strokeStyle = `rgba(160, 145, 115, ${0.04 + spread * 0.06})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + hw * 0.1, y);
    ctx.lineTo(cx + hw * 1.8, y);
    ctx.strokeStyle = `rgba(160, 145, 115, ${0.04 + spread * 0.06})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
}

function animate() {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, W, H);

  // ── SPEED CONTROL ─────────────────────
  t += 0.006;
  // ──────────────────────────────────────

  drawSkyGlow(t);
  drawHorizonRings(t);
  drawGroundLines(t);
  drawPath(t);
  drawParticles(t);

  animId = requestAnimationFrame(animate);
}

animate();
