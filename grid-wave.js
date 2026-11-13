/**
 * S2K2 Inc. — Single Unified Wavy Glowing Grid Canvas (High-Precision Silk Flow)
 * Enhanced with sub-pixel DPR scaling, timestamp delta-time, smoother curves, and optimized wave speed.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('singleGlowingGridCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = 0;
  let height = 0;
  let animId = null;
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  resize();

  const CELL_SIZE = 48; // Crisp single grid spacing
  let time = 0;
  let lastTimestamp = performance.now();

  // Wave speed and glow configuration (optimized for smooth velocity & luminous presence)
  const WAVE_SPEED = 185; // Speed in pixels per second across screen
  const WAVE_RADIUS = 360; // Wider, softer glow envelope

  function draw(currentTimestamp) {
    // Delta-time calculation for frame-rate independent silky smoothness
    const dt = Math.min((currentTimestamp - lastTimestamp) / 1000, 0.1);
    lastTimestamp = currentTimestamp;
    time += dt;

    ctx.clearRect(0, 0, width, height);

    const rows = Math.ceil(height / CELL_SIZE) + 1;
    const cols = Math.ceil(width / CELL_SIZE) + 2;

    // Loop cycle width
    const loopSpan = width + WAVE_RADIUS * 2 + 200;
    const waveFrontX = ((time * WAVE_SPEED) % loopSpan) - WAVE_RADIUS - 100;

    // 1. Draw Single Horizontal Grid Lines (With silky sine wave undulation inside the wave zone)
    for (let r = 0; r <= rows; r++) {
      const baseY = r * CELL_SIZE;
      ctx.beginPath();

      // Finer sampling step (12px) for curve smoothness
      const step = 12;
      for (let x = -24; x <= width + 24; x += step) {
        const distToWave = Math.abs(x - waveFrontX);
        let waveY = 0;

        if (distToWave < WAVE_RADIUS) {
          // Smooth cosine bell curve for elevation
          const factor = 0.5 + 0.5 * Math.cos((distToWave / WAVE_RADIUS) * Math.PI);
          waveY = Math.sin((x * 0.007) - (time * 3.2) + (r * 0.18)) * 4.8 * factor;
        }

        const currentY = baseY + waveY;

        if (x === -24) {
          ctx.moveTo(x, currentY);
        } else {
          ctx.lineTo(x, currentY);
        }
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 2. Draw Single Vertical Grid Lines & Glowing Wave Crest
    for (let c = 0; c <= cols; c++) {
      const baseX = c * CELL_SIZE;
      const dist = Math.abs(baseX - waveFrontX);
      const inWave = dist < WAVE_RADIUS;

      ctx.beginPath();
      ctx.moveTo(baseX, 0);
      ctx.lineTo(baseX, height);

      if (inWave) {
        // Bell-curve intensity: 1.0 at center, 0.0 at edges
        const intensity = 0.5 + 0.5 * Math.cos((dist / WAVE_RADIUS) * Math.PI);

        // Dynamic multi-tone color gradient (Cyan #00f0ff to Violet #d174d2)
        const alpha = 0.035 + (intensity * 0.28);
        const rColor = Math.round(0 + intensity * 200);
        const gColor = Math.round(240 - intensity * 125);
        const bColor = 255;

        ctx.strokeStyle = `rgba(${rColor}, ${gColor}, ${bColor}, ${alpha})`;
        ctx.lineWidth = 1 + (intensity * 1.3);
        ctx.stroke();

        // 3. Glowing Circular Photon Nodes at Intersections
        if (intensity > 0.35) {
          const nodeAlpha = (intensity - 0.35) / 0.65;
          ctx.fillStyle = `rgba(0, 240, 255, ${nodeAlpha * 0.5})`;

          for (let r = 0; r <= rows; r++) {
            const baseY = r * CELL_SIZE;
            const factor = 0.5 + 0.5 * Math.cos((dist / WAVE_RADIUS) * Math.PI);
            const waveY = Math.sin((baseX * 0.007) - (time * 3.2) + (r * 0.18)) * 4.8 * factor;
            const ptY = baseY + waveY;

            ctx.beginPath();
            ctx.arc(baseX, ptY, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else {
        // Base subtle static line outside wave
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    animId = requestAnimationFrame(draw);
  }

  // Energy saver: pause when tab is minimized or out of focus
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
    } else {
      lastTimestamp = performance.now();
      animId = requestAnimationFrame(draw);
    }
  });

  lastTimestamp = performance.now();
  animId = requestAnimationFrame(draw);
})();
