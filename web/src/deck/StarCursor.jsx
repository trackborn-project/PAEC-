import { useEffect, useRef, useState } from 'react';
import { useReduce } from './MotionPref.jsx';

// Estela de estrellitas que sigue al ratón en todas las secciones.
// Un solo canvas fijo, sin eventos de puntero; pool fijo de partículas;
// el bucle de dibujo solo corre mientras hay estrellas vivas (en reposo no gasta cuadros).
// No se monta en pantallas táctiles ni con movimiento reducido.
const POOL = 90;
const LIFE = 650; // ms
const COLORS = ['#39ff88', '#39ff88', '#c4ccc9', '#eef1ef'];

const finePointer = () => window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;

export function StarCursor() {
  const reduce = useReduce();
  const [fine, setFine] = useState(finePointer);

  useEffect(() => {
    const mq = window.matchMedia?.('(hover: hover) and (pointer: fine)');
    if (!mq) return;
    const on = () => setFine(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  if (reduce || !fine) return null;
  return <StarCanvas />;
}

function drawStar(ctx, x, y, r, rot) {
  // Destello de 4 puntas
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const rad = i % 2 === 0 ? r : r * 0.32;
    ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function StarCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pool = Array.from({ length: POOL }, () => ({ alive: false }));
    let next = 0;
    let raf = 0;
    let running = false;
    let last = null;

    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = (x, y) => {
      const p = pool[next];
      next = (next + 1) % POOL; // reutiliza la más vieja si el pool se llena
      p.alive = true;
      p.x = x + (Math.random() - 0.5) * 8;
      p.y = y + (Math.random() - 0.5) * 8;
      p.vx = (Math.random() - 0.5) * 0.6;
      p.vy = Math.random() * 0.5 + 0.15;
      p.r = 2.5 + Math.random() * 3.5;
      p.rot = Math.random() * Math.PI;
      p.vr = (Math.random() - 0.5) * 0.08;
      p.t0 = performance.now();
      p.color = COLORS[(Math.random() * COLORS.length) | 0];
    };

    const frame = (now) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      let alive = 0;
      for (const p of pool) {
        if (!p.alive) continue;
        const k = (now - p.t0) / LIFE;
        if (k >= 1) {
          p.alive = false;
          continue;
        }
        alive++;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        // Se desvanece y se encoge (ease-out)
        const fade = 1 - k * k;
        ctx.globalAlpha = fade * 0.9;
        ctx.fillStyle = p.color;
        if (p.color === '#39ff88') {
          ctx.shadowColor = '#39ff88';
          ctx.shadowBlur = 8;
        } else ctx.shadowBlur = 0;
        drawStar(ctx, p.x, p.y, p.r * (1 - k * 0.7), p.rot);
      }
      ctx.shadowBlur = 0;
      if (alive) raf = requestAnimationFrame(frame);
      else running = false;
    };

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      // La diapositiva DRYBOT tiene su propio brillo de cursor.
      if (e.target?.closest?.('[data-sin-estrellas]')) return;
      const x = e.clientX;
      const y = e.clientY;
      const dist = last ? Math.hypot(x - last.x, y - last.y) : 0;
      last = { x, y };
      // Más estrellas cuanto más rápido se mueve el ratón, con tope.
      const n = Math.min(3, 1 + Math.floor(dist / 24));
      if (dist < 3 && Math.random() < 0.6) return;
      for (let i = 0; i < n; i++) spawn(x, y);
      canvas.dataset.dibujado = '1';
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} data-testid="estrellitas" className="pointer-events-none fixed inset-0 z-[60] h-full w-full" aria-hidden />;
}
