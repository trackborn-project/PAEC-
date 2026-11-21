import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RevealText } from '../../components/RevealText.jsx';
import { SpotlightCard } from '../../components/SpotlightCard.jsx';
import { Missing } from '../../components/Missing.jsx';
import { ChipIcon, FilterIcon, PumpIcon, ScreenIcon, SensorIcon } from './PillarIcons.jsx';

// Pilares del sistema, en el orden en que viaja la información y el agua (notas.md).
const PILLARS = [
  {
    id: 'sensor',
    name: 'Sensor',
    verb: 'Lee la tierra',
    short: 'Toma una lectura relacionada con la humedad.',
    long: [
      'Sus dos sondas metálicas se entierran en la maceta y obtienen una lectura relacionada con la humedad de la tierra.',
      'La lectura debe ajustarse a las condiciones de las plantas. Por eso todavía no se muestra como porcentaje real de humedad.',
    ],
    missing: 'calibración de la lectura',
    Icon: SensorIcon,
    color: 'text-ambar',
    span: 'md:col-span-3',
  },
  {
    id: 'esp32',
    name: 'ESP32',
    verb: 'Decide',
    short: 'Interpreta la lectura y decide si hace falta regar.',
    long: [
      'Es el control del sistema: interpreta la lectura del sensor y manda la orden de iniciar o detener el riego.',
      'Da la orden, pero no alimenta directamente el motor de la bomba.',
      'Es una placa de desarrollo ESP32 (inventario).',
    ],
    missing: 'umbral de riego y condiciones de activación y detención',
    Icon: ChipIcon,
    color: 'text-tierra',
    span: 'md:col-span-3',
  },
  {
    id: 'bomba',
    name: 'Bomba',
    verb: 'Riega',
    short: 'Mueve el agua cuando el ESP32 lo ordena.',
    long: [
      'La bomba necesita una alimentación capaz de mover el agua.',
      'Una etapa de potencia recibe la orden del control y conecta o desconecta la energía de la bomba.',
      'Es una mini bomba de agua sumergible de 5 V. El inventario incluye un módulo de relé de doble canal de 5 V.',
    ],
    missing: 'confirmar qué hace de etapa de potencia',
    Icon: PumpIcon,
    color: 'text-agua',
    span: 'md:col-span-2',
  },
  {
    id: 'filtro',
    name: 'Filtro',
    verb: 'Filtra el agua',
    short: 'El agua pasa por él antes de llegar a las plantas.',
    long: [
      'Recibe agua de condensado del aire acondicionado y la pasa por tres etapas: malla y carbón activo, grava caliza y piedra volcánica (tezontle).',
      'Pertenece al recorrido del agua, no al circuito eléctrico.',
    ],
    Icon: FilterIcon,
    color: 'text-agua',
    span: 'md:col-span-2',
  },
  {
    id: 'pantalla',
    name: 'Pantalla',
    verb: 'Comunica',
    short: 'Muestra el estado del sistema.',
    long: [
      'Convierte la lectura en un mensaje visual fácil de consultar.',
      'Permite saber el estado del sistema sin conectar nada más.',
      'Es una pantalla OLED de 0.96 pulgadas (inventario).',
    ],
    Icon: ScreenIcon,
    color: 'text-brote',
    span: 'md:col-span-2',
  },
];

const morph = { type: 'spring', duration: 0.45, bounce: 0.08 };

function PillarCard({ p, index, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.button
      layoutId={`pillar-${p.id}`}
      transition={morph}
      onClick={() => onOpen(p.id)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={`${p.span} text-left`}
      whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0, delay: 0.75 + index * 0.07 } }}
      aria-label={`${p.name}: ${p.verb}. Ver más`}
    >
      <SpotlightCard className={`flex h-full w-full flex-col justify-center gap-3 px-7 py-5 ${hover ? 'is-active' : ''}`}>
        <div className="flex items-center gap-5">
          <div className={`h-14 w-14 shrink-0 [@media(min-height:900px)]:h-20 [@media(min-height:900px)]:w-20 ${p.color}`}>
            <p.Icon />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-[20px] text-niebla">{p.name}</span>
            <span className="text-[30px] font-bold leading-tight">{p.verb}</span>
          </div>
        </div>
        <span className="text-[24px] leading-snug text-hueso/85">{p.short}</span>
      </SpotlightCard>
    </motion.button>
  );
}

function PillarDetail({ p, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-[6vw]">
      <motion.div
        className="absolute inset-0 bg-[#050706]/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        onClick={onClose}
      />
      <motion.div
        layoutId={`pillar-${p.id}`}
        transition={morph}
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
        className="glass is-active relative flex w-[min(1000px,82vw)] gap-10 rounded-[32px] p-12"
      >
        <div className={`h-[120px] w-[120px] shrink-0 ${p.color}`}>
          <p.Icon />
        </div>
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.08 } }}
        >
          <span className="text-[22px] text-niebla">{p.name}</span>
          <h3 className="text-[48px] font-bold leading-tight">{p.verb}</h3>
          {p.long.map((t) => (
            <p key={t} className="text-[28px] leading-snug text-hueso/90">
              {t}
            </p>
          ))}
          {p.missing && (
            <p className="text-[24px]">
              <Missing>{p.missing}</Missing>
            </p>
          )}
          <button
            onClick={onClose}
            className="pressable mt-2 w-fit rounded-full border border-white/20 px-6 py-2.5 text-[22px] hover:bg-white/10"
            autoFocus
          >
            Cerrar
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Solucion() {
  const [open, setOpen] = useState(null);
  const selected = PILLARS.find((p) => p.id === open);

  return (
    <div className="relative h-full w-full">
      <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-6 overflow-y-auto px-5 pb-10 pt-20 md:justify-center md:gap-[4vh] md:overflow-hidden md:px-[6vw] md:pb-[6vh] md:pt-[12vh]">
        <RevealText
          as="h2"
          by="word"
          text="Observa la humedad de la tierra y riega cuando hace falta."
          delay={0.1}
          className="title-width text-[clamp(34px,4.2vw,80px)] font-bold leading-[1.03] tracking-[-0.03em]"
        />

        <div className="grid grid-cols-1 gap-4 md:min-h-0 md:flex-1 md:max-h-[520px] md:grid-cols-6 md:grid-rows-2 md:gap-5">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.id} p={p} index={i} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <AnimatePresence>{selected && <PillarDetail key={selected.id} p={selected} onClose={() => setOpen(null)} />}</AnimatePresence>
    </div>
  );
}
