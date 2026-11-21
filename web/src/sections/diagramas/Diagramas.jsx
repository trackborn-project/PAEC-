import { motion } from 'motion/react';
import { Parte } from '../../components/Parte.jsx';
import { Insertar } from '../../components/Missing.jsx';
import { container, item } from '../../components/stagger.js';

// IV.a Diagramas restantes. El de control y potencia está en la sección anterior.
// Solo se escribe lo que dicen notas.md, filtro.jpg y el inventario; el resto queda como [INSERTAR …].
const DIAGRAMAS = [
  {
    id: 'electronico',
    titulo: 'Electrónico',
    texto: 'Conexiones del sensor de humedad, la placa ESP32, la pantalla OLED de 0.96 pulgadas y el relevador.',
    marcador: 'DIAGRAMA ELECTRÓNICO',
  },
  {
    id: 'hidraulico',
    titulo: 'Hidráulico',
    texto: 'Condensado del aire acondicionado → filtro de tres etapas → balde hermético → bomba de 5 V → plantas.',
    marcador: 'DIAGRAMA HIDRÁULICO',
  },
  {
    id: 'mecanico',
    titulo: 'Mecánico',
    texto: 'Carcasa de 5 × 5 × 5 cm, sondas de 5 cm y estructura de embudos del filtro.',
    marcador: 'DIAGRAMA MECÁNICO',
  },
  {
    id: 'neumatico',
    titulo: 'Neumático',
    texto: 'No aplica: el sistema no usa componentes neumáticos.',
    marcador: null,
  },
];

export default function Diagramas() {
  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-5 overflow-y-auto px-5 pb-10 pt-20 md:justify-center md:gap-[3vh] md:overflow-hidden md:px-[6vw] md:pb-[5vh] md:pt-[11vh]">
      <motion.div variants={container(0.08, 0.08)} initial="hidden" animate="show" className="flex flex-col gap-3">
        <Parte />
        <motion.h2 variants={item} className="title-width text-[clamp(34px,min(4.2vw,8vh),80px)] font-bold leading-[1.02] tracking-[-0.03em]">
          Diagramas del sistema
        </motion.h2>
      </motion.div>

      <motion.ol variants={container(0.25, 0.08)} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {DIAGRAMAS.map((d, i) => (
          <motion.li key={d.id} variants={item} className="glass flex flex-col gap-3 rounded-[26px] px-6 py-5">
            <span className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-agua text-[18px] font-bold text-subsuelo tabular-nums">{i + 1}</span>
              <span className="text-[clamp(20px,1.7vw,28px)] font-bold leading-tight">{d.titulo}</span>
            </span>
            <span className="text-[clamp(17px,1.3vw,22px)] leading-snug text-hueso/85">{d.texto}</span>
            {d.marcador && (
              <span className="text-[20px]">
                <Insertar>{d.marcador}</Insertar>
              </span>
            )}
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
