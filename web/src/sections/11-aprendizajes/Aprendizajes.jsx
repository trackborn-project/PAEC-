import { useState } from 'react';
import { motion } from 'motion/react';
import { Missing } from '../../components/Missing.jsx';
import { container, item } from '../../components/stagger.js';
import { aprendizajes, proceso, queremosAprender } from '../../content/fase3.js';
import { useReduce } from '../../deck/MotionPref.jsx';

// Tarjetas que giran: problema al frente, solución atrás (clic, Enter o Espacio).
function FlipCard({ a, i }) {
  const [flip, setFlip] = useState(false);
  const reduce = useReduce();
  const face = 'absolute inset-0 flex flex-col gap-3 rounded-[26px] px-6 py-6 [backface-visibility:hidden]';

  return (
    <motion.li variants={item} className="h-[clamp(220px,34vh,320px)] [perspective:1200px]">
      <button
        onClick={() => setFlip((f) => !f)}
        aria-pressed={flip}
        aria-label={`Problema ${i + 1}: ${flip ? 'ver problema' : 'ver solución'}`}
        className="relative h-full w-full text-left"
      >
        <motion.span
          className="absolute inset-0 block [transform-style:preserve-3d]"
          animate={reduce ? undefined : { rotateY: flip ? 180 : 0 }}
          transition={{ type: 'spring', duration: 0.6, bounce: 0.1 }}
        >
          <span className={`glass ${face}`} style={reduce ? { opacity: flip ? 0 : 1 } : undefined}>
            <span className="text-[16px] text-niebla">Problema {i + 1}</span>
            <span className="text-[clamp(19px,1.6vw,26px)] font-semibold leading-snug">{a.problema ?? <Missing>problema que tuvieron</Missing>}</span>
            <span className="mt-auto text-[15px] text-niebla">Toca para ver la solución</span>
          </span>
          <span
            className={`${face} border border-agua/40 bg-[#122019]`}
            style={reduce ? { opacity: flip ? 1 : 0 } : { transform: 'rotateY(180deg)' }}
          >
            <span className="text-[16px] text-agua">Solución</span>
            <span className="text-[clamp(19px,1.6vw,26px)] font-semibold leading-snug">{a.solucion ?? <Missing>cómo lo resolvieron</Missing>}</span>
          </span>
        </motion.span>
      </button>
    </motion.li>
  );
}

export default function Aprendizajes() {
  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-6 overflow-y-auto px-5 pb-10 pt-20 md:justify-center md:gap-[4vh] md:overflow-hidden md:px-[6vw] md:pb-[6vh] md:pt-[12vh]">
      <motion.div variants={container(0.08, 0.08)} initial="hidden" animate="show" className="flex flex-col gap-3">
        <motion.h2 variants={item} className="title-width text-[clamp(34px,min(4.2vw,8vh),80px)] font-bold leading-[1.02] tracking-[-0.03em]">
          Problemas y aprendizajes
        </motion.h2>
        <motion.p variants={item} className="max-w-[44ch] text-[clamp(20px,1.8vw,30px)] leading-snug text-hueso/90">
          Lo que queremos aprender: {queremosAprender.charAt(0).toLowerCase() + queremosAprender.slice(1)}
        </motion.p>
      </motion.div>
      {/* Proceso de armado, en orden (notas.md) */}
      <motion.ol variants={container(0.2, 0.08)} initial="hidden" animate="show" className="grid grid-cols-1 gap-3 md:grid-cols-4" aria-label="Proceso de armado">
        {proceso.map((p, i) => (
          <motion.li key={p.id} variants={item} className="flex gap-3 rounded-[20px] border border-white/10 px-5 py-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-agua/60 text-[15px] font-bold text-agua tabular-nums">{i + 1}</span>
            <span className="flex flex-col">
              <span className="text-[clamp(17px,1.3vw,21px)] font-bold leading-tight">{p.titulo}</span>
              <span className="text-[clamp(15px,1vw,17px)] leading-snug text-niebla">{p.detalle}</span>
            </span>
          </motion.li>
        ))}
      </motion.ol>
      <motion.ul variants={container(0.45, 0.1)} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {aprendizajes.map((a, i) => (
          <FlipCard key={i} a={a} i={i} />
        ))}
      </motion.ul>
    </div>
  );
}
