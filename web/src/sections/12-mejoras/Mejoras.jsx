import { motion } from 'motion/react';
import { useDeck } from '../../deck/DeckProvider.jsx';
import { mejoras } from '../../content/fase3.js';
import { Parte } from '../../components/Parte.jsx';

// Hoja de ruta que se revela grupo por grupo con → (o clic en el grupo).
export default function Mejoras() {
  const { step, setStep } = useDeck();
  const ease = [0.23, 1, 0.32, 1];

  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-6 overflow-y-auto px-5 pb-10 pt-20 md:justify-center md:gap-[4vh] md:overflow-hidden md:px-[6vw] md:pb-[6vh] md:pt-[12vh]">
      <Parte />
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0 } }}
        className="title-width text-[clamp(34px,min(4.2vw,8vh),80px)] font-bold leading-[1.02] tracking-[-0.03em]"
      >
        Mejoras futuras
      </motion.h2>

      <ol className="relative grid grid-cols-1 gap-4 md:grid-cols-5">
        {/* Línea de la ruta: se llena con el avance (scaleX) */}
        <div aria-hidden className="absolute left-0 right-0 top-[22px] hidden h-0.5 bg-white/10 md:block">
          <div
            className="h-full origin-left bg-agua shadow-[0_0_10px_rgb(57_255_136/0.6)] transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
            style={{ transform: `scaleX(${step / (mejoras.length - 1)})` }}
          />
        </div>
        {mejoras.map((g, i) => {
          const visible = i <= step;
          return (
            <motion.li
              key={g.grupo}
              initial={false}
              animate={{ opacity: visible ? 1 : 0.3 }}
              transition={{ duration: 0.35, ease, delay: visible ? 0.05 : 0 }}
              className="relative flex flex-col gap-3"
            >
              <button onClick={() => setStep(i)} className="pressable flex flex-col items-start gap-3 text-left" aria-current={i === step ? 'step' : undefined}>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-[18px] font-bold tabular-nums ${visible ? 'bg-agua text-subsuelo shadow-[0_0_14px_rgb(57_255_136/0.5)]' : 'border border-white/25 bg-subsuelo'}`}>
                  {i + 1}
                </span>
                <span className="text-[clamp(22px,1.9vw,32px)] font-bold">{g.grupo}</span>
              </button>
              <ul className="glass flex flex-col gap-2 rounded-[22px] px-5 py-4">
                {g.items.map((t) => (
                  <li key={t} className="text-[clamp(17px,1.3vw,22px)] leading-snug text-hueso/90">
                    {t}
                  </li>
                ))}
              </ul>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
