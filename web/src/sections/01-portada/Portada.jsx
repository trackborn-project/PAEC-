import { motion } from 'motion/react';
import { RevealText } from '../../components/RevealText.jsx';
import { TiltCard } from '../../components/TiltCard.jsx';
import { Particles, DUST } from '../../components/Particles.jsx';
import { team } from '../../content/sections.js';
import isometrica from '../../assets/isometrica.webp';

const TITLE = 'Detector de sequía con ESP32';
const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', duration: 0.7, bounce: 0, delay } },
});

export default function Portada() {
  return (
    <div className="relative h-full w-full">
      <Particles className="absolute inset-0" count={80} palette={DUST} />

      <div className="relative mx-auto flex h-full max-w-[1760px] flex-col gap-6 overflow-y-auto px-5 pb-10 pt-20 md:grid md:grid-cols-12 md:items-center md:gap-[4vw] md:overflow-hidden md:px-[6vw] md:pb-[6vh] md:pt-[11vh]">
        <div className="shrink-0 md:col-span-7 flex flex-col gap-[3.5vh]">
          <motion.p {...fadeUp(0.05)} className="text-[24px] font-medium text-ambar">
            Proyecto PAEC del {team.school}
          </motion.p>

          <RevealText
            text={TITLE}
            delay={0.15}
            className="title-width text-[clamp(40px,6.6vw,128px)] font-bold leading-[0.98] tracking-[-0.035em] text-hueso"
          />

          <motion.p {...fadeUp(0.95)} className="max-w-[30ch] text-[clamp(26px,2vw,36px)] leading-snug text-hueso/90">
            Un prototipo educativo que observa la humedad de la tierra y riega las plantas cuando hace falta. El agua
            pasa por un filtro antes de llegar a ellas.
          </motion.p>

          <motion.div {...fadeUp(1.15)} className="flex flex-wrap gap-x-10 gap-y-2 text-[24px] text-niebla">
            <span>
              Equipo <strong className="font-semibold text-hueso">{team.name}</strong>
            </span>
            <span>
              Grupo <strong className="font-semibold text-hueso">{team.group}</strong>
            </span>
            <span>{team.date}</span>
          </motion.div>
        </div>

        <motion.div
          className="shrink-0 md:col-span-5 h-[min(72vh,760px)]"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1, transition: { type: 'spring', duration: 1, bounce: 0.1, delay: 0.35 } }}
        >
          <TiltCard className="h-full w-full">
            {/* Brillo cálido detrás del render para separarlo del fondo */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_42%,rgb(196_204_201/0.28),transparent_70%)]"
            />
            <div className="relative flex h-full w-full items-center justify-center p-[6%]" style={{ transform: 'translateZ(60px)' }}>
              {/* Sombra de contacto bajo las puntas de las sondas */}
              <div aria-hidden className="absolute bottom-[7%] left-1/2 h-6 w-1/2 -translate-x-1/2 rounded-[50%] bg-black/50 blur-xl" />
              <img
                src={isometrica}
                alt="Render isométrico del módulo: caja metálica con pantalla en la parte superior, botón de encendido, ventana frontal transparente con la tarjeta electrónica a la vista, puerto USB-C y dos sondas metálicas."
                className="relative h-full w-auto object-contain drop-shadow-[0_30px_40px_rgb(0_0_0/0.55)]"
                draggable={false}
              />
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </div>
  );
}
