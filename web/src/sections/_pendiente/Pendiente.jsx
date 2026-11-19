import { motion } from 'motion/react';
import { useDeck } from '../../deck/DeckProvider.jsx';

// Sección que todavía no se construye (se completa en la fase indicada).
export default function Pendiente() {
  const { index, section } = useDeck();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-[6vw] text-center">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[28px] text-niebla tabular-nums">
        {index + 1}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0 }}
        className="title-width text-[clamp(48px,5vw,96px)] font-extrabold leading-tight"
      >
        {section.title}
      </motion.h2>
      <p className="text-[24px] text-niebla">Se construye en la Fase {section.phase}.</p>
    </div>
  );
}
