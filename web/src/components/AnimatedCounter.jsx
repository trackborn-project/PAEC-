import { useEffect, useRef } from 'react';
import { useReduce } from '../deck/MotionPref.jsx';
import { animate } from 'motion/react';

const defaultFormat = (v) => Math.round(v).toLocaleString('es-MX');

// Cuenta desde 0 hasta el valor al montarse. Escribe directo en el DOM (sin re-render por cuadro).
export function AnimatedCounter({ value, duration = 1.6, delay = 0, format = defaultFormat, className = '' }) {
  const ref = useRef(null);
  const reduce = useReduce();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => (node.textContent = format(v)),
    });
    return () => controls.stop();
  }, [value, duration, delay, reduce, format]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`} aria-label={format(value)}>
      {format(0)}
    </span>
  );
}
