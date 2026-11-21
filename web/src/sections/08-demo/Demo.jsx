import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Gauge } from './Gauge.jsx';
import { CrackedSoil } from '../02-problema/CrackedSoil.jsx';
import { Particles, WATER } from '../../components/Particles.jsx';
import { Missing } from '../../components/Missing.jsx';

// Simulación ilustrativa con los valores del equipo (notas.md, "Umbral de riego"):
// riega cuando la lectura baja de 15 y se detiene al llegar a 100. Falta documentar la calibración.
const THRESHOLD = 15;
const STOP_AT = 100;

function Toast({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: -16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 items-center gap-4 whitespace-nowrap rounded-2xl border border-alerta/50 bg-[#2a1214] px-6 py-4 text-[24px] shadow-2xl"
          style={{ transformOrigin: 'top center' }}
        >
          <span className="h-4 w-4 rounded-full bg-alerta" aria-hidden />
          <span>
            <strong>Tierra seca.</strong> El ESP32 activaría la bomba.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Demo() {
  const [value, setValue] = useState(72);
  const [running, setRunning] = useState(false);
  const [pumpOn, setPumpOn] = useState(false);
  const [toast, setToast] = useState(false);
  const dry = value < THRESHOLD;
  const wasDry = useRef(dry);
  const toastTimer = useRef();

  // Al cruzar el umbral hacia "seco" se dispara la notificación.
  useEffect(() => {
    if (dry && !wasDry.current) {
      setToast(true);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(false), 3500);
    }
    if (!dry) setToast(false);
    wasDry.current = dry;
  }, [dry]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Modo manual: la bomba sigue al umbral. Modo simulación: se seca, riega hasta STOP_AT y se detiene.
  useEffect(() => {
    if (!running) {
      setPumpOn(dry);
      return;
    }
    let raf;
    let pump = dry;
    let v = value;
    const loop = () => {
      if (v < THRESHOLD) pump = true;
      if (v >= STOP_AT) pump = false;
      v = Math.min(100, Math.max(0, v + (pump ? 0.4 : -0.14)));
      setValue(v);
      setPumpOn(pump);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // Solo se reinicia al empezar o detener la simulación.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  useEffect(() => {
    if (!running) setPumpOn(dry);
  }, [dry, running]);

  const state = dry ? 'Seca' : value < STOP_AT ? 'Húmeda' : 'Riego completo';
  const wet = value / 100;

  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-6 overflow-y-auto px-5 pb-10 pt-20 md:grid md:grid-cols-12 md:items-center md:gap-[3.5vw] md:overflow-hidden md:px-[6vw] md:pb-[6vh] md:pt-[12vh]">
      {/* Tierra: se oscurece al humedecerse y se agrieta al secarse */}
      <motion.div
        className="glass relative shrink-0 md:col-span-7 h-[min(76vh,800px)] overflow-hidden rounded-[36px]"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1, transition: { type: 'spring', duration: 0.8, bounce: 0 } }}
      >
        <CrackedSoil className="absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#3b2414,#1a0f07)] transition-opacity duration-300"
          style={{ opacity: Math.min(0.92, wet * 1.1) }}
        />
        <div aria-hidden className="absolute inset-0 transition-opacity duration-500" style={{ opacity: pumpOn ? 1 : 0 }}>
          <Particles count={140} palette={WATER} rise={-1.8} className="absolute inset-0" />
        </div>

        <Toast show={toast} />

        {/* LED virtual + estado de la bomba */}
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4">
          <div className="glass flex items-center gap-4 rounded-full px-6 py-3 text-[24px]">
            <span className="relative grid h-6 w-6 place-items-center" aria-hidden>
              {dry && <span className="absolute inset-0 animate-ping rounded-full bg-alerta/60" />}
              <span className={`relative h-5 w-5 rounded-full ${dry ? 'bg-alerta shadow-[0_0_16px_#ff5d5d]' : 'bg-brote shadow-[0_0_12px_#8dffb9]'}`} />
            </span>
            {dry ? 'Alerta de sequía' : 'Sin alerta'}
          </div>
          <div className="glass flex items-center gap-3 rounded-full px-6 py-3 text-[24px]">
            Bomba
            <strong className={pumpOn ? 'text-agua' : 'text-niebla'}>{pumpOn ? 'encendida' : 'apagada'}</strong>
          </div>
        </div>
      </motion.div>

      <div className="shrink-0 md:col-span-5 flex flex-col gap-[2vh]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0 } }}
          className="title-width text-[clamp(32px,min(4.2vw,8vh),80px)] font-bold leading-[1.02] tracking-[-0.03em]"
        >
          Demostración
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0, delay: 0.1 } }}
          className="glass flex flex-col gap-2 rounded-[28px] px-7 pb-5 pt-4"
        >
          <Gauge value={value} threshold={THRESHOLD} dry={dry} />
          <p className="text-center text-[30px] font-bold" aria-live="polite">
            Tierra <span className={dry ? 'text-alerta' : 'text-agua'}>{state.toLowerCase()}</span>
          </p>

          <label className="flex flex-col gap-2 text-[22px] text-niebla" data-own-keys>
            Lectura del sensor (escala 0–100 del equipo)
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={Math.round(value)}
              onChange={(e) => {
                setRunning(false);
                setValue(Number(e.target.value));
              }}
              className="demo-range"
              style={{ '--fill': `${value}%` }}
              aria-valuetext={state}
            />
          </label>

          <button
            onClick={() => setRunning((r) => !r)}
            className={`pressable mt-1 rounded-full border px-6 py-3 text-[24px] font-semibold transition-colors duration-200 ${
              running ? 'border-white/25 bg-white/10' : 'border-agua bg-agua text-subsuelo'
            }`}
          >
            {running ? 'Detener simulación' : 'Simular secado y riego'}
          </button>
        </motion.div>

        <p className="text-[20px] leading-snug text-niebla">
          Simulación ilustrativa: riega bajo 15 y se detiene en 100. <Missing>cómo se calibró la escala</Missing>
        </p>
      </div>
    </div>
  );
}
