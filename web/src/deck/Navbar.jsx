import { motion } from 'motion/react';
import { useDeck } from './DeckProvider.jsx';
import { sections } from '../content/sections.js';

const spring = { type: 'spring', duration: 0.4, bounce: 0.12 };

// Índice flotante: la sección activa muestra su nombre y la píldora se desliza (layoutId).
export function Navbar() {
  const { index, go } = useDeck();

  return (
    <nav
      aria-label="Secciones"
      className="glass fixed left-1/2 top-4 z-40 flex -translate-x-1/2 items-center gap-0.5 rounded-full p-1.5 text-[17px]"
    >
      {sections.map((s, i) => {
        const active = i === index;
        return (
          <motion.button
            key={s.id}
            layout
            transition={spring}
            onClick={() => go(i)}
            aria-current={active ? 'step' : undefined}
            aria-label={`${i + 1}. ${s.title}`}
            className={`relative flex h-10 min-w-10 items-center justify-center rounded-full px-3 transition-colors duration-200 ${
              active ? 'text-hueso' : 'text-niebla/80 hover:text-hueso'
            }`}
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                transition={spring}
                className="absolute inset-0 rounded-full bg-white/[0.13] ring-1 ring-white/25"
              />
            )}
            <motion.span layout="position" className="relative font-semibold tabular-nums">
              {i + 1}
            </motion.span>
            {active && (
              <motion.span
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.08, duration: 0.2 } }}
                className="relative ml-2 whitespace-nowrap font-medium"
              >
                {s.short}
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}
