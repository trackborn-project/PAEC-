import { motion } from 'motion/react';
import { Parte } from '../../components/Parte.jsx';
import { Insertar } from '../../components/Missing.jsx';
import { container, item } from '../../components/stagger.js';
import { pruebas } from '../../content/fase3.js';

// V. Resultados esperados: modelo de riego con los valores del equipo (notas.md, "Umbral de riego")
// e interpretación. Sin datos medidos de consumo: quedan como [INSERTAR …].
const UMBRAL = 15;
const DETENER = 100;

export default function Esperados() {
  const { ph } = pruebas;
  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-5 overflow-y-auto px-5 pb-10 pt-20 md:justify-center md:gap-[3vh] md:overflow-hidden md:px-[6vw] md:pb-[5vh] md:pt-[11vh]">
      <motion.div variants={container(0.08, 0.08)} initial="hidden" animate="show" className="flex flex-col gap-3">
        <Parte />
        <motion.h2 variants={item} className="title-width text-[clamp(34px,min(4.2vw,8vh),80px)] font-bold leading-[1.02] tracking-[-0.03em]">
          Resultados esperados
        </motion.h2>
      </motion.div>

      <motion.div variants={container(0.25, 0.08)} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Modelo de riego */}
        <motion.div variants={item} className="glass flex flex-col gap-3 rounded-[24px] px-6 py-5">
          <span className="text-[17px] text-niebla">Modelo de riego (lectura del sensor, escala 0–100)</span>
          <div className="flex flex-col gap-1 text-[clamp(18px,1.4vw,24px)] font-semibold leading-snug tabular-nums">
            <span>
              lectura &lt; {UMBRAL} → <span className="text-agua">bomba encendida</span>
            </span>
            <span>
              lectura ≥ {DETENER} → <span className="text-niebla">bomba apagada</span>
            </span>
            <span>
              {UMBRAL} ≤ lectura &lt; {DETENER} → mantiene su estado
            </span>
          </div>
          <span className="mt-auto border-t border-white/10 pt-2 text-[clamp(16px,1.15vw,19px)] leading-snug text-hueso/85">
            Se espera que el sistema riegue solo cuando la tierra lo necesita y que el riego termine al llegar a {DETENER}.
          </span>
        </motion.div>

        {/* Agua aprovechada */}
        <motion.div variants={item} className="glass flex flex-col gap-3 rounded-[24px] px-6 py-5">
          <span className="text-[17px] text-niebla">Agua aprovechada</span>
          <span className="text-[clamp(18px,1.4vw,24px)] font-semibold leading-snug">
            Condensado de aire acondicionado → agua filtrada para riego
          </span>
          <span className="text-[clamp(16px,1.15vw,19px)] leading-snug text-hueso/85">
            Se espera aprovechar esa agua en lugar de desperdiciarla. pH medido después del filtro: {ph.min}–{ph.max} (agua neutra: {ph.neutro}).
          </span>
          <span className="mt-auto text-[18px]">
            <Insertar>LITROS DE CONDENSADO RECUPERADOS</Insertar>
          </span>
        </motion.div>

        {/* Gráfica pendiente */}
        <motion.div variants={item} className="glass flex flex-col items-start justify-center gap-3 rounded-[24px] px-6 py-5">
          <span className="text-[17px] text-niebla">Gráfica de humedad y riego</span>
          <span className="text-[clamp(16px,1.15vw,19px)] leading-snug text-hueso/85">
            Lecturas del sensor antes y después de cada riego, con el umbral de {UMBRAL} y el corte en {DETENER}.
          </span>
          <span className="text-[18px]">
            <Insertar>GRÁFICA DE HUMEDAD CON DATOS MEDIDOS</Insertar>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
