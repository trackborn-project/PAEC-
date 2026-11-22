import { AnimatePresence, motion } from 'motion/react';
import { useDeck } from '../../deck/DeckProvider.jsx';
import { Missing } from '../../components/Missing.jsx';
import { Tooltip } from '../../components/Tooltip.jsx';
import isometrica from '../../assets/isometrica.webp';
import explosionada from '../../assets/explosionada.webp';
import { Parte } from '../../components/Parte.jsx';

// Piezas visibles en la vista explosionada. x/y en % sobre la imagen (490×509).
// Lo que notas.md no explica queda marcado como [FALTA].
export const PARTS = [
  {
    id: 'tapa',
    name: 'Tapa superior',
    x: 56,
    y: 9,
    text: 'Se retira para acceder al interior de la caja.',
    side: 'bottom',
  },
  {
    id: 'boton',
    name: 'Botón de encendido',
    x: 43,
    y: 19.5,
    text: 'Enciende o apaga el dispositivo: le permite descansar o ahorrar batería.',
    side: 'bottom',
  },
  {
    id: 'carcasa',
    name: 'Carcasa',
    x: 72,
    y: 34,
    text: 'Caja que protege la electrónica. Material: MDF barnizado, aluminio y polímero de alta densidad.',
    side: 'left',
  },
  {
    id: 'tarjeta',
    name: 'Tarjeta electrónica',
    x: 42,
    y: 42,
    text: 'Según las notas, aquí está el ESP32: interpreta la lectura y decide si hace falta regar.',
    side: 'right',
  },
  {
    id: 'bloque',
    name: 'Fuente de alimentación de 3.3 - 5 V',
    x: 52.5,
    y: 47,
    text: 'Pieza conectada con cables rojo y negro.',
    side: 'right',
  },
  {
    id: 'ventana',
    name: 'Ventana frontal',
    x: 21,
    y: 46,
    text: 'Tapa transparente con marco; deja ver la tarjeta electrónica.',
    side: 'right',
  },
  {
    id: 'usb',
    name: 'Puerto USB-C',
    x: 68.5,
    y: 52.5,
    text: 'Conector en el costado de la caja: alimenta el sistema electrónico.',
    side: 'left',
  },
  {
    id: 'orificio',
    name: 'Orificio lateral',
    x: 74,
    y: 48.5,
    text: 'Deja ver un LED que se enciende en rojo o amarillo cuando hay problemas de compilación o de conexiones.',
    side: 'left',
  },
  {
    id: 'sondas',
    name: 'Sondas',
    x: 66.5,
    y: 79,
    text: 'Miden 5 cm. Se entierran en la tierra de la maceta; con ellas el sensor obtiene la lectura de humedad.',
    side: 'left',
  },
];

const spring = { type: 'spring', duration: 0.9, bounce: 0.05 };

function Hotspot({ part, index, active, onSelect }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${part.x}%`, top: `${part.y}%`, zIndex: active ? 20 : 10 }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, transition: { type: 'spring', duration: 0.45, bounce: 0.2, delay: 0.35 + index * 0.05 } }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
    >
      <Tooltip
        side={part.side}
        open={active}
        width={380}
        content={
          <span className="flex flex-col gap-2">
            <strong className="text-[24px]">{part.name}</strong>
            <span>{part.text}</span>
            {part.missing && <Missing>{part.missing}</Missing>}
          </span>
        }
      >
        <button
          onClick={() => onSelect(part.id)}
          aria-pressed={active}
          aria-label={part.name}
          className="group relative -ml-6 -mt-6 grid h-12 w-12 place-items-center rounded-full"
        >
          {/* Pulso: indica que la pieza se puede tocar */}
          {!active && (
            <span className="absolute inset-1 animate-ping rounded-full bg-agua/40 [animation-duration:2.2s]" aria-hidden />
          )}
          <span
            className={`relative h-7 w-7 rounded-full border-[3px] transition-transform duration-150 group-active:scale-90 ${
              active ? 'scale-125 border-hueso bg-agua' : 'border-agua bg-subsuelo/80'
            }`}
          />
        </button>
      </Tooltip>
    </motion.div>
  );
}

export default function Anatomia() {
  const { step, setStep } = useDeck();
  // Paso 0: armado. Paso 1: despiece. Pasos 2…: una pieza resaltada cada vez.
  const exploded = step >= 1;
  const activePart = step >= 2 ? PARTS[step - 2]?.id : null;
  const activeInfo = PARTS.find((p) => p.id === activePart);

  const select = (id) => {
    const i = PARTS.findIndex((p) => p.id === id);
    setStep(activePart === id ? 1 : i + 2);
  };

  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-6 overflow-y-auto px-5 pb-10 pt-20 md:grid md:grid-cols-12 md:items-center md:gap-[4vw] md:overflow-hidden md:px-[6vw] md:pb-[6vh] md:pt-[12vh]">
      <div className="shrink-0 md:col-span-4 flex flex-col gap-[3vh]">
        <Parte />
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0 } }}
          className="title-width text-[clamp(34px,4.2vw,80px)] font-bold leading-[1.02] tracking-[-0.03em]"
        >
          Vista explosionada
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0, delay: 0.1 } }}
          className="glass flex w-fit gap-1 rounded-full p-1.5"
          role="tablist"
          aria-label="Estado del modelo"
        >
          {['Armado', 'Despiece'].map((label, i) => {
            const on = (i === 1) === exploded;
            return (
              <button
                key={label}
                role="tab"
                aria-selected={on}
                onClick={() => setStep(i)}
                className={`pressable relative rounded-full px-6 py-2.5 text-[24px] font-semibold transition-colors duration-200 ${
                  on ? 'text-subsuelo' : 'text-niebla hover:text-hueso'
                }`}
              >
                {on && <motion.span layoutId="anat-tab" className="absolute inset-0 rounded-full bg-agua" transition={{ type: 'spring', duration: 0.4, bounce: 0.12 }} />}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </motion.div>

        <div className="min-h-[6em] text-[clamp(26px,1.9vw,32px)] leading-snug text-hueso/90">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={activeInfo?.id ?? (exploded ? 'exp' : 'arm')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
            >
              {activeInfo
                ? `${PARTS.indexOf(activeInfo) + 1} de ${PARTS.length}: ${activeInfo.name}.`
                : exploded
                  ? 'Toca cada punto para ver qué es cada pieza.'
                  : 'Así se ve el módulo armado. Avanza para separar sus piezas.'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="glass relative shrink-0 md:col-span-8 h-[min(78vh,820px)] overflow-visible rounded-[36px]">
        <div aria-hidden className="absolute inset-0 rounded-[36px] bg-[radial-gradient(ellipse_50%_50%_at_50%_45%,rgb(57_255_136/0.12),transparent_70%)]" />
        {/* Lienzo cuadrado con la proporción de los renders */}
        <div className="absolute left-1/2 top-1/2 aspect-[490/509] h-[92%] -translate-x-1/2 -translate-y-1/2">
          <motion.img
            src={isometrica}
            alt="Módulo armado"
            className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_30px_40px_rgb(0_0_0/0.5)]"
            initial={false}
            animate={exploded ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
            transition={spring}
            draggable={false}
          />
          <motion.img
            src={explosionada}
            alt="Vista explosionada: tapa superior separada, ventana frontal abierta, tarjeta electrónica, fuente de alimentación de 3.3 - 5 V con cables, puerto USB-C y sondas."
            className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_30px_40px_rgb(0_0_0/0.5)]"
            initial={false}
            animate={exploded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
            transition={spring}
            draggable={false}
          />
          <AnimatePresence>
            {exploded &&
              PARTS.map((p, i) => <Hotspot key={p.id} part={p} index={i} active={p.id === activePart} onSelect={select} />)}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
