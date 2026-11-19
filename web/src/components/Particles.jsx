import { useEffect, useRef } from 'react';
import { useReduce } from '../deck/MotionPref.jsx';

export const DUST = ['#f2a33a', '#eef3f1', '#c98b4e'];
export const WATER = ['#3fd6e0', '#eef3f1', '#8fd694'];

// Partículas en Canvas: polvo (ámbar) o gotas (cian). Con movimiento reducido se dibuja un cuadro estático.
// Pasa paletas constantes (DUST, WATER): un arreglo nuevo en cada render reinicia la animación.
export function Particles({ count = 70, palette = DUST, rise = 0.12, className = '' }) {
  const ref = useRef(null);
  const reduce = useReduce();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.6 + Math.random() * 2.2,
      a: 0.15 + Math.random() * 0.45,
      vx: 0.05 + Math.random() * 0.25,
      vy: -(rise * (0.4 + Math.random())),
      phase: Math.random() * Math.PI * 2,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        if (!reduce) {
          p.x += p.vx + Math.sin(t / 1800 + p.phase) * 0.15;
          p.y += p.vy;
          if (p.x > w + 4) p.x = -4;
          if (p.y < -4) p.y = h + 4;
          if (p.y > h + 4) p.y = -4;
        }
        ctx.globalAlpha = p.a * (0.75 + 0.25 * Math.sin(t / 900 + p.phase));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [count, palette, rise, reduce]);

  return <canvas ref={ref} className={`pointer-events-none h-full w-full ${className}`} aria-hidden />;
}
