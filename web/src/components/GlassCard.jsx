import { motion } from 'motion/react';

// Panel translúcido con borde de 1px y reflejo superior (utilidad .glass en index.css).
export function GlassCard({ as = 'div', className = '', children, ...props }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag className={`glass rounded-[28px] ${className}`} {...props}>
      {children}
    </Tag>
  );
}
