import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

// Imagen que se muestra dentro de una tarjeta y se amplía a pantalla completa con un clic.
// Mismo patrón que las tarjetas de "Funcionamiento de cada componente": morph con layoutId,
// fondo oscuro, Esc o clic fuera para cerrar. La imagen nunca se recorta (object-contain).
const morph = { type: 'spring', duration: 0.45, bounce: 0.08 };

export function ImagenAmpliable({ id, src, alt, ancho, alto, className = '', imgClassName = '' }) {
  const [abierta, setAbierta] = useState(false);

  useEffect(() => {
    if (!abierta) return;
    const onKey = (e) => e.key === 'Escape' && setAbierta(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [abierta]);

  return (
    <>
      <motion.button
        layoutId={`imagen-${id}`}
        transition={morph}
        onClick={() => setAbierta(true)}
        className={`group relative block overflow-hidden rounded-[16px] bg-white ${className}`}
        aria-label={`Ampliar imagen: ${alt}`}
        whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
        whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      >
        <img
          src={src}
          alt={alt}
          width={ancho}
          height={alto}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={`h-full w-full object-contain ${imgClassName}`}
        />
        <span className="absolute right-2 top-2 rounded-full bg-[#0b0e0d]/80 px-3 py-1 text-[14px] text-hueso opacity-80 transition-opacity duration-200 group-hover:opacity-100">
          Ampliar
        </span>
      </motion.button>

      <AnimatePresence>
        {abierta && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-[4vw]" data-own-keys>
            <motion.div
              className="absolute inset-0 bg-[#050706]/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              onClick={() => setAbierta(false)}
            />
            <motion.figure
              layoutId={`imagen-${id}`}
              transition={morph}
              role="dialog"
              aria-modal="true"
              aria-label={alt}
              className="relative m-0 overflow-hidden rounded-[24px] bg-white shadow-2xl"
              style={{ aspectRatio: `${ancho} / ${alto}`, width: `min(92vw, calc(82vh * ${ancho / alto}))` }}
            >
              <img src={src} alt={alt} width={ancho} height={alto} className="h-full w-full object-contain" draggable={false} />
              <button
                onClick={() => setAbierta(false)}
                autoFocus
                className="pressable absolute right-3 top-3 rounded-full bg-[#0b0e0d]/85 px-5 py-2 text-[18px] text-hueso hover:bg-[#0b0e0d]"
              >
                Cerrar
              </button>
            </motion.figure>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
