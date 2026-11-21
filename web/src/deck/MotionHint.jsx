import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useMotionPref } from './MotionPref.jsx';

// Aviso en la esquina: si el sistema pide reducir movimiento, explica cómo activar
// las animaciones; al pulsar M confirma el modo elegido.
export function MotionHint() {
  const { mode, reduce, systemReduce } = useMotionPref();
  const [message, setMessage] = useState(
    systemReduce && mode === 'system'
      ? 'Tu sistema tiene las animaciones reducidas. Pulsa M para verlas completas.'
      : null,
  );
  const first = useRef(true);
  const timer = useRef();

  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (message) timer.current = setTimeout(() => setMessage(null), 9000);
      return;
    }
    setMessage(reduce ? 'Animación reducida (M para cambiar)' : 'Animación completa (M para cambiar)');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          role="status"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="fixed bottom-6 left-6 z-50 max-w-[560px] rounded-2xl border border-white/15 bg-[#171c1b] px-5 py-3 text-[20px] leading-snug text-hueso shadow-2xl"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
