import { motion } from 'motion/react';
import { useDeck } from './DeckProvider.jsx';
import { sections } from '../content/sections.js';

const spring = { type: 'spring', duration: 0.4, bounce: 0.12 };

// Índice flotante: la sección activa muestra su nombre y la píldora se desliza (layoutId).
// En pantallas angostas se muestra una versión compacta: anterior · sección actual · siguiente.
export function Navbar() {
  const { index, go, prev, next, total, section } = useDeck();

  return (
    <>
      <nav
        aria-label="Secciones"
        className="glass fixed left-1/2 top-4 z-40 hidden -translate-x-1/2 items-center gap-0.5 rounded-full p-1.5 text-[17px] md:flex"
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
                active ? 'text-hueso' : 'text-niebla hover:text-hueso'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  transition={spring}
                  className="absolute inset-0 rounded-full bg-white/[0.1] ring-1 ring-agua/50 shadow-[0_0_14px_rgb(57_255_136/0.25)]"
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

      <nav aria-label="Secciones (compacto)" className="glass fixed inset-x-3 top-3 z-40 flex items-center justify-between gap-2 rounded-full p-1.5 text-[16px] md:hidden">
        <button onClick={prev} aria-label="Anterior" className="pressable grid h-10 w-10 place-items-center rounded-full border border-white/10">
          ←
        </button>
        <span className="truncate font-medium">
          <span className="tabular-nums text-agua">{index + 1}</span>
          <span className="text-niebla">/{total}</span> {section.short}
        </span>
        <button onClick={next} aria-label="Siguiente" className="pressable grid h-10 w-10 place-items-center rounded-full border border-white/10">
          →
        </button>
      </nav>
    </>
  );
}
