import { motion } from 'motion/react';
import { Parte } from '../../components/Parte.jsx';
import { container, item } from '../../components/stagger.js';
import { aguaRescatada, pruebas } from '../../content/fase3.js';
import { ImagenAmpliable } from '../../components/ImagenAmpliable.jsx';
import graficoAgua from '../../assets/grafico-agua.webp';

// V. Resultados esperados: modelo de riego con los valores del equipo (notas.md, "Umbral de riego")
// e interpretación. Agua rescatada y gráfico de referencia: notas.md, "ACTUALIZAR › Diapositiva 15".
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
          {/* Agua rescatada por cada litro que entra al filtro */}
          <div className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-2" data-testid="agua-rescatada">
            <span className="text-[clamp(16px,1.15vw,19px)] leading-snug">
              Por cada litro que entra al filtro se rescatan <strong className="text-agua">mínimo {aguaRescatada.rescata} ml</strong> de {aguaRescatada.entra} ml, ya filtrados y libres de impurezas.
            </span>
            <div className="h-2 overflow-hidden rounded-full bg-white/10" role="img" aria-label={`${aguaRescatada.rescata} de ${aguaRescatada.entra} ml`}>
              <div className="h-full rounded-full bg-agua shadow-[0_0_12px_rgb(57_255_136/0.6)]" style={{ width: `${(aguaRescatada.rescata / aguaRescatada.entra) * 100}%` }} />
            </div>
          </div>
        </motion.div>

        {/* Gráfico de referencia (Contenido/grafico-agua.jpg); clic para ampliar */}
        <motion.div variants={item} className="glass flex flex-col gap-3 rounded-[24px] px-6 py-5">
          <span className="text-[17px] text-niebla">Gráfico de referencia</span>
          <ImagenAmpliable
            id="grafico-agua"
            src={graficoAgua}
            ancho={1376}
            alto={768}
            alt="Gráfico de barras de referencia sobre 1000 ml de agua: filtración multimedia 50, 950 y 50; ultrafiltración 75, 925 y 75; ósmosis inversa de agua salobre 800 y 200; ósmosis inversa de agua de mar 575; ajuste de pH 998 y 2."
            className="w-full"
            imgClassName="aspect-[1376/768]"
          />
          <span className="text-[clamp(15px,1.05vw,18px)] leading-snug text-hueso/85">
            Compara métodos de filtración en general sobre 1000 ml de agua. No son mediciones de nuestro filtro.
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
