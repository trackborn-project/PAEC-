import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

// Tooltip origin-aware: nace del elemento que lo dispara.
// La primera vez espera 300 ms; si otro tooltip se cerró hace poco, aparece al instante.
let lastClosed = 0;

const placement = {
  top: { box: 'bottom-full left-1/2 mb-3 -translate-x-1/2', origin: 'bottom center', y: 6 },
  bottom: { box: 'top-full left-1/2 mt-3 -translate-x-1/2', origin: 'top center', y: -6 },
  right: { box: 'left-full top-1/2 ml-3 -translate-y-1/2', origin: 'left center', y: 0 },
  left: { box: 'right-full top-1/2 mr-3 -translate-y-1/2', origin: 'right center', y: 0 },
};

export function Tooltip({ content, side = 'top', children, className = '', open: controlled, width = 360 }) {
  const [hover, setHover] = useState(false);
  const [instant, setInstant] = useState(false);
  const timer = useRef();
  const id = useId();
  const p = placement[side];
  const open = controlled ?? hover;

  const show = () => {
    clearTimeout(timer.current);
    const warm = Date.now() - lastClosed < 400;
    setInstant(warm);
    timer.current = setTimeout(() => setHover(true), warm ? 0 : 300);
  };
  const hide = () => {
    clearTimeout(timer.current);
    if (hover) lastClosed = Date.now();
    setHover(false);
  };

  return (
    <span
      className={`relative inline-flex ${className}`}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
      aria-describedby={open ? id : undefined}
    >
      {children}
      <AnimatePresence>
        {open && (
          <span className={`pointer-events-none absolute z-50 ${p.box}`} style={{ width }}>
            <motion.span
              id={id}
              role="tooltip"
              initial={instant ? false : { opacity: 0, scale: 0.96, y: p.y }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformOrigin: p.origin }}
              className="block rounded-2xl border border-white/15 bg-[#0c2228]/95 px-5 py-4 text-[20px] leading-snug text-hueso shadow-2xl"
            >
              {content}
            </motion.span>
          </span>
        )}
      </AnimatePresence>
    </span>
  );
}
