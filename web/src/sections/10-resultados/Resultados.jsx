import { motion } from 'motion/react';
import { Missing } from '../../components/Missing.jsx';
import { container, item } from '../../components/stagger.js';
import { pruebas } from '../../content/fase3.js';

// Sin datos reales todavía: la sección muestra el plan de pruebas y deja visible lo que falta.
export default function Resultados() {
  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-6 overflow-y-auto px-5 pb-10 pt-20 md:justify-center md:gap-[3.5vh] md:overflow-hidden md:px-[6vw] md:pb-[6vh] md:pt-[12vh]">
      <motion.div variants={container(0.08, 0.08)} initial="hidden" animate="show" className="flex flex-col gap-4">
        <motion.h2 variants={item} className="title-width text-[clamp(34px,min(4.2vw,8vh),80px)] font-bold leading-[1.02] tracking-[-0.03em]">
          Pruebas y resultados
        </motion.h2>
        <motion.p variants={item} className="max-w-[46ch] text-[clamp(20px,1.8vw,30px)] leading-snug text-hueso/90">
          {pruebas.estado}
        </motion.p>
      </motion.div>

      {/* Plan de pruebas: cada tarjeta marca su estado */}
      <motion.ol variants={container(0.25, 0.09)} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {pruebas.plan.map((p, i) => (
          <motion.li key={p.id} variants={item} className="glass flex flex-col gap-3 rounded-[26px] px-6 py-5">
            <span className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-[18px] font-bold tabular-nums">{i + 1}</span>
              <span className="rounded-full border border-white/20 px-3 py-1 text-[15px] text-niebla">Pendiente</span>
            </span>
            <span className="text-[clamp(20px,1.7vw,28px)] font-bold leading-tight">{p.titulo}</span>
            <span className="text-[clamp(17px,1.3vw,22px)] leading-snug text-hueso/80">{p.detalle}</span>
          </motion.li>
        ))}
      </motion.ol>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0, delay: 0.55 } }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {[
          ['Qué se probó', pruebas.queSeProbo, 'qué se probó y cuántas veces'],
          ['Resultados', pruebas.resultados, 'mediciones y valores'],
          ['Opinión de usuarios', pruebas.opinion, 'opinión de los usuarios'],
        ].map(([t, v, falta]) => (
          <div key={t} className="flex flex-col gap-2 rounded-[22px] border border-white/10 px-5 py-4">
            <span className="text-[17px] text-niebla">{t}</span>
            {v ? <span className="text-[20px]">{v}</span> : <Missing>{falta}</Missing>}
          </div>
        ))}
      </motion.div>
      <p className="text-[16px] text-niebla">
        Comparación del agua antes y después del filtro: <Missing>fotos del agua antes y después</Missing>
      </p>
    </div>
  );
}
