import { motion } from 'motion/react';
import { Parte } from '../../components/Parte.jsx';
import { Insertar } from '../../components/Missing.jsx';
import { container, item } from '../../components/stagger.js';

// III.a Bocetos: espacios con el visor de "Vistas del prototipo" (cuadrícula técnica) hasta tener las imágenes.
const BOCETOS = [
  { id: 'modulo', titulo: 'Módulo detector', marcador: 'BOCETO DEL MÓDULO DETECTOR' },
  { id: 'filtro', titulo: 'Filtro de agua', marcador: 'BOCETO DEL FILTRO DE AGUA' },
];

const cuadricula = {
  backgroundImage: 'linear-gradient(to right, #eef1ef 1px, transparent 1px), linear-gradient(to bottom, #eef1ef 1px, transparent 1px)',
  backgroundSize: '48px 48px',
};

export default function Bocetos() {
  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-6 overflow-y-auto px-5 pb-10 pt-20 md:justify-center md:gap-[3.5vh] md:overflow-hidden md:px-[6vw] md:pb-[6vh] md:pt-[12vh]">
      <motion.div variants={container(0.08, 0.08)} initial="hidden" animate="show" className="flex flex-col gap-3">
        <Parte />
        <motion.h2 variants={item} className="title-width text-[clamp(34px,min(4.2vw,8vh),80px)] font-bold leading-[1.02] tracking-[-0.03em]">
          Bocetos
        </motion.h2>
        <motion.p variants={item} className="max-w-[46ch] text-[clamp(20px,1.8vw,30px)] leading-snug text-hueso/90">
          Los primeros dibujos del sistema, antes del modelo CAD.
        </motion.p>
      </motion.div>

      <motion.div variants={container(0.25, 0.1)} initial="hidden" animate="show" className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {BOCETOS.map((b) => (
          <motion.figure key={b.id} variants={item} className="glass relative m-0 flex h-[min(46vh,520px)] min-h-[260px] items-center justify-center overflow-hidden rounded-[32px]">
            <div aria-hidden className="absolute inset-0 opacity-[0.07]" style={cuadricula} />
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgb(57_255_136/0.14),transparent_70%)]" />
            <span className="relative px-4 text-center text-[22px]">
              <Insertar>{b.marcador}</Insertar>
            </span>
            <figcaption className="absolute bottom-5 left-7 text-[18px] text-niebla">{b.titulo}</figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </div>
  );
}
