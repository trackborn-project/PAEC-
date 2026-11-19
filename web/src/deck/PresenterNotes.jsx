import { AnimatePresence, motion } from 'motion/react';
import { useDeck } from './DeckProvider.jsx';
import { Elapsed, NotesBody } from './NotesBody.jsx';

// Panel de notas (tecla N). Oculto por defecto porque se proyecta junto con la página.
export function PresenterNotes() {
  const { notesOpen, toggleNotes, index, startedAt } = useDeck();

  const openWindow = () => {
    window.open(`${window.location.pathname}?notas`, 'paec-notas', 'width=760,height=900');
    toggleNotes();
  };

  return (
    <AnimatePresence>
      {notesOpen && (
        <motion.aside
          key="notes"
          aria-label="Notas del presentador"
          initial={{ x: '104%' }}
          animate={{ x: 0, transition: { duration: 0.32, ease: [0.32, 0.72, 0, 1] } }}
          exit={{ x: '104%', transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
          className="fixed bottom-6 right-4 top-20 z-50 flex w-[min(600px,44vw)] flex-col rounded-[28px] border border-white/15 bg-[#071216] p-8 shadow-2xl"
        >
          <div className="mb-6 flex items-center justify-between gap-4 text-[18px] text-niebla">
            <Elapsed since={startedAt} />
            <div className="flex gap-2">
              <button onClick={openWindow} className="pressable rounded-full border border-white/15 px-4 py-2 hover:bg-white/10">
                Abrir en otra ventana
              </button>
              <button onClick={toggleNotes} className="pressable rounded-full border border-white/15 px-4 py-2 hover:bg-white/10">
                Cerrar (N)
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto pr-2">
            <NotesBody index={index} />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
