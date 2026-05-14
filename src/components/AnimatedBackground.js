import { useEffect, useRef, memo } from 'react';
import './AnimatedBackground.css';

/* ─────────────────────────────────────────────────────────────
   AnimatedBackground — canvas-based particle + grid system
   Props:
     variant: 'dark' | 'light' | 'gold'  (default: 'dark')
     density: number  (particle count multiplier, default 1)
     showGrid: bool   (show dot-grid overlay, default true)
     showOrbs: bool   (show glowing orbs, default true)
     showLines: bool  (show connecting lines, default true)
───────────────────────────────────────────────────────────────*/
function AnimatedBackground({
  variant = 'dark',
  density = 1,
  showGrid = true,
  showOrbs = true,
  showLines = true,
  className = '',
}) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    /* ── Colour palette per variant ── */
    const palette = {
      dark:  { particle: 'rgba(201,168,76,', line: 'rgba(201,168,76,', bg: 'transparent' },
      light: { particle: 'rgba(12,24,37,',   line: 'rgba(12,24,37,',  bg: 'transparent' },
      gold:  { particle: 'rgba(201,168,76,', line: 'rgba(201,168,76,', bg: 'transparent' },
    };
    const col = palette[variant] || palette.dark;

    /* ── Resize ── */
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ── Particles ── */
    const COUNT = Math.floor((canvas.width / 1440) * 80 * density);
    const particles = Array.from({ length: Math.max(20, Math.min(COUNT, 120)) }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 2 + 0.5,
      o:  Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));

    /* ── Mouse interaction ── */
    const onMouse = e => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);

    /* ── Draw loop ── */
    let frame = 0; // eslint-disable-line no-unused-vars
    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      /* Update + draw particles */
      particles.forEach(p => {
        p.pulse += 0.02;
        p.x += p.vx;
        p.y += p.vy;

        /* Mouse repulsion */
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x += (dx / dist) * 1.5;
          p.y += (dy / dist) * 1.5;
        }

        /* Wrap edges */
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const alpha = p.o * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = col.particle + alpha + ')';
        ctx.fill();
      });

      /* Draw connecting lines */
      if (showLines) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = col.line + (0.15 * (1 - d / 120)) + ')';
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [variant, density, showLines]);

  return (
    <div className={`anim-bg anim-bg--${variant} ${className}`} aria-hidden="true">
      {/* Canvas particles */}
      <canvas ref={canvasRef} className="anim-bg__canvas" />

      {/* Dot grid overlay */}
      {showGrid && <div className="anim-bg__grid" />}

      {/* Glowing orbs */}
      {showOrbs && (
        <>
          <div className="anim-bg__orb anim-bg__orb--1" />
          <div className="anim-bg__orb anim-bg__orb--2" />
          <div className="anim-bg__orb anim-bg__orb--3" />
        </>
      )}

      {/* Scan line */}
      <div className="anim-bg__scan" />

      {/* Corner accents */}
      <div className="anim-bg__corner anim-bg__corner--tl" />
      <div className="anim-bg__corner anim-bg__corner--br" />
    </div>
  );
}

export default memo(AnimatedBackground);
