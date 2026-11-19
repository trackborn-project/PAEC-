import { motion } from 'motion/react';
import { CrackedSoil } from './CrackedSoil.jsx';
import { GlassCard } from '../../components/GlassCard.jsx';
import { Missing } from '../../components/Missing.jsx';
import { container, item } from '../../components/stagger.js';

export default function Problema() {
  return (
    <div className="mx-auto grid h-full max-w-[1760px] grid-cols-12 items-center gap-[3.5vw] px-[6vw] pb-[6vh] pt-[12vh]">
      <motion.div
        className="glass col-span-5 h-[min(74vh,780px)] overflow-hidden rounded-[36px] p-0"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1, transition: { type: 'spring', duration: 0.8, bounce: 0 } }}
      >
        <CrackedSoil className="h-full w-full" />
      </motion.div>

      <motion.div className="col-span-7 flex flex-col gap-[2.4vh]" variants={container(0.2, 0.09)} initial="hidden" animate="show">
        <motion.h2 variants={item} className="title-width text-[clamp(48px,4.4vw,84px)] font-extrabold leading-[1.02] tracking-[-0.015em]">
          ¿Cuándo necesita agua la tierra?
        </motion.h2>

        <motion.p variants={item} className="max-w-[34ch] text-[clamp(26px,1.9vw,34px)] leading-snug text-hueso/90">
          A simple vista no siempre se distingue. El proyecto busca hacer visible esa condición.
        </motion.p>

        <motion.div variants={item}>
          <GlassCard className="flex flex-col gap-2 px-8 py-5">
            <p className="text-[20px] text-niebla">Necesidad identificada en el CBTis 40</p>
            <p className="text-[28px] font-semibold leading-snug">Poco mantenimiento a las zonas verdes.</p>
            <p className="text-[22px] text-niebla">
              Usuarios: los alumnos. Se probará en macetas.
            </p>
            <p className="mt-1 inline-flex w-fit items-center gap-3 rounded-full border border-ambar/40 bg-ambar/10 px-4 py-1.5 text-[20px] leading-snug text-ambar">
              <span className="h-2.5 w-2.5 rounded-full bg-ambar" aria-hidden />
              Por validar con observación y opinión de usuarios
            </p>
          </GlassCard>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 gap-5">
          <GlassCard className="flex flex-col justify-center gap-2 px-7 py-4">
            <p className="text-[20px] text-niebla">Zonas verdes del plantel</p>
            <Missing>cifra con fuente</Missing>
          </GlassCard>
          <GlassCard className="flex flex-col justify-center gap-2 px-7 py-4">
            <p className="text-[20px] text-niebla">Riego actual</p>
            <Missing>frecuencia observada</Missing>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
