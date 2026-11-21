import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useDeck } from '../../deck/DeckProvider.jsx';
import { Missing } from '../../components/Missing.jsx';

// Diagrama de bloques del sistema, según "Cómo funciona" y "Control y potencia" de notas.md.
const W = 1500;
const H = 760;
const NW = 300;
const NH = 132;

const KIND = {
  control: { color: '#c4ccc9', label: 'Señal de control' },
  potencia: { color: '#ff7a5d', label: 'Energía de la bomba' },
  agua: { color: '#39ff88', label: 'Recorrido del agua' },
};

const NODES = {
  sensor: { x: 160, y: 150, name: 'Sensor', sub: 'lee la tierra', tip: 'Toma una lectura relacionada con la humedad de la tierra.' },
  esp32: { x: 540, y: 150, name: 'ESP32', sub: 'decide', tip: 'Interpreta la lectura y manda la orden de iniciar o detener el riego: empieza bajo 15 y se detiene al llegar a 100. Si no hay agua, manda una notificación al teléfono.' },
  potencia: { x: 920, y: 150, name: 'Etapa de potencia', sub: 'conecta la energía', tip: 'Un relevador de 3.3 V a 5 V: recibe la orden del ESP32 y conecta o desconecta la energía de la bomba.' },
  bomba: { x: 1310, y: 150, name: 'Bomba', sub: 'mueve el agua', tip: 'Bomba básica de 5 V: toma el agua del filtro y la lleva hacia la planta.' },
  pantalla: { x: 540, y: 410, name: 'Pantalla', sub: 'muestra el estado', tip: 'Pantalla OLED de 0.96 pulgadas: muestra los estados de sequía según lo que recopila el sensor.' },
  fuente: { x: 920, y: 410, name: 'Alimentación', sub: 'de la bomba', tip: 'Una fuente externa, como una batería de 5 V. El ESP32 no alimenta directamente la bomba.' },
  filtro: { x: 1310, y: 410, name: 'Filtro', sub: 'agua de AC', tip: 'Recibe el condensado del aire acondicionado. Tres etapas: malla y carbón activo, grava caliza y piedra volcánica (tezontle). No forma parte del circuito eléctrico.' },
  plantas: { x: 1310, y: 650, name: 'Plantas', sub: 'en macetas', tip: 'El agua filtrada llega a la maceta, donde están las sondas del sensor.' },
};

// Conexiones: from → to, tipo y ruta (puntos intermedios opcionales).
const LINKS = [
  { id: 's-e', from: 'sensor', to: 'esp32', kind: 'control' },
  { id: 'e-p', from: 'esp32', to: 'potencia', kind: 'control' },
  { id: 'e-d', from: 'esp32', to: 'pantalla', kind: 'control' },
  { id: 'f-p', from: 'fuente', to: 'potencia', kind: 'potencia' },
  { id: 'p-b', from: 'potencia', to: 'bomba', kind: 'potencia' },
  // La bomba toma el agua del filtro y la lleva a la planta (notas.md, "De dónde toma el agua").
  { id: 'f-b', from: 'filtro', to: 'bomba', kind: 'agua' },
  { id: 'b-pl', from: 'bomba', to: 'plantas', kind: 'agua', path: 'M1460 150 H1484 V650 H1460' },
  // Lazo: el sensor está enterrado en la maceta.
  { id: 'pl-s', from: 'plantas', to: 'sensor', kind: 'control', path: 'M1160 650 H160 V216', dashed: true },
];

// Pasos de "Cómo funciona" (notas.md). Cada uno ilumina nodos y cables.
const STEPS = [
  { text: 'Vista general: control, energía y agua.', nodes: Object.keys(NODES), links: LINKS.map((l) => l.id) },
  { text: '1. El sensor toma una lectura relacionada con la humedad de la tierra.', nodes: ['sensor', 'plantas'], links: ['s-e', 'pl-s'] },
  { text: '2. El ESP32 interpreta la lectura y decide si hace falta regar.', nodes: ['esp32'], links: ['s-e', 'e-p'] },
  { text: '3. Si hace falta agua, se activa la bomba: toma el agua del filtro y la lleva a las plantas.', nodes: ['potencia', 'fuente', 'bomba', 'filtro', 'plantas'], links: ['e-p', 'f-p', 'p-b', 'f-b', 'b-pl'] },
  { text: '4. La pantalla comunica el estado del sistema.', nodes: ['pantalla'], links: ['e-d'] },
];

function linkPath(l) {
  if (l.path) return l.path;
  const a = NODES[l.from];
  const b = NODES[l.to];
  if (a.y === b.y) {
    const dir = Math.sign(b.x - a.x);
    return `M${a.x + (dir * NW) / 2} ${a.y} H${b.x - (dir * NW) / 2}`;
  }
  const dir = Math.sign(b.y - a.y);
  return `M${a.x} ${a.y + (dir * NH) / 2} V${b.y - (dir * NH) / 2}`;
}

export default function Detector() {
  const { step, setStep } = useDeck();
  const [hover, setHover] = useState(null);
  const current = STEPS[step] ?? STEPS[0];

  // Con el cursor encima de un nodo se iluminan ese nodo y sus cables; si no, manda el paso actual.
  const litNodes = hover ? [hover] : current.nodes;
  const litLinks = hover ? LINKS.filter((l) => l.from === hover || l.to === hover).map((l) => l.id) : current.links;
  const tipNode = hover ? NODES[hover] : null;

  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-4 overflow-y-auto px-5 pb-10 pt-20 md:justify-center md:gap-[2.5vh] md:overflow-hidden md:px-[5vw] md:pb-[5vh] md:pt-[11vh]">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0 } }}
        className="title-width text-[clamp(32px,3.8vw,72px)] font-bold leading-[1.02] tracking-[-0.03em]"
      >
        Cómo funciona el detector
      </motion.h2>
      <div className="glass relative h-[48vh] shrink-0 rounded-[32px] md:h-auto md:min-h-0 md:flex-1">
        {/* Leyenda de los tres tipos de conexión */}
        <div className="absolute left-[19%] top-[69%] z-[1] flex gap-6 text-[20px] text-niebla">
          {Object.entries(KIND).map(([k, v]) => (
            <span key={k} className="flex items-center gap-3">
              <span className="h-1.5 w-8 rounded-full" style={{ background: v.color }} aria-hidden />
              {v.label}
            </span>
          ))}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label="Diagrama de bloques del detector">
          {LINKS.map((l) => {
            const on = litLinks.includes(l.id);
            const color = KIND[l.kind].color;
            const d = linkPath(l);
            return (
              <g key={l.id}>
                <path d={d} fill="none" stroke={color} strokeOpacity={on ? 0.35 : 0.12} strokeWidth="6" strokeLinecap="round" strokeDasharray={l.dashed ? '2 14' : undefined} />
                {/* Flujo de señal: guiones que avanzan por el cable */}
                {on && (
                  <path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="18 46"
                    className="signal-flow"
                    style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                  />
                )}
              </g>
            );
          })}

          {Object.entries(NODES).map(([id, n], i) => {
            const on = litNodes.includes(id);
            return (
              <motion.g
                key={id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: on ? 1 : 0.35, y: 0 }}
                transition={{ type: 'spring', duration: 0.5, bounce: 0, delay: step === 0 && !hover ? i * 0.04 : 0 }}
                onPointerEnter={() => setHover(id)}
                onPointerLeave={() => setHover(null)}
                style={{ cursor: 'default' }}
              >
                <rect
                  x={n.x - NW / 2}
                  y={n.y - NH / 2}
                  width={NW}
                  height={NH}
                  rx="22"
                  fill={on ? '#1b201f' : '#141817'}
                  stroke={on ? '#eef1ef' : '#ffffff'}
                  strokeOpacity={on ? 0.5 : 0.12}
                  strokeWidth="2"
                />
                <text x={n.x} y={n.y - 4} textAnchor="middle" fill="#eef1ef" fontSize={n.name.length > 12 ? 33 : 40} fontWeight="700" fontFamily="Archivo Variable">
                  {n.name}
                </text>
                <text x={n.x} y={n.y + 38} textAnchor="middle" fill="#a3aca9" fontSize="30" fontFamily="Archivo Variable">
                  {n.sub}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Explicación del nodo bajo el cursor */}
        <AnimatePresence>
          {tipNode && (
            <motion.div
              key={hover}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              className="pointer-events-none absolute z-10 w-[400px] rounded-2xl border border-white/15 bg-[#171c1b] px-5 py-4 text-[22px] leading-snug shadow-2xl"
              style={{
                left: `${(tipNode.x / W) * 100}%`,
                top: `${((tipNode.y + NH / 2) / H) * 100}%`,
                translate: tipNode.x > 1100 ? '-90% 12px' : '-50% 12px',
                transformOrigin: tipNode.x > 1100 ? '90% 0' : '50% 0',
              }}
            >
              <strong className="mb-1 block text-[24px]">{tipNode.name}</strong>
              {tipNode.tip}
              {tipNode.missing && (
                <span className="mt-2 block">
                  <Missing>{tipNode.missing}</Missing>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pasos: clic o ← → */}
      <div className="flex items-center gap-5">
        <div className="flex gap-2" role="tablist" aria-label="Pasos del funcionamiento">
          {STEPS.map((s, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === step}
              aria-label={i === 0 ? 'Vista general' : `Paso ${i}`}
              onClick={() => setStep(i)}
              className={`pressable h-12 min-w-12 rounded-full border px-4 text-[22px] font-semibold tabular-nums transition-colors duration-200 ${
                i === step ? 'border-agua bg-agua text-subsuelo' : 'border-white/15 text-niebla hover:text-hueso'
              }`}
            >
              {i === 0 ? 'Todo' : i}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={step}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="text-[26px] leading-snug"
          >
            {current.text}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
