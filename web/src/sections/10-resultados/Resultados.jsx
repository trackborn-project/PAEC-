import { motion } from 'motion/react';
import { Missing } from '../../components/Missing.jsx';
import { container, item } from '../../components/stagger.js';
import { pruebas } from '../../content/fase3.js';
import { ImagenAmpliable } from '../../components/ImagenAmpliable.jsx';
import aguaComparacion from '../../assets/agua-comparacion.webp';
import { Parte } from '../../components/Parte.jsx';

// Pruebas que hizo el equipo (notas.md), el pH medido y la opinión de quienes probaron el prototipo.
// Lo que notas.md no dice queda como [FALTA].

// Escala de pH 0–14 con el rango medido después del filtro y la marca de agua neutra.
function EscalaPh({ ph }) {
  const pct = (v) => `${(v / 14) * 100}%`;
  return (
    <div className="flex flex-col gap-2" role="img" aria-label={`pH después del filtro: entre ${ph.min} y ${ph.max}. Agua neutra: ${ph.neutro}.`}>
      <div className="relative h-3 rounded-full bg-white/15">
        <span className="absolute -top-1.5 h-6 w-0.5 bg-hueso" style={{ left: pct(ph.neutro) }} aria-hidden />
        <span
          className="absolute -top-1 h-5 rounded-full border-2 border-hueso shadow-[0_0_14px_rgb(57_255_136/0.6)]"
          style={{ left: pct(ph.min), width: `calc(${pct(ph.max - ph.min)})` }}
          aria-hidden
        />
      </div>
      <div className="relative h-5 text-[15px] text-niebla tabular-nums" aria-hidden>
        <span className="absolute left-0">0</span>
        <span className="absolute -translate-x-1/2" style={{ left: pct(ph.neutro) }}>
          {ph.neutro} neutra
        </span>
        <span className="absolute right-0">14</span>
      </div>
    </div>
  );
}

export default function Resultados() {
  const { ph } = pruebas;
  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-5 overflow-y-auto px-5 pb-10 pt-20 md:justify-center md:gap-[2.6vh] [@media(max-height:760px)]:md:gap-[1.8vh] md:overflow-hidden md:px-[6vw] md:pb-[5vh] md:pt-[11vh]">
      <motion.div variants={container(0.08, 0.08)} initial="hidden" animate="show" className="flex flex-col gap-3">
        <Parte />
        <motion.h2 variants={item} className="title-width text-[clamp(34px,min(4.2vw,8vh),80px)] font-bold leading-[1.02] tracking-[-0.03em]">
          Pruebas y resultados
        </motion.h2>
        <motion.p variants={item} className="max-w-[60ch] text-[clamp(19px,1.5vw,26px)] leading-snug text-hueso/90">
          {pruebas.estado}
        </motion.p>
      </motion.div>

      {/* Qué se probó y qué resultó, una tarjeta por prueba */}
      <motion.ol variants={container(0.2, 0.08)} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {pruebas.hechas.map((p, i) => (
          <motion.li key={p.id} variants={item} className="glass flex flex-col gap-2 rounded-[24px] px-6 py-4">
            <span className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-agua text-[16px] font-bold text-subsuelo tabular-nums">{i + 1}</span>
              <span className="text-[clamp(20px,1.6vw,26px)] font-bold leading-tight">{p.titulo}</span>
            </span>
            <span className="text-[clamp(16px,1.15vw,19px)] leading-snug text-hueso/80">{p.prueba}</span>
            <span className="mt-auto border-t border-white/10 pt-2 text-[clamp(16px,1.15vw,19px)] leading-snug">
              <span className="text-agua">Resultado: </span>
              {p.resultado ?? <Missing>resultado de esta prueba</Missing>}
            </span>
          </motion.li>
        ))}
      </motion.ol>

      {/* pH medido + opiniones */}
      <motion.div variants={container(0.45, 0.08)} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <motion.div variants={item} className="glass flex flex-col justify-between gap-3 rounded-[24px] px-6 py-4" data-testid="ph">
          <span className="text-[17px] text-niebla">pH después del filtro</span>
          <div className="flex items-end justify-between gap-4">
            <span className="text-[clamp(40px,4vw,64px)] font-bold leading-none tracking-[-0.03em] text-agua tabular-nums [text-shadow:0_0_24px_rgb(57_255_136/0.35)]">
              {ph.min}–{ph.max}
            </span>
            {/* Comparación del agua antes y después del filtro (Contenido/agua-comparacion.jpg); clic para ampliar */}
            <ImagenAmpliable
              id="agua-comparacion"
              src={aguaComparacion}
              ancho={1376}
              alto={768}
              alt="Comparación del agua antes y después del filtro: a la izquierda, agua turbia con partículas, sedimentos, microorganismos, residuos orgánicos y olor, pH ácido de 5.0 a 6.5; al centro, el proceso de filtrado; a la derecha, agua transparente con contaminantes eliminados, filtración por carbón activado y mineralización, y pH alcalino de 7.5 a 8.5."
              className="h-[clamp(58px,8.5vh,96px)] shrink-0"
              imgClassName="aspect-[1376/768]"
            />
          </div>
          <EscalaPh ph={ph} />
        </motion.div>
        {pruebas.opiniones.map((o) => (
          <motion.figure key={o.nombre} variants={item} className="m-0 flex flex-col gap-2 rounded-[24px] border border-white/10 px-6 py-4">
            <blockquote className="m-0 text-[clamp(15px,1.05vw,18px)] leading-snug text-hueso/90">“{o.texto}”</blockquote>
            <figcaption className="mt-auto text-[16px] font-semibold text-niebla">— {o.nombre}</figcaption>
          </motion.figure>
        ))}
      </motion.div>

      <p className="text-[16px] text-niebla">
        Opiniones de conocidos y familiares cercanos. La imagen junto al pH compara el agua antes y después del filtro (tócala para ampliarla).
      </p>
    </div>
  );
}
