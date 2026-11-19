import { forwardRef } from 'react';
import { motion } from 'motion/react';

// Tarjeta de cristal con un foco de luz que sigue al puntero.
export const SpotlightCard = forwardRef(function SpotlightCard(
  { className = '', children, onPointerMove, ...props },
  ref,
) {
  const handleMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', `${e.clientX - r.left}px`);
    el.style.setProperty('--sy', `${e.clientY - r.top}px`);
    onPointerMove?.(e);
  };
  return (
    <motion.div ref={ref} onPointerMove={handleMove} className={`glass spotlight rounded-[24px] ${className}`} {...props}>
      {children}
    </motion.div>
  );
});
