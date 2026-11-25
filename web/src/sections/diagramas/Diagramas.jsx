import { AnimatePresence, motion } from 'motion/react';
import { Parte } from '../../components/Parte.jsx';
import { useDeck } from '../../deck/DeckProvider.jsx';
import { container, item } from '../../components/stagger.js';

// IV.a Diagramas del sistema, según Contenido/diagramas-del-sistema.md.
// La etapa de potencia es el relevador (notas.md e inventario), no el MOSFET del borrador.
// Pestañas con el mismo patrón que "Vistas del prototipo"; también responden a ← → como pasos.

// Colores de conexión: los mismos del "Diagrama de control y potencia".
const KIND = {
  control: { color: '#c4ccc9', label: 'Señal de control' },
  potencia: { color: '#ff7a5d', label: 'Energía de la bomba' },
  agua: { color: '#39ff88', label: 'Recorrido del agua' },
};

// Cada diagrama es una lista de filas; cada fila es una cadena: nodo, conexión, nodo, …
const DIAGRAMAS = [
  {
    id: 'control',
    titulo: 'Electrónico de control',
    texto: 'El ESP32 recibe la lectura del sensor y, cuando hace falta riego, manda la orden a la etapa de potencia. La pantalla informa el estado; no acciona la bomba.',
    filas: [
      [
        { n: 'Sensor de humedad', s: 'salida AO' },
        { k: 'control', l: 'Lectura analógica' },
        { n: 'ESP32', s: 'decide si regar' },
        { k: 'control', l: 'Orden · GPIO25' },
        { n: 'Relevador', s: '3.3 V a 5 V' },
        { k: 'potencia', l: 'Conecta o detiene' },
        { n: 'Bomba', s: '5 V' },
      ],
      [
        { n: 'ESP32', s: '' },
        { k: 'control', l: 'I2C · GPIO21 SDA · GPIO22 SCL' },
        { n: 'Pantalla OLED', s: 'SSD1306 · 0.96"' },
      ],
      [
        { n: 'ESP32', s: '' },
        { k: 'control', l: 'USB serial' },
        { n: 'Monitor de datos', s: 'computadora' },
      ],
    ],
    nota: 'Pines según las notas del equipo; se deben cotejar con el firmware del prototipo físico.',
  },
  {
    id: 'potencia',
    titulo: 'Electrónico de potencia',
    texto: 'El ESP32 solo da la orden. El relevador conecta o desconecta la energía de la batería externa hacia la bomba.',
    filas: [
      [
        { n: 'ESP32', s: 'GPIO25' },
        { k: 'control', l: 'Señal de control' },
        { n: 'Relevador', s: '3.3 V a 5 V' },
      ],
      [
        { n: 'Batería externa', s: '5 V' },
        { k: 'potencia', l: 'Energía' },
        { n: 'Relevador', s: 'contacto' },
        { k: 'potencia', l: 'Conecta o desconecta' },
        { n: 'Bomba', s: '5 V' },
      ],
    ],
    nota: 'Seguridad: la bomba no se alimenta desde un GPIO ni desde la salida de 3.3 V del ESP32.',
  },
  {
    id: 'hidraulico',
    titulo: 'Hidráulico',
    texto: 'El condensado del aire acondicionado entra por arriba, pasa por tres etapas por gravedad y cae al balde; la bomba lo envía al riego.',
    filas: [
      [
        { n: 'Condensado', s: 'aire acondicionado' },
        { k: 'agua', l: '' },
        { n: 'Embudo', s: 'de entrada' },
        { k: 'agua', l: '' },
        { n: 'Etapa 1', s: 'malla y carbón activo' },
        { k: 'agua', l: '' },
        { n: 'Etapa 2', s: 'grava caliza' },
        { k: 'agua', l: '' },
        { n: 'Etapa 3', s: 'piedra volcánica / tezontle' },
      ],
      [
        { n: 'Balde colector', s: 'agua filtrada' },
        { k: 'agua', l: 'Tubo de succión' },
        { n: 'Bomba', s: 'junto al balde' },
        { k: 'agua', l: 'Manguera de descarga' },
        { n: 'Riego', s: 'distribución' },
        { k: 'agua', l: '' },
        { n: 'Plantas', s: '' },
      ],
    ],
    nota: 'Etapa 1: microfiltrado · Etapa 2: ajuste de pH · Etapa 3: mineralización y biología.',
  },
  {
    id: 'mecanico',
    titulo: 'Mecánico del filtro',
    texto: 'Módulos cónicos apilados, cada uno con su medio filtrante, que descargan en un balde con una bomba externa a un costado.',
    filas: [
      [
        { n: '1. Embudo superior', s: 'entrada de condensado' },
        { k: 'agua', l: 'Apoya sobre' },
        { n: '2. Etapa 1', s: 'malla + carbón activo' },
        { k: 'agua', l: 'Descarga hacia' },
        { n: '3. Etapa 2', s: 'grava caliza' },
        { k: 'agua', l: 'Descarga hacia' },
        { n: '4. Etapa 3', s: 'piedra volcánica / tezontle' },
      ],
      [
        { n: '5. Balde', s: 'con tapa o soporte' },
        { k: 'agua', l: 'Tubo de succión' },
        { n: '6. Bomba externa', s: 'junto al balde' },
        { k: 'agua', l: 'Manguera de descarga' },
        { n: '7. Línea de riego', s: 'hacia las plantas' },
      ],
    ],
    nota: 'Basado en la imagen del prototipo · medidas por confirmar.',
  },
];

function Nodo({ n, s }) {
  return (
    <motion.span
      variants={item}
      className="flex min-w-[120px] flex-col rounded-[18px] border border-white/20 bg-[#1b201f] px-4 py-2.5 text-center"
    >
      <span className="text-[clamp(16px,1.2vw,21px)] font-bold leading-tight">{n}</span>
      {s && <span className="text-[clamp(14px,0.95vw,17px)] leading-snug text-niebla">{s}</span>}
    </motion.span>
  );
}

function Conexion({ k, l }) {
  const { color } = KIND[k];
  return (
    <motion.span variants={item} className="flex flex-col items-center gap-1 px-1" aria-label={l || 'hacia'}>
      {l && <span className="max-w-[170px] text-center text-[clamp(13px,0.9vw,15px)] leading-tight text-niebla">{l}</span>}
      <svg width="64" height="14" viewBox="0 0 64 14" aria-hidden>
        <path d="M2 7 H54" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="10 7" className="signal-flow" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        <path d="M52 2 L61 7 L52 12" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.span>
  );
}

export default function Diagramas() {
  const { step, setStep } = useDeck();
  const d = DIAGRAMAS[step] ?? DIAGRAMAS[0];
  const tipos = [...new Set(d.filas.flat().filter((x) => x.k).map((x) => x.k))];

  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-5 overflow-y-auto px-5 pb-10 pt-20 md:justify-center md:gap-[2.6vh] md:overflow-hidden md:px-[6vw] md:pb-[5vh] md:pt-[11vh]">
      <motion.div variants={container(0.08, 0.08)} initial="hidden" animate="show" className="flex flex-col gap-3">
        <Parte />
        <motion.h2 variants={item} className="title-width text-[clamp(34px,min(4.2vw,8vh),80px)] font-bold leading-[1.02] tracking-[-0.03em]">
          Diagramas del sistema
        </motion.h2>

        {/* Pestañas con indicador deslizante; también responden a ← → como pasos de la sección */}
        <motion.div variants={item} role="tablist" aria-label="Diagramas" className="glass flex w-fit max-w-full flex-wrap gap-1 rounded-[28px] p-1.5">
          {DIAGRAMAS.map((x, i) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={i === step}
              onClick={() => setStep(i)}
              className={`pressable relative rounded-full px-3.5 py-2 text-[clamp(16px,1.05vw,22px)] font-semibold transition-colors duration-200 ${
                i === step ? 'text-subsuelo' : 'text-niebla hover:text-hueso'
              }`}
            >
              {i === step && <motion.span layoutId="diagrama-tab" className="absolute inset-0 rounded-full bg-agua" transition={{ type: 'spring', duration: 0.4, bounce: 0.12 }} />}
              <span className="relative">{x.titulo}</span>
            </button>
          ))}
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={d.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          className="glass flex flex-col gap-4 rounded-[32px] px-6 py-5 md:px-8 md:py-6"
          data-testid={`diagrama-${d.id}`}
        >
          <p className="max-w-[70ch] text-[clamp(18px,1.4vw,24px)] leading-snug text-hueso/90">{d.texto}</p>

          {d.filas.length > 0 && (
            <motion.div variants={container(0.05, 0.04)} initial="hidden" animate="show" className="flex flex-col gap-4">
              {d.filas.map((fila, i) => (
                <div key={i} className="flex flex-wrap items-center gap-x-1 gap-y-3">
                  {fila.map((x, j) => (x.k ? <Conexion key={j} {...x} /> : <Nodo key={j} {...x} />))}
                </div>
              ))}
            </motion.div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-3">
            <div className="flex flex-wrap gap-5 text-[16px] text-niebla">
              {tipos.map((k) => (
                <span key={k} className="flex items-center gap-2">
                  <span className="h-1.5 w-7 rounded-full" style={{ background: KIND[k].color }} aria-hidden />
                  {KIND[k].label}
                </span>
              ))}
            </div>
            {d.nota && <p className="text-[16px] text-niebla">{d.nota}</p>}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
