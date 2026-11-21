import { motion } from 'motion/react';
import { Parte } from '../../components/Parte.jsx';
import { container, item } from '../../components/stagger.js';
import { objetivoGeneral, problemasPlantel } from '../../content/fase3.js';

// II.c Objetivos: objetivo general y los problemas del CBTis 40 que resuelve el proyecto
// (los que antes estaban en "Problemas y aprendizajes"). Patrón de "Pruebas y resultados".
export default function Objetivos() {
  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-5 overflow-y-auto px-5 pb-10 pt-20 md:justify-center md:gap-[3vh] md:overflow-hidden md:px-[6vw] md:pb-[5vh] md:pt-[11vh]">
      <motion.div variants={container(0.08, 0.08)} initial="hidden" animate="show" className="flex flex-col gap-3">
        <Parte />
        <motion.h2 variants={item} className="title-width text-[clamp(34px,min(4.2vw,8vh),80px)] font-bold leading-[1.02] tracking-[-0.03em]">
          Objetivos
        </motion.h2>
        <motion.div variants={item} className="glass flex flex-col gap-1 rounded-[28px] px-7 py-5">
          <p className="text-[18px] text-niebla">Objetivo general</p>
          <p className="text-[clamp(24px,2.2vw,40px)] font-bold leading-tight tracking-[-0.02em] text-agua [text-shadow:0_0_28px_rgb(57_255_136/0.35)]">{objetivoGeneral}</p>
        </motion.div>
      </motion.div>

      <motion.div variants={container(0.3, 0.08)} initial="hidden" animate="show" className="flex flex-col gap-3">
        <motion.p variants={item} className="text-[clamp(18px,1.4vw,24px)] text-niebla">
          Problemas del CBTis 40 que el proyecto resolverá
        </motion.p>
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {problemasPlantel.map((p, i) => (
            <motion.li key={i} variants={item} className="glass flex flex-col gap-2 rounded-[24px] px-6 py-4">
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-agua text-[16px] font-bold text-subsuelo tabular-nums">{i + 1}</span>
                <span className="text-[clamp(18px,1.4vw,24px)] font-bold leading-snug">{p.problema}</span>
              </span>
              <span className="mt-auto border-t border-white/10 pt-2 text-[clamp(16px,1.15vw,19px)] leading-snug">
                <span className="text-agua">Cómo lo resuelve: </span>
                {p.solucion}
              </span>
            </motion.li>
          ))}
        </ol>
      </motion.div>
    </div>
  );
}
