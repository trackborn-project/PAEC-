import { AnimatePresence, motion } from 'motion/react';
import { useDeck } from '../../deck/DeckProvider.jsx';
import { Insertar, Missing } from '../../components/Missing.jsx';
import { container, item } from '../../components/stagger.js';
import frontal from '../../assets/vista-frontal.webp';
import superior from '../../assets/vista-superior.webp';
import lateral from '../../assets/vista-lateral.webp';
import isometrica from '../../assets/isometrica.webp';
import { Parte } from '../../components/Parte.jsx';

// Las tres vistas se muestran a la misma escala (alto original 351 px = alto del visor),
// para que la vista superior se vea con su tamaño real relativo.
const SRC_H = 351;

// Orden de la rúbrica: isométrica, lateral, frontal, superior y trasera.
const VIEWS = [
  {
    id: 'isometrica',
    label: 'Isométrica',
    src: isometrica,
    w: 338,
    h: 351,
    alt: 'Render isométrico del módulo: caja con pantalla arriba, botón de encendido, ventana frontal transparente con la tarjeta electrónica, puerto USB-C y dos sondas.',
    text: 'El módulo completo en vista isométrica. La caja mide 5 × 5 × 5 cm y el alto total es de 10 cm.',
    cotas: false, // render en perspectiva: las medidas van en el panel, sin cotas sobre la imagen
    measures: [
      { side: 'top', label: 'caja', valor: '5 × 5 × 5 cm' },
      { side: 'right', label: 'alto total', valor: '10 cm' },
    ],
  },
  {
    id: 'frontal',
    label: 'Frontal',
    src: frontal,
    w: 139,
    h: 351,
    alt: 'Vista frontal: caja con la ventana transparente que deja ver la tarjeta electrónica, un bloque negro con cables y dos sondas.',
    text: 'La ventana transparente deja ver la tarjeta electrónica. Abajo salen las dos sondas que se entierran en la maceta.',
    measures: [
      { side: 'top', label: 'ancho de la caja', valor: '5 cm' },
      { side: 'right', label: 'alto total', valor: '10 cm' },
    ],
  },
  {
    id: 'superior',
    label: 'Superior',
    src: superior,
    w: 128,
    h: 132,
    alt: 'Vista superior: cara cuadrada con un panel al centro y el botón de encendido a la derecha.',
    text: 'Desde arriba se ven el panel cuadrado y el botón de encendido. La caja mide 5 × 5 × 5 cm.',
    measures: [
      { side: 'top', label: 'ancho', valor: '5 cm' },
      { side: 'right', label: 'fondo', valor: '5 cm' },
    ],
  },
  {
    id: 'lateral',
    label: 'Lateral',
    src: lateral,
    w: 141,
    h: 351,
    alt: 'Vista lateral: costado de la caja con un puerto USB-C y un orificio pequeño; una sonda visible.',
    text: 'En el costado están el puerto USB-C, que alimenta la electrónica, y un orificio con un LED de aviso. Las sondas quedan una detrás de la otra.',
    measures: [
      { side: 'top', label: 'fondo de la caja', valor: '5 cm' },
      { side: 'right', label: 'largo de las sondas', valor: '5 cm' },
    ],
  },
  {
    id: 'trasera',
    label: 'Trasera',
    src: null,
    w: 139,
    h: 351,
    alt: '',
    text: 'Vista trasera del módulo.',
    measures: [
      { side: 'top', label: 'ancho de la caja', valor: '5 cm' },
      { side: 'right', label: 'alto total', valor: '10 cm' },
    ],
  },
];
// Lateral antes que frontal, como pide la rúbrica.
VIEWS.splice(1, 0, ...VIEWS.splice(VIEWS.findIndex((v) => v.id === 'lateral'), 1));

const swap = {
  initial: { opacity: 0, scale: 0.96, filter: 'blur(6px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { type: 'spring', duration: 0.5, bounce: 0 } },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(6px)', transition: { duration: 0.18 } },
};

// Cota de medida; el valor se muestra en el panel (notas.md, "Datos técnicos pendientes").
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
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-6 overflow-y-auto px-5 pb-10 pt-20 md:grid md:grid-cols-12 md:items-center md:gap-[4vw] md:overflow-hidden md:px-[6vw] md:pb-[6vh] md:pt-[12vh]">
      <motion.div className="shrink-0 md:col-span-5 flex flex-col gap-[3vh]" variants={container(0.1, 0.08)} initial="hidden" animate="show">
        <Parte />
        <motion.h2 variants={item} className="title-width text-[clamp(34px,4.2vw,80px)] font-bold leading-[1.02] tracking-[-0.03em]">
          Vistas del prototipo
        </motion.h2>

        {/* Pestañas con indicador deslizante; también responden a ← → como pasos de la sección */}
        <motion.div variants={item} role="tablist" aria-label="Vistas técnicas" className="glass flex w-fit max-w-full flex-wrap gap-1 rounded-[28px] p-1.5">
          {VIEWS.map((v, i) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={i === step}
              onClick={() => setStep(i)}
              className={`pressable relative rounded-full px-3.5 py-2 text-[clamp(16px,1.05vw,22px)] font-semibold transition-colors duration-200 ${
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
              {m.valor ? <strong className="tabular-nums text-agua">{m.valor}</strong> : <Missing>medida</Missing>}
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="glass relative shrink-0 md:col-span-7 flex h-[min(76vh,800px)] items-center justify-center overflow-hidden rounded-[36px]"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1, transition: { type: 'spring', duration: 0.8, bounce: 0, delay: 0.15 } }}
      >
        {/* Cuadrícula técnica de fondo */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #eef1ef 1px, transparent 1px), linear-gradient(to bottom, #eef1ef 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgb(57_255_136/0.14),transparent_70%)]" />

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.figure key={view.id} {...swap} className="relative m-0 grid place-items-center" style={{ height: `calc(min(76vh, 800px) * 0.72 * ${view.h / SRC_H})`, aspectRatio: `${view.w} / ${view.h}` }}>
            {view.src ? (
              <img src={view.src} alt={view.alt} className="h-full w-full object-contain drop-shadow-[0_24px_30px_rgb(0_0_0/0.5)]" draggable={false} />
            ) : (
              <span className="whitespace-nowrap text-[22px]">
                <Insertar>VISTA TRASERA</Insertar>
              </span>
            )}
            {view.src && view.cotas !== false && view.measures.map((m) => <Bracket key={m.side} side={m.side} />)}
          </motion.figure>
        </AnimatePresence>

        <p className="absolute bottom-5 left-7 text-[18px] text-niebla">Lateral, frontal y superior están a la misma escala</p>
      </motion.div>
    </div>
  );
}
