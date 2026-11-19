import { useEffect, useRef } from 'react';
import { useReduce } from '../deck/MotionPref.jsx';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

// Tarjeta 3D que se inclina hacia el cursor (en toda la ventana), con resortes y un reflejo móvil.
export function TiltCard({ children, className = '', max = 14 }) {
  const ref = useRef(null);
  const reduce = useReduce();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const cfg = { stiffness: 120, damping: 16, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, (v) => v * max), cfg);
  const rotateX = useSpring(useTransform(py, (v) => -v * max * 0.75), cfg);
  const glareX = useSpring(useTransform(px, (v) => `${v * -60}%`), cfg);
  const glareY = useSpring(useTransform(py, (v) => `${v * -60}%`), cfg);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const clamp = (v) => Math.max(-1, Math.min(1, v));
      px.set(clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 0.9)));
      py.set(clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 0.9)));
    };
    const reset = () => {
      px.set(0);
      py.set(0);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', reset);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', reset);
    };
  }, [px, py, reduce]);

  return (
    <div ref={ref} className={className} style={{ perspective: 1400 }}>
      <motion.div
        className="glass relative h-full w-full overflow-hidden rounded-[36px]"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {children}
        {/* Reflejo que se desplaza en sentido contrario a la inclinación */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-1/2 bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.16),transparent_45%)]"
          style={{ x: glareX, y: glareY }}
        />
      </motion.div>
    </div>
  );
}
