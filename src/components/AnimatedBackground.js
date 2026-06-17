import { useEffect, useRef, memo } from 'react';
import './AnimatedBackground.css';

function AnimatedBackground({
  variant = 'dark',
  density = 1,
  showGrid = true,
  showOrbs = true,
  showLines = true,
  className = '',
}) {
  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const mouseRef   = useRef({ x: -9999, y: -9999 });
  const visibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const palette = {
      dark:  { particle: 'rgba(201,168,76,', line: 'rgba(201,168,76,', bg: 'transparent' },
      light: { particle: 'rgba(12,24,37,',   line: 'rgba(12,24,37,',  bg: 'transparent' },
      gold:  { particle: 'rgba(201,168,76,', line: 'rgba(201,168,76,', bg: 'transparent' },
    };
    const col = palette[variant] || palette.dark;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const COUNT = Math.floor((canvas.width / 1440) * 60 * density);
    const particles = Array.from({ length: Math.max(15, Math.min(COUNT, 60)) }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 2 + 0.5,
      o:  Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));

    const onMouse = e => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);

    let frameCount = 0;
    const draw = () => {
      if (!visibleRef.current) { animRef.current = null; return; }
      animRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particles.forEach(p => {
        p.pulse += 0.02;
        p.x += p.vx;
        p.y += p.vy;

        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x += (dx / dist) * 1.5;
          p.y += (dy / dist) * 1.5;
        }

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

      if (showLines && frameCount % 2 === 0) {
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

    /* ── Start/stop animation based on visibility ── */
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting && !animRef.current) {
        draw();
      }
    }, { threshold: 0.05 });
    io.observe(canvas.parentElement || canvas);

    return () => {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [variant, density, showLines]);

  return (
    <div className={`anim-bg anim-bg--${variant} ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="anim-bg__canvas" />
      {showGrid && <div className="anim-bg__grid" />}
      {showOrbs && (
        <>
          <div className="anim-bg__orb anim-bg__orb--1" />
          <div className="anim-bg__orb anim-bg__orb--2" />
          <div className="anim-bg__orb anim-bg__orb--3" />
        </>
      )}
      <div className="anim-bg__corner anim-bg__corner--tl" />
      <div className="anim-bg__corner anim-bg__corner--br" />
    </div>
  );
}

export default memo(AnimatedBackground);
