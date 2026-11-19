import { motion } from 'motion/react';
import { useDeck } from './DeckProvider.jsx';

// Barra de progreso: avanza por sección y por paso interno. Solo anima scaleX.
export function ProgressBar() {
  const { index, step, section, total } = useDeck();
  const steps = section.steps ?? 1;
  const progress = (index + (steps > 1 ? step / (steps - 1) : 1)) / total;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 h-1.5 bg-white/[0.06]" aria-hidden>
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-ambar via-tierra to-agua"
        initial={false}
        animate={{ scaleX: progress }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0 }}
      />
    </div>
  );
}
