import { useEffect } from 'react';
import { useDeck } from './DeckProvider.jsx';
import { useMotionPref } from './MotionPref.jsx';

export function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
  else document.exitFullscreen?.().catch(() => {});
}

// ← →: anterior/siguiente (primero recorre los pasos internos). F: pantalla completa. N: notas.
// M: alterna animación completa / reducida (por defecto se respeta la preferencia del sistema).
export function useKeyboard() {
  const { next, prev, go, total, toggleNotes } = useDeck();
  const { toggle: toggleMotion } = useMotionPref();

  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      // Los sliders y campos usan sus propias flechas.
      if (t.closest?.('input, textarea, select, [contenteditable="true"], [data-own-keys]')) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          next();
          break;
        case ' ':
          if (t.closest?.('button, a')) return; // Espacio activa el botón enfocado.
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prev();
          break;
        case 'Home':
          go(0);
          break;
        case 'End':
          go(total - 1);
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'n':
        case 'N':
          toggleNotes();
          break;
        case 'm':
        case 'M':
          toggleMotion();
          break;
        default:
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, go, total, toggleNotes, toggleMotion]);
}
