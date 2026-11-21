import { motion } from 'motion/react';
import { Parte } from '../../components/Parte.jsx';
import { container, item } from '../../components/stagger.js';

// II.a Justificación: qué es el PAEC y la idea del sistema. Mismo patrón que "Pruebas y resultados".
const TARJETAS = [
  {
    id: 'paec',
    titulo: '¿Qué es el PAEC?',
    texto: 'El PAEC (Proyecto Aula-Escuela-Comunidad) es un movimiento en el cual se diseñan prototipos con el motivo de fomentar el cuidado ambiental.',
  },
  {
    id: 'idea',
    titulo: 'Idea del sistema mecatrónico',
    texto: 'Un detector de sequía con filtro de agua: un prototipo educativo que observa la humedad de la tierra y riega las plantas cuando hace falta. El agua pasa por un filtro antes de llegar a ellas.',
  },
  {
    id: 'porque',
    titulo: 'Por qué lo hacemos',
    texto: 'Relaciona el aprendizaje de mecatrónica con una situación cotidiana, el cuidado de las plantas, y permite conversar sobre el uso responsable del agua.',
  },
];

export default function Paec() {
  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-6 overflow-y-auto px-5 pb-10 pt-20 md:justify-center md:gap-[4vh] md:overflow-hidden md:px-[6vw] md:pb-[6vh] md:pt-[12vh]">
      <motion.div variants={container(0.08, 0.08)} initial="hidden" animate="show" className="flex flex-col gap-3">
        <Parte />
        <motion.h2 variants={item} className="title-width text-[clamp(34px,min(4.2vw,8vh),80px)] font-bold leading-[1.02] tracking-[-0.03em]">
          Justificación
        </motion.h2>
        <motion.p variants={item} className="max-w-[46ch] text-[clamp(20px,1.8vw,30px)] leading-snug text-hueso/90">
          El porqué del proyecto.
        </motion.p>
      </motion.div>

      <motion.ol variants={container(0.25, 0.09)} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TARJETAS.map((t, i) => (
          <motion.li key={t.id} variants={item} className="glass flex flex-col gap-3 rounded-[26px] px-6 py-5">
            <span className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-agua text-[18px] font-bold text-subsuelo tabular-nums">{i + 1}</span>
              <span className="text-[clamp(20px,1.7vw,28px)] font-bold leading-tight">{t.titulo}</span>
            </span>
            <span className="text-[clamp(17px,1.3vw,22px)] leading-snug text-hueso/85">{t.texto}</span>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
