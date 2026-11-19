import { AnimatePresence, motion } from 'motion/react';
import { useDeck } from '../../deck/DeckProvider.jsx';
import { Missing } from '../../components/Missing.jsx';
import { container, item } from '../../components/stagger.js';
import frontal from '../../assets/vista-frontal.webp';
import superior from '../../assets/vista-superior.webp';
import lateral from '../../assets/vista-lateral.webp';

// Las tres vistas se muestran a la misma escala (alto original 351 px = alto del visor),
// para que la vista superior se vea con su tamaño real relativo.
const SRC_H = 351;

const VIEWS = [
  {
    id: 'frontal',
    label: 'Frontal',
    src: frontal,
    w: 139,
    h: 351,
    alt: 'Vista frontal: caja con la ventana transparente que deja ver la tarjeta electrónica, un bloque negro con cables y dos sondas.',
    text: 'La ventana transparente deja ver la tarjeta electrónica. Abajo salen las dos sondas que se entierran en la maceta.',
    measures: [
      { side: 'top', label: 'ancho de la caja' },
      { side: 'right', label: 'alto total' },
    ],
  },
  {
    id: 'superior',
    label: 'Superior',
    src: superior,
    w: 128,
    h: 132,
    alt: 'Vista superior: cara cuadrada con un panel al centro y el botón de encendido a la derecha.',
    text: 'Desde arriba se ven el panel cuadrado y el botón de encendido.',
    measures: [
      { side: 'top', label: 'ancho' },
      { side: 'right', label: 'fondo' },
    ],
  },
  {
    id: 'lateral',
    label: 'Lateral',
    src: lateral,
    w: 141,
    h: 351,
    alt: 'Vista lateral: costado de la caja con un puerto USB-C y un orificio pequeño; una sonda visible.',
    text: 'En el costado están el puerto USB-C y un orificio pequeño. Las sondas quedan una detrás de la otra.',
    measures: [
      { side: 'top', label: 'fondo de la caja' },
      { side: 'right', label: 'largo de las sondas' },
    ],
  },
];

const swap = {
  initial: { opacity: 0, scale: 0.96, filter: 'blur(6px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { type: 'spring', duration: 0.5, bounce: 0 } },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(6px)', transition: { duration: 0.18 } },
};

// Cota de medida (sin valor: las medidas están pendientes en notas.md).
function Bracket({ side }) {
  const line = 'absolute border-agua/70';
  if (side === 'top')
    return (
      <div className="absolute -top-9 left-0 right-0 h-4" aria-hidden>
        <div className={`${line} left-0 right-0 top-1/2 border-t-2 border-dashed`} />
        <div className={`${line} left-0 top-0 h-full border-l-2`} />
        <div className={`${line} right-0 top-0 h-full border-r-2`} />
      </div>
    );
  return (
    <div className="absolute -right-9 bottom-0 top-0 w-4" aria-hidden>
      <div className={`${line} bottom-0 left-1/2 top-0 border-l-2 border-dashed`} />
      <div className={`${line} left-0 top-0 w-full border-t-2`} />
      <div className={`${line} bottom-0 left-0 w-full border-b-2`} />
    </div>
  );
}

export default function Diseno() {
  const { step, setStep } = useDeck();
  const view = VIEWS[step] ?? VIEWS[0];

  return (
    <div className="mx-auto grid h-full max-w-[1760px] grid-cols-12 items-center gap-[4vw] px-[6vw] pb-[6vh] pt-[12vh]">
      <motion.div className="col-span-5 flex flex-col gap-[3vh]" variants={container(0.1, 0.08)} initial="hidden" animate="show">
        <motion.h2 variants={item} className="title-width text-[clamp(48px,4.2vw,80px)] font-extrabold leading-[1.02] tracking-[-0.015em]">
          Diseño del prototipo
        </motion.h2>

        {/* Pestañas con indicador deslizante; también responden a ← → como pasos de la sección */}
        <motion.div variants={item} role="tablist" aria-label="Vistas técnicas" className="glass flex w-fit gap-1 rounded-full p-1.5">
          {VIEWS.map((v, i) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={i === step}
              onClick={() => setStep(i)}
              className={`pressable relative rounded-full px-6 py-2.5 text-[24px] font-semibold transition-colors duration-200 ${
                i === step ? 'text-subsuelo' : 'text-niebla hover:text-hueso'
              }`}
            >
              {i === step && (
                <motion.span
                  layoutId="view-tab"
                  className="absolute inset-0 rounded-full bg-agua"
                  transition={{ type: 'spring', duration: 0.4, bounce: 0.12 }}
                />
              )}
              <span className="relative">{v.label}</span>
            </button>
          ))}
        </motion.div>

        <motion.div variants={item} className="min-h-[5.5em]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={view.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              className="text-[clamp(26px,1.9vw,32px)] leading-snug text-hueso/90"
            >
              {view.text}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div variants={item} className="glass flex flex-col gap-3 rounded-[24px] px-7 py-5">
          <p className="text-[20px] text-niebla">Medidas de esta vista</p>
          {view.measures.map((m) => (
            <div key={m.label} className="flex flex-wrap items-center justify-between gap-3 text-[24px]">
              <span>{m.label[0].toUpperCase() + m.label.slice(1)}</span>
              <Missing>medida</Missing>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="glass relative col-span-7 flex h-[min(76vh,800px)] items-center justify-center overflow-hidden rounded-[36px]"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1, transition: { type: 'spring', duration: 0.8, bounce: 0, delay: 0.15 } }}
      >
        {/* Cuadrícula técnica de fondo */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #eef3f1 1px, transparent 1px), linear-gradient(to bottom, #eef3f1 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgb(63_214_224/0.14),transparent_70%)]" />

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.figure key={view.id} {...swap} className="relative m-0" style={{ height: `calc(min(76vh, 800px) * 0.72 * ${view.h / SRC_H})`, aspectRatio: `${view.w} / ${view.h}` }}>
            <img src={view.src} alt={view.alt} className="h-full w-full object-contain drop-shadow-[0_24px_30px_rgb(0_0_0/0.5)]" draggable={false} />
            {view.measures.map((m) => (
              <Bracket key={m.side} side={m.side} />
            ))}
          </motion.figure>
        </AnimatePresence>

        <p className="absolute bottom-5 left-7 text-[18px] text-niebla">Las tres vistas están a la misma escala</p>
      </motion.div>
    </div>
  );
}
