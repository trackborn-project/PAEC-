import { motion } from 'motion/react';
import { RevealText } from '../../components/RevealText.jsx';
import { Particles, WATER } from '../../components/Particles.jsx';
import { Missing } from '../../components/Missing.jsx';
import { fraseFinal, queremosAprender } from '../../content/fase3.js';
import { team } from '../../content/sections.js';
import { Parte } from '../../components/Parte.jsx';

// Cierre: los orbes ya están en "agua limpia" (mood 1). Frase de impacto y preguntas.
export default function Conclusion() {
  return (
    <div className="relative h-full w-full">
      <Particles className="absolute inset-0" count={60} palette={WATER} rise={0.18} />
      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center gap-[4vh] overflow-y-auto px-5 pb-10 pt-20 text-center md:px-[6vw]">
        <Parte />
        {fraseFinal ? (
          <figure className="m-0 flex flex-col items-center gap-[2vh]">
            <RevealText
              as="h2"
              by="word"
              text={`“${fraseFinal.texto}”`}
              className="title-width max-w-[38ch] text-[clamp(24px,min(2.7vw,5vh),52px)] font-bold leading-[1.12] tracking-[-0.02em]"
            />
            <motion.figcaption
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.4, delay: 1 } }}
              className="text-[clamp(18px,1.5vw,26px)] text-niebla"
            >
              — {fraseFinal.autor}
            </motion.figcaption>
          </figure>
        ) : (
          <RevealText
            as="h2"
            by="word"
            text={queremosAprender}
            className="title-width max-w-[24ch] text-[clamp(32px,min(4.6vw,9vh),88px)] font-bold leading-[1.05] tracking-[-0.03em]"
          />
        )}
        {!fraseFinal && (
          <p className="text-[16px] text-niebla">
            <Missing>frase final del equipo</Missing>
          </p>
        )}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.7, bounce: 0, delay: 1.2 } }}
          className="text-[clamp(40px,5vw,96px)] font-bold tracking-[-0.03em] text-agua [text-shadow:0_0_40px_rgb(57_255_136/0.35)]"
        >
          ¿Preguntas?
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.4, delay: 1.5 } }}
          className="text-[clamp(17px,1.4vw,24px)] text-niebla"
        >
          Equipo {team.name}, grupo {team.group}, {team.school}
        </motion.p>
      </div>
    </div>
  );
}
