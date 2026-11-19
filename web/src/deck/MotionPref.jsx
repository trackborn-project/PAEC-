import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MotionConfig } from 'motion/react';

// Preferencia de movimiento de la presentación.
// 'system': respeta prefers-reduced-motion (por defecto).
// 'full': anima todo aunque el sistema pida reducir (útil si Windows tiene
//         desactivados los "Efectos de animación" en la laptop del proyector).
// 'reduced': versión simplificada siempre.
const KEY = 'paec-motion';
const MODES = ['system', 'full', 'reduced'];
const query = '(prefers-reduced-motion: reduce)';

const MotionPrefContext = createContext(null);

function readStored() {
  try {
    const v = localStorage.getItem(KEY);
    return MODES.includes(v) ? v : 'system';
  } catch {
    return 'system';
  }
}

export function MotionPrefProvider({ children }) {
  const [mode, setMode] = useState(readStored);
  const [systemReduce, setSystemReduce] = useState(() => window.matchMedia?.(query).matches ?? false);

  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const onChange = (e) => setSystemReduce(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      /* sin almacenamiento: la preferencia dura solo esta sesión */
    }
    // El CSS usa este atributo para decidir si aplica las reglas de movimiento reducido.
    document.documentElement.dataset.motion = mode;
  }, [mode]);

  // Alterna entre animación completa y reducida (la tecla M).
  const toggle = useCallback(() => {
    setMode((m) => {
      const reducedNow = m === 'reduced' || (m === 'system' && systemReduce);
      return reducedNow ? 'full' : 'reduced';
    });
  }, [systemReduce]);

  const reduce = mode === 'reduced' || (mode === 'system' && systemReduce);
  const value = useMemo(() => ({ mode, reduce, systemReduce, setMode, toggle }), [mode, reduce, systemReduce, toggle]);

  return (
    <MotionPrefContext.Provider value={value}>
      <MotionConfig reducedMotion={reduce ? 'always' : 'never'}>{children}</MotionConfig>
    </MotionPrefContext.Provider>
  );
}

export function useMotionPref() {
  const ctx = useContext(MotionPrefContext);
  if (!ctx) throw new Error('useMotionPref debe usarse dentro de MotionPrefProvider');
  return ctx;
}

// Sustituye a useReducedMotion de Motion: respeta también la preferencia elegida con M.
export const useReduce = () => useMotionPref().reduce;
