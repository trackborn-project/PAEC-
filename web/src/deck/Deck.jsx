import { AnimatePresence, motion } from 'motion/react';
import { useDeck } from './DeckProvider.jsx';
import { useKeyboard } from './useKeyboard.js';
import { OrbBackground } from './OrbBackground.jsx';
import { Navbar } from './Navbar.jsx';
import { ProgressBar } from './ProgressBar.jsx';
import { PresenterNotes } from './PresenterNotes.jsx';
import { MotionHint } from './MotionHint.jsx';
import { sectionComponents } from '../sections/index.js';
import { widthFor } from '../content/sections.js';

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 48 }),
  center: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', duration: 0.55, bounce: 0 },
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir * -32,
    transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
  }),
};

export function Deck() {
  const { index, dir, section } = useDeck();
  useKeyboard();
  const Current = sectionComponents[section.id];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <OrbBackground mood={section.mood} />
      <div className="grain pointer-events-none fixed inset-0 z-[1]" aria-hidden />

      <main
        className="relative z-10 h-full w-full"
        style={{ '--wdth': widthFor(section.mood) }}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.section
            key={index}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
            aria-label={section.title}
          >
            <Current />
          </motion.section>
        </AnimatePresence>
      </main>

      <Navbar />
      <ProgressBar />
      <PresenterNotes />
      <MotionHint />
    </div>
  );
}
