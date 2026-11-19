import { useEffect, useRef } from 'react';
import { useReduce } from '../../deck/MotionPref.jsx';

// Partículas de agua en el corte del filtro. Coordenadas en unidades del viewBox (600×800).
// El paso limita hasta dónde llega el agua: 0 = hasta el filtro, 1 = lo atraviesa, 2 = llega a la maceta.
export const GEO = {
  pipe: { x0: 282, x1: 318 },
  filter: { x0: 160, x1: 440, y0: 130, y1: 470 },
  outlet: { y0: 470, y1: 600 },
  soil: { y: 640 },
};
const LIMITS = [GEO.filter.y0 + 6, GEO.filter.y1, GEO.soil.y];

const TURBID = [150, 112, 60];
const CLEAN = [63, 214, 224];

function spawn(p) {
  p.x = GEO.pipe.x0 + 4 + Math.random() * (GEO.pipe.x1 - GEO.pipe.x0 - 8);
  p.y = -Math.random() * 120;
  p.vy = 2.2 + Math.random() * 1.2;
  p.r = 2.4 + Math.random() * 2.4;
  p.tx = GEO.filter.x0 + 20 + Math.random() * (GEO.filter.x1 - GEO.filter.x0 - 40);
  p.clean = 0;
  p.alpha = 1;
}

export function FilterCanvas({ step }) {
  const ref = useRef(null);
  const stepRef = useRef(step);
  stepRef.current = step;
  const reduce = useReduce();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let scale = 1;
    let raf = 0;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      scale = w / 600;
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
      // Cambiar el tamaño borra el lienzo: sin bucle de animación hay que volver a dibujar.
      if (reduce && ready) tick();
    };
    let ready = false;

    const parts = Array.from({ length: 220 }, () => {
      const p = {};
      spawn(p);
      p.y = -Math.random() * 800;
      return p;
    });

    const tick = () => {
      const limit = LIMITS[stepRef.current] ?? LIMITS[0];
      ctx.clearRect(0, 0, 600, 800);
      for (const p of parts) {
        const { filter } = GEO;
        if (p.y < filter.y0) {
          p.y += p.vy;
        } else if (p.y < filter.y1) {
          // Dentro del filtro: avanza lento y se dispersa hacia su columna.
          p.y += p.vy * 0.28;
          p.x += (p.tx - p.x) * 0.02 + (Math.random() - 0.5) * 1.2;
          p.clean = Math.min(1, (p.y - filter.y0) / (filter.y1 - filter.y0));
        } else if (p.y < GEO.outlet.y1) {
          // Sale reunida por el tubo.
          const cx = (GEO.pipe.x0 + GEO.pipe.x1) / 2;
          p.x += (cx + (Math.random() - 0.5) * 20 - p.x) * 0.12;
          p.y += p.vy * 1.1;
          p.clean = 1;
        } else {
          // En la tierra: se absorbe.
          p.y += p.vy * 0.4;
          p.x += (Math.random() - 0.5) * 3;
          p.alpha -= 0.03;
        }
        if (p.y >= limit || p.alpha <= 0) spawn(p);

        const c = TURBID.map((t, i) => Math.round(t + (CLEAN[i] - t) * p.clean));
        ctx.globalAlpha = Math.max(0, p.alpha) * 0.9;
        ctx.fillStyle = `rgb(${c[0]} ${c[1]} ${c[2]})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (reduce) {
      // Movimiento reducido: un cuadro estático con las partículas ya distribuidas.
      for (let k = 0; k < 400; k++) tick();
    } else raf = requestAnimationFrame(tick);
    ready = true;

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // Con movimiento reducido no hay bucle: se vuelve a dibujar al cambiar de paso.
  }, [reduce, reduce ? step : -1]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}
