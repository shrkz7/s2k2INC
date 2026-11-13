/**
 * S2K2 Inc. — Single Unified Wavy Glowing Grid Canvas (High-Precision Silk Flow & Parallax Scroll)
 * Enhanced with:
 * - Parallax scroll tracking with silky inertia lerp (scrolls seamlessly with user swipe/scroll)
 * - Touch swipe gesture reaction (swipes nudge and accelerate the flowing photon wave)
 * - Continuous sub-pixel DPR scaling & delta-time animation
 * - Dynamic tactile velocity impulse on fast swipes/scrolls
 * - Background ambient glow orb parallax coordination
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

  // Wave speed and glow configuration
  const BASE_WAVE_SPEED = 185; // Speed in pixels per second across screen
  const WAVE_RADIUS = 360; // Soft glow envelope width
  const PARALLAX_FACTOR = 0.35; // 35% speed relative to foreground scroll for deep 3D perspective

  // Scroll & swipe tracking with silky smooth lerp
  let targetScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  let currentScrollY = targetScrollY;
  let lastRawScroll = targetScrollY;
  let scrollVelocity = 0;

  function updateScrollTarget() {
    targetScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  }
  window.addEventListener('scroll', updateScrollTarget, { passive: true });
  updateScrollTarget();

  // Touch swipe support (allows user touch drag / swipe to interactively nudge the wave)
  let touchStartX = 0;
  let touchStartY = 0;
  let horizontalSwipeNudge = 0;

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      const dx = e.touches[0].clientX - touchStartX;
      touchStartX = e.touches[0].clientX;
      // Accumulate subtle horizontal momentum from swipe
      horizontalSwipeNudge += dx * 0.4;
    }
  }, { passive: true });

  const glowWrapper = document.querySelector('.ambient-glow-wrapper');

  function draw(currentTimestamp) {
    // Delta-time calculation for frame-rate independent silky smoothness
    const dt = Math.min((currentTimestamp - lastTimestamp) / 1000, 0.1);
    lastTimestamp = currentTimestamp;

    // Smooth inertia lerp for scroll position
    const scrollDelta = targetScrollY - currentScrollY;
    currentScrollY += scrollDelta * 0.12;

    // Compute instantaneous scroll velocity for tactile wave reaction
    scrollVelocity = (targetScrollY - lastRawScroll);
    lastRawScroll = targetScrollY;

    // Dynamic wave speed boost during active swiping/scrolling
    const velocityFactor = Math.min(Math.abs(scrollVelocity) * 0.008, 0.6);
    time += dt * (1 + velocityFactor);

    // Decay horizontal touch swipe nudge
    horizontalSwipeNudge *= 0.94;

    ctx.clearRect(0, 0, width, height);

    const rows = Math.ceil(height / CELL_SIZE) + 1;
    const cols = Math.ceil(width / CELL_SIZE) + 2;

    // Parallax vertical offset modulo cell size for seamless infinite scrolling
    const verticalShift = (currentScrollY * PARALLAX_FACTOR) % CELL_SIZE;

    // Gentle parallax translation on ambient glow orbs behind the grid
    if (glowWrapper) {
      const orbParallaxY = -currentScrollY * 0.14;
      glowWrapper.style.transform = `translate3d(0, ${orbParallaxY.toFixed(1)}px, 0)`;
    }

    // Loop cycle width with swipe offset
    const loopSpan = width + WAVE_RADIUS * 2 + 200;
    const waveFrontX = (((time * BASE_WAVE_SPEED) + horizontalSwipeNudge) % loopSpan) - WAVE_RADIUS - 100;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light' ||
                    (document.body && document.body.getAttribute('data-theme') === 'light');
    // Clean, elegant partially visible base grid across the entire canvas
    const baseGridColor = isLight ? 'rgba(100, 116, 139, 0.14)' : 'rgba(255, 255, 255, 0.04)';

    // Wave amplitude with subtle dynamic surge during rapid swiping
    const dynamicAmplitude = 4.8 + Math.min(Math.abs(scrollVelocity) * 0.03, 2.5);

    // 1. Draw Horizontal Grid Lines (Scrolling with user swipe with seamless edge wrap)
    for (let r = -1; r <= rows + 1; r++) {
      const baseY = (r * CELL_SIZE) - verticalShift;
      ctx.beginPath();

      // Finer sampling step (12px) for curve smoothness
      const step = 12;
      for (let x = -24; x <= width + 24; x += step) {
        const distToWave = Math.abs(x - waveFrontX);
        let waveY = 0;

        if (distToWave < WAVE_RADIUS) {
          // Smooth cosine bell curve for elevation
          const factor = 0.5 + 0.5 * Math.cos((distToWave / WAVE_RADIUS) * Math.PI);
          // Continuous world-space row coordinate to eliminate phase skips on scroll
          const worldRowCoord = (baseY + currentScrollY * PARALLAX_FACTOR) / CELL_SIZE;
          waveY = Math.sin((x * 0.007) - (time * 3.2) + (worldRowCoord * 0.18)) * dynamicAmplitude * factor;
        }

        const currentY = baseY + waveY;

        if (x === -24) {
          ctx.moveTo(x, currentY);
        } else {
          ctx.lineTo(x, currentY);
        }
      }

      ctx.strokeStyle = baseGridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 2. Draw Vertical Grid Lines & Glowing Wave Crest with Parallax Nodes
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

        if (isLight) {
          // High-contrast flowing wave on light mode (Deep Cyan to Royal Violet)
          const alpha = 0.14 + (intensity * 0.55);
          const rColor = Math.round(2 + intensity * 145);
          const gColor = Math.round(132 - intensity * 81);
          const bColor = Math.round(199 + intensity * 35);
          ctx.strokeStyle = `rgba(${rColor}, ${gColor}, ${bColor}, ${alpha})`;
          ctx.lineWidth = 1.2 + (intensity * 1.8);
          ctx.stroke();

          // Glowing circular nodes at wave intersections (scrolling with parallax shift)
          if (intensity > 0.3) {
            const nodeAlpha = (intensity - 0.3) / 0.7;
            ctx.fillStyle = `rgba(2, 132, 199, ${nodeAlpha * 0.75})`;

            for (let r = -1; r <= rows + 1; r++) {
              const baseY = (r * CELL_SIZE) - verticalShift;
              const factor = 0.5 + 0.5 * Math.cos((dist / WAVE_RADIUS) * Math.PI);
              const worldRowCoord = (baseY + currentScrollY * PARALLAX_FACTOR) / CELL_SIZE;
              const waveY = Math.sin((baseX * 0.007) - (time * 3.2) + (worldRowCoord * 0.18)) * dynamicAmplitude * factor;
              const ptY = baseY + waveY;

              ctx.beginPath();
              ctx.arc(baseX, ptY, 2.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else {
          // Dynamic multi-tone color gradient (Cyan #00f0ff to Violet #d174d2)
          const alpha = 0.035 + (intensity * 0.28);
          const rColor = Math.round(0 + intensity * 200);
          const gColor = Math.round(240 - intensity * 125);
          const bColor = 255;

          ctx.strokeStyle = `rgba(${rColor}, ${gColor}, ${bColor}, ${alpha})`;
          ctx.lineWidth = 1 + (intensity * 1.3);
          ctx.stroke();

          // Glowing Circular Photon Nodes at Intersections (scrolling with parallax shift)
          if (intensity > 0.35) {
            const nodeAlpha = (intensity - 0.35) / 0.65;
            ctx.fillStyle = `rgba(0, 240, 255, ${nodeAlpha * 0.5})`;

            for (let r = -1; r <= rows + 1; r++) {
              const baseY = (r * CELL_SIZE) - verticalShift;
              const factor = 0.5 + 0.5 * Math.cos((dist / WAVE_RADIUS) * Math.PI);
              const worldRowCoord = (baseY + currentScrollY * PARALLAX_FACTOR) / CELL_SIZE;
              const waveY = Math.sin((baseX * 0.007) - (time * 3.2) + (worldRowCoord * 0.18)) * dynamicAmplitude * factor;
              const ptY = baseY + waveY;

              ctx.beginPath();
              ctx.arc(baseX, ptY, 1.8, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      } else {
        // Base partially visible static line outside wave
        ctx.strokeStyle = baseGridColor;
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
