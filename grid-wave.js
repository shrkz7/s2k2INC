/**
 * S2K2 Inc. — Single Unified Wavy Glowing Grid Canvas
 * Pure single-grid rendering with an illuminated wave traveling left to right.
 * Zero overlapping or duplicate grids.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('singleGlowingGridCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = 0;
  let height = 0;
  let animId = null;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const CELL_SIZE = 48; // Exact single grid cell spacing
  let time = 0;

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Continuous time accumulator for left-to-right wave motion
    time += 0.015;

    const rows = Math.ceil(height / CELL_SIZE) + 1;
    const cols = Math.ceil(width / CELL_SIZE) + 2;

    // Center coordinates for sweeping wave crest traveling left to right
    const loopSpan = width + 500;
    const waveFrontX = ((time * 90) % loopSpan) - 250;
    const waveRadius = 280; // Width of the glowing wave zone

    // 1. Draw Single Horizontal Grid Lines (With subtle wave undulation inside the wave zone)
    for (let r = 0; r <= rows; r++) {
      const baseY = r * CELL_SIZE;
      ctx.beginPath();

      const step = 24;
      for (let x = -20; x <= width + 20; x += step) {
        // Distance from current x position to the wave front
        const distToWave = Math.abs(x - waveFrontX);
        const inWave = distToWave < waveRadius;

        // Wave undulation amplitude peaks at the wave crest and is 0 outside
        let waveY = 0;
        if (inWave) {
          const factor = Math.cos((distToWave / waveRadius) * (Math.PI / 2));
          waveY = Math.sin((x * 0.008) - (time * 2.2) + (r * 0.2)) * 4.5 * factor;
        }

        const currentY = baseY + waveY;

        if (x === -20) {
          ctx.moveTo(x, currentY);
        } else {
          ctx.lineTo(x, currentY);
        }
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 2. Draw Single Vertical Grid Lines & Glowing Wave Sweeps
    for (let c = 0; c <= cols; c++) {
      const baseX = c * CELL_SIZE;
      const dist = Math.abs(baseX - waveFrontX);
      const inWave = dist < waveRadius;

      ctx.beginPath();
      ctx.moveTo(baseX, 0);
      ctx.lineTo(baseX, height);

      if (inWave) {
        // Line intensity inside the glowing wave (1.0 at crest, 0.0 at edges)
        const intensity = Math.cos((dist / waveRadius) * (Math.PI / 2));
        
        // Color transition: Photonic Cyan to Radiant Violet
        const alpha = 0.035 + (intensity * 0.22);
        const rColor = Math.round(0 + intensity * 190);
        const gColor = Math.round(240 - intensity * 110);
        const bColor = 255;

        ctx.strokeStyle = `rgba(${rColor}, ${gColor}, ${bColor}, ${alpha})`;
        ctx.lineWidth = 1 + (intensity * 1.2);
        ctx.stroke();

        // 3. Glowing Node Intersections within the wave crest
        if (intensity > 0.4) {
          for (let r = 0; r <= rows; r++) {
            const baseY = r * CELL_SIZE;
            const factor = Math.cos((dist / waveRadius) * (Math.PI / 2));
            const waveY = Math.sin((baseX * 0.008) - (time * 2.2) + (r * 0.2)) * 4.5 * factor;
            const ptY = baseY + waveY;

            // Soft glowing intersection dot
            ctx.fillStyle = `rgba(0, 240, 255, ${intensity * 0.45})`;
            ctx.fillRect(baseX - 1.5, ptY - 1.5, 3, 3);
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

  // Energy saver: pause when tab is hidden or minimized
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });

  draw();
})();
