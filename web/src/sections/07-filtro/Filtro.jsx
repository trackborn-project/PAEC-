import { AnimatePresence, motion } from 'motion/react';
import { useDeck } from '../../deck/DeckProvider.jsx';
import { Missing } from '../../components/Missing.jsx';
import { FilterCanvas, GEO } from './FilterCanvas.jsx';

const STEPS = [
  {
    title: 'Entra el agua',
    text: 'La bomba impulsa el agua hacia el filtro.',
    missing: 'de dónde toma el agua la bomba',
  },
  {
    title: 'Atraviesa el filtro',
    text: 'El agua pasa por el filtro antes de llegar a las plantas.',
    missing: 'capas y materiales del filtro',
  },
  {
    title: 'Llega a la maceta',
    text: 'Sale del filtro hacia la tierra. El filtro es parte del recorrido del agua, no del circuito eléctrico.',
  },
];

// Zonas del corte que se resaltan en cada paso (unidades del viewBox).
const ZONES = [
  { x: 262, y: 0, w: 76, h: GEO.filter.y0 },
  { x: GEO.filter.x0 - 10, y: GEO.filter.y0 - 10, w: GEO.filter.x1 - GEO.filter.x0 + 20, h: GEO.filter.y1 - GEO.filter.y0 + 20 },
  { x: 110, y: GEO.outlet.y0, w: 380, h: 330 },
];

function CrossSection({ step }) {
  const z = ZONES[step];
  const { filter } = GEO;
  return (
    <svg viewBox="0 0 600 800" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <pattern id="media" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="18" stroke="#eef3f1" strokeOpacity="0.08" strokeWidth="6" />
        </pattern>
        <linearGradient id="soil-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b4426" />
          <stop offset="1" stopColor="#3a2414" />
        </linearGradient>
      </defs>

      {/* Tubo de entrada */}
      <rect x="280" y="-10" width="40" height={filter.y0 + 10} fill="#eef3f1" fillOpacity="0.05" stroke="#eef3f1" strokeOpacity="0.35" strokeWidth="2" />
      {/* Carcasa del filtro */}
      <rect x={filter.x0} y={filter.y0} width={filter.x1 - filter.x0} height={filter.y1 - filter.y0} rx="18" fill="url(#media)" stroke="#eef3f1" strokeOpacity="0.45" strokeWidth="2.5" />
      <text x={filter.x0} y={filter.y1 + 44} textAnchor="start" fill="#eef3f1" fillOpacity="0.55" fontSize="30" fontWeight="700" fontFamily="Archivo Variable">
        Filtro
      </text>
      {/* Tubo de salida */}
      <rect x="280" y={filter.y1} width="40" height={GEO.outlet.y1 - filter.y1} fill="#eef3f1" fillOpacity="0.05" stroke="#eef3f1" strokeOpacity="0.35" strokeWidth="2" />
      {/* Maceta con tierra */}
      <path d="M120 610 H480 L450 790 H150 Z" fill="url(#soil-g)" stroke="#c98b4e" strokeOpacity="0.6" strokeWidth="2.5" />
      <path d="M118 600 H482 V622 H118 Z" fill="#c98b4e" fillOpacity="0.85" />
      {/* Brote */}
      <path d="M380 600 C380 570 380 550 384 530" stroke="#8fd694" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M384 545 C360 530 352 512 356 500 C374 504 386 520 384 545 Z" fill="#8fd694" />
      <path d="M384 535 C404 518 420 514 430 518 C424 534 406 542 384 535 Z" fill="#8fd694" fillOpacity="0.85" />

      {/* Resaltado de la zona del paso actual */}
      <motion.rect
        initial={false}
        animate={{ x: z.x, y: z.y, width: z.w, height: z.h }}
        transition={{ type: 'spring', duration: 0.6, bounce: 0 }}
        rx="24"
        fill="none"
        stroke="#3fd6e0"
        strokeWidth="3"
        strokeDasharray="10 10"
        style={{ filter: 'drop-shadow(0 0 8px rgb(63 214 224 / 0.6))' }}
      />
    </svg>
  );
}

export default function Filtro() {
  const { step, setStep } = useDeck();

  return (
    <div className="mx-auto grid h-full max-w-[1760px] grid-cols-12 items-center gap-[4vw] px-[6vw] pb-[6vh] pt-[12vh]">
      <motion.div
        className="glass relative col-span-5 h-[min(78vh,820px)] overflow-hidden rounded-[36px]"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1, transition: { type: 'spring', duration: 0.8, bounce: 0 } }}
      >
        <div className="absolute left-1/2 top-1/2 aspect-[600/800] h-[94%] -translate-x-1/2 -translate-y-1/2">
          <CrossSection step={step} />
          <FilterCanvas step={step} />
        </div>
      </motion.div>

      <div className="col-span-7 flex flex-col gap-[3vh]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0 } }}
          className="title-width text-[clamp(48px,4.2vw,80px)] font-extrabold leading-[1.02] tracking-[-0.015em]"
        >
          Cómo funciona el filtro
        </motion.h2>

        <ol className="flex flex-col gap-3">
          {STEPS.map((s, i) => {
            const on = i === step;
            return (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0, delay: 0.15 + i * 0.07 } }}
              >
                <button
                  onClick={() => setStep(i)}
                  aria-current={on ? 'step' : undefined}
                  className={`pressable flex w-full items-start gap-5 rounded-[24px] border px-7 py-5 text-left transition-colors duration-200 ${
                    on ? 'glass border-agua/60' : 'border-transparent opacity-55 hover:opacity-90'
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[22px] font-bold tabular-nums ${
                      on ? 'bg-agua text-subsuelo' : 'border border-white/25'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[30px] font-bold leading-tight">{s.title}</span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, transition: { duration: 0.25, delay: 0.05 } }}
                          exit={{ opacity: 0, transition: { duration: 0.1 } }}
                          className="flex flex-col gap-2 text-[24px] leading-snug text-hueso/90"
                        >
                          {s.text}
                          {s.missing && (
                            <span>
                              <Missing>{s.missing}</Missing>
                            </span>
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ol>

        <p className="text-[20px] leading-snug text-niebla">
          Ilustración: el cambio de color representa el propósito del filtro; su eficacia aún no se ha medido.
        </p>
      </div>
    </div>
  );
}
