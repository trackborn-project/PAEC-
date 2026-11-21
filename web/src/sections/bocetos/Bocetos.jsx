import { motion } from 'motion/react';
import { Parte } from '../../components/Parte.jsx';
import { container, item } from '../../components/stagger.js';
import bocetoSistema from '../../assets/boceto-sistema.webp';
import bocetoFiltro from '../../assets/boceto-filtro.webp';

// III.a Bocetos: imágenes de Contenido/ ("Sistema - Boceto.png" y "filtro - Boceto.jpg") en el visor
// de "Vistas del prototipo" (cuadrícula técnica). Se muestran completas (object-contain).
const BOCETOS = [
  {
    id: 'modulo',
    titulo: 'Módulo detector',
    src: bocetoSistema,
    alt: 'Boceto a línea del módulo detector: caja con pantalla y botón de encendido arriba, ventana frontal con la tarjeta electrónica, puerto USB-C, un orificio lateral y dos sondas.',
  },
  {
    id: 'filtro',
    titulo: 'Filtro de agua',
    src: bocetoFiltro,
    alt: 'Boceto del filtro por etapas: entrada de condensado de AC, etapa 1 de malla y carbón activo, etapa 2 de grava caliza, etapa 3 de tezontle, balde hermético de 19 L y bomba de agua para riego con ESP32.',
  },
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
            {/* Hoja blanca del boceto, completa dentro del visor (deja espacio abajo para el pie) */}
            <div className="absolute inset-x-5 bottom-14 top-5 flex items-center justify-center">
              <img src={b.src} alt={b.alt} className="max-h-full max-w-full rounded-[18px] object-contain shadow-[0_24px_30px_rgb(0_0_0/0.5)]" draggable={false} />
            </div>
            <figcaption className="absolute bottom-5 left-7 text-[18px] text-niebla">{b.titulo}</figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </div>
  );
}
