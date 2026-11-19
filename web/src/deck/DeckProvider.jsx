import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { sections } from '../content/sections.js';

const DeckContext = createContext(null);
const LAST = sections.length - 1;
export const CHANNEL = 'paec-deck';

const clamp = (i) => Math.min(Math.max(i, 0), LAST);
const stepsOf = (i) => sections[i].steps ?? 1;

function readHash() {
  const n = parseInt(window.location.hash.replace('#', ''), 10);
  return Number.isFinite(n) ? clamp(n - 1) : 0;
}

export function DeckProvider({ children }) {
  const [state, setState] = useState(() => ({ index: readHash(), step: 0, dir: 1 }));
  const [notesOpen, setNotesOpen] = useState(false);
  const startedAt = useRef(Date.now());

  const go = useCallback((target) => {
    setState((s) => {
      const index = clamp(target);
      if (index === s.index) return s;
      return { index, step: 0, dir: index > s.index ? 1 : -1 };
    });
  }, []);

  const next = useCallback(() => {
    setState((s) => {
      if (s.step < stepsOf(s.index) - 1) return { ...s, step: s.step + 1, dir: 1 };
      if (s.index < LAST) return { index: s.index + 1, step: 0, dir: 1 };
      return s;
    });
  }, []);

  const prev = useCallback(() => {
    setState((s) => {
      if (s.step > 0) return { ...s, step: s.step - 1, dir: -1 };
      if (s.index > 0) return { index: s.index - 1, step: stepsOf(s.index - 1) - 1, dir: -1 };
      return s;
    });
  }, []);

  const setStep = useCallback((step) => {
    setState((s) => ({ ...s, step: Math.min(Math.max(step, 0), stepsOf(s.index) - 1) }));
  }, []);

  // URL ↔ sección (recargar la página conserva la sección).
  useEffect(() => {
    const hash = `#${state.index + 1}`;
    if (window.location.hash !== hash) history.replaceState(null, '', hash);
  }, [state.index]);

  useEffect(() => {
    const onHash = () => go(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [go]);

  // Sincronía con la ventana de notas del presentador.
  const channelRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel(CHANNEL);
    channelRef.current = channel;
    channel.onmessage = ({ data }) => {
      if (data?.type === 'cmd') {
        if (data.cmd === 'next') next();
        if (data.cmd === 'prev') prev();
        if (data.cmd === 'go') go(data.index);
      }
      if (data?.type === 'hello') {
        const { index, step } = stateRef.current;
        channel.postMessage({ type: 'state', index, step });
      }
    };
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [next, prev, go]);

  useEffect(() => {
    channelRef.current?.postMessage({ type: 'state', index: state.index, step: state.step });
  }, [state.index, state.step]);

  const value = useMemo(
    () => ({
      ...state,
      section: sections[state.index],
      total: sections.length,
      go,
      next,
      prev,
      setStep,
      notesOpen,
      toggleNotes: () => setNotesOpen((o) => !o),
      startedAt: startedAt.current,
    }),
    [state, go, next, prev, setStep, notesOpen],
  );

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
}

export function useDeck() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error('useDeck debe usarse dentro de DeckProvider');
  return ctx;
}
