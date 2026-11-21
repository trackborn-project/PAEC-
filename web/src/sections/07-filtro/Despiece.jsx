import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
import { useDeck } from '../../deck/DeckProvider.jsx';
import { useReduce } from '../../deck/MotionPref.jsx';
import { FiltroSVG } from './FiltroSVG.jsx';
import { AGUA, CX, ETAPAS, PASOS_ENSAMBLADO, PIEZAS, TOTAL_ETAPAS } from './filtroData.js';

// Curvas del proyecto (index.css): movimiento en pantalla = ease-in-out fuerte; entradas = ease-out fuerte.
const IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';
const OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const WHEEL_GAP = 450; // ms entre pasos al usar la rueda

export default function Despiece() {
  const { step, setStep } = useDeck();
  const reduce = useReduce();
  const svgRef = useRef(null);
  const stepRef = useRef(step);
  const doneRef = useRef(Promise.resolve());
  const dropTl = useRef(null);
  const [auto, setAuto] = useState(false);
  const [tip, setTip] = useState(null); // { pieza, x, y }
  const lastWheel = useRef(0);
  const panelRef = useRef(null);

  stepRef.current = step;
  const etapa = Math.min(step, TOTAL_ETAPAS - 1);

  // ── Aplica el estado de una etapa: cada pieza va a su posición (armada o separada). ──
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const q = (sel) => svg.querySelector(sel);
    const qa = (sel) => [...svg.querySelectorAll(sel)];
    const d = (s) => (reduce ? 0 : s);
    const tweens = [];

    PIEZAS.forEach((p, i) => {
      const separada = etapa >= i + 1;
      // La pieza que se separa en esta etapa es la que se mueve; las demás ya están en su sitio.
      tweens.push(
        gsap.to(q(`#pieza-${p.id}`), {
          y: separada ? p.separado : p.armado,
          x: CX,
          duration: d(0.9),
          ease: IN_OUT,
          overwrite: 'auto',
        }),
      );
      const label = q(`#etiqueta-${p.id}`);
      tweens.push(
        gsap.to(label, { opacity: separada ? 1 : 0, duration: d(separada ? 0.35 : 0.15), delay: separada ? d(0.45) : 0, ease: OUT, overwrite: 'auto' }),
        gsap.to(label.querySelector('[data-guia]'), { scaleX: separada ? 1 : 0, duration: d(0.4), delay: separada ? d(0.45) : 0, ease: OUT, overwrite: 'auto' }),
      );
    });

    // Agua dentro de los embudos y nivel del balde.
    const conAgua = etapa >= 7;
    qa('[data-agua]').forEach((el) => tweens.push(gsap.to(el, { opacity: conAgua ? 1 : 0, duration: d(0.4), ease: OUT, overwrite: 'auto' })));
    tweens.push(gsap.to(q('[data-nivel]'), { scaleY: etapa >= 8 ? 0.72 : etapa >= 7 ? 0.12 : 0, duration: d(1.4), ease: IN_OUT, overwrite: 'auto' }));

    // Bomba activa: pulso y salida hacia el riego.
    const activa = etapa >= 8;
    const pulso = q('[data-pulso]');
    const salida = q('[data-salida]');
    gsap.killTweensOf([pulso, salida]);
    if (activa && !reduce) {
      gsap.fromTo(pulso, { scale: 0.7, opacity: 0.7 }, { scale: 1.25, opacity: 0, duration: 1.2, ease: OUT, repeat: -1, delay: 0.6 });
      gsap.fromTo(salida, { opacity: 1, strokeDashoffset: 0 }, { strokeDashoffset: -60, duration: 0.9, ease: 'none', repeat: -1, delay: 0.6 });
    } else {
      gsap.set(pulso, { opacity: activa ? 0.6 : 0, scale: 1 });
      gsap.set(salida, { opacity: activa ? 1 : 0, strokeDashoffset: 0 });
    }

    // Gota: recorre las etapas cambiando de color (solo en la etapa del recorrido).
    dropTl.current?.kill();
    const gota = q('#gota');
    const forma = q('[data-gota]');
    if (etapa === 7) {
      const ys = [PIEZAS[0].separado + 30, PIEZAS[1].separado + 60, PIEZAS[2].separado + 60, PIEZAS[3].separado + 60, PIEZAS[4].separado + 200];
      if (reduce) {
        gsap.set(gota, { x: CX, y: ys[3], opacity: 1 });
        gsap.set(forma, { fill: AGUA[3] });
      } else {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3, delay: 0.5 });
        tl.set(gota, { x: CX, y: ys[0], opacity: 0 }).set(forma, { fill: AGUA[0] });
        tl.to(gota, { opacity: 1, duration: 0.2, ease: OUT });
        ys.slice(1).forEach((y, i) => {
          tl.to(gota, { y, duration: 0.7, ease: IN_OUT });
          tl.to(forma, { fill: AGUA[Math.min(i + 1, 3)], duration: 0.5, ease: 'none' }, '<');
        });
        tl.to(gota, { opacity: 0, duration: 0.2, ease: OUT });
        dropTl.current = tl;
      }
    } else {
      gsap.to(gota, { opacity: 0, duration: d(0.15), overwrite: 'auto' });
    }

    doneRef.current = Promise.all(tweens.map((t) => t.then()));
  }, [etapa, reduce]);

  // Valores iniciales sin animar (montaje).
  useEffect(() => {
    const svg = svgRef.current;
    PIEZAS.forEach((p) => {
      gsap.set(svg.querySelector(`#pieza-${p.id}`), { x: CX, y: p.armado });
      gsap.set(svg.querySelector(`#etiqueta-${p.id} [data-guia]`), { scaleX: 0 });
    });
    // El agua del balde crece desde el fondo.
    gsap.set(svg.querySelector('[data-nivel]'), { transformOrigin: '50% 100%', scaleY: 0 });
    gsap.set(svg.querySelector('[data-pulso]'), { transformOrigin: '50% 50%' });
    return () => {
      dropTl.current?.kill();
      gsap.killTweensOf(svg.querySelectorAll('*'));
    };
  }, []);

  const irEtapa = useCallback(
    (n) => {
      setStep(Math.max(0, Math.min(TOTAL_ETAPAS - 1, n)));
      // Espera a que React aplique la etapa y terminen las transiciones.
      return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => doneRef.current.then(r))));
    },
    [setStep],
  );

  // API pública para pruebas y control externo.
  useEffect(() => {
    window.despiece = { irEtapa, etapaActual: () => stepRef.current, totalEtapas: TOTAL_ETAPAS };
    return () => {
      delete window.despiece;
    };
  }, [irEtapa]);

  // Reproducción automática: avanza una etapa cada 1.8 s y se detiene al final.
  useEffect(() => {
    if (!auto) return;
    if (etapa >= TOTAL_ETAPAS - 1) {
      setAuto(false);
      return;
    }
    const id = setTimeout(() => setStep(etapa + 1), etapa === 0 ? 400 : 1800);
    return () => clearTimeout(id);
  }, [auto, etapa, setStep]);

  // Rueda del ratón: avanza o rearma (sin salir de la sección).
  useEffect(() => {
    const el = panelRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheel.current < WHEEL_GAP || Math.abs(e.deltaY) < 4) return;
      lastWheel.current = now;
      setAuto(false);
      const s = stepRef.current;
      setStep(Math.max(0, Math.min(TOTAL_ETAPAS - 1, s + (e.deltaY > 0 ? 1 : -1))));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [setStep]);

  const showTip = (pieza, e) => {
    const panel = panelRef.current.getBoundingClientRect();
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ pieza, x: r.right - panel.left + 12, y: r.top + r.height / 2 - panel.top });
  };

  const info = ETAPAS[etapa];
  const pasoActivo = PASOS_ENSAMBLADO.find((p) => p.etapa === etapa && etapa <= PIEZAS.length);

  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-6 overflow-y-auto px-5 pb-10 pt-24 md:grid md:grid-cols-12 md:items-center md:gap-[3vw] md:overflow-hidden md:px-[5vw] md:pb-[5vh] md:pt-[11vh]">
      <div className="flex flex-col gap-[2.2vh] md:col-span-5">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0 } }}
          className="title-width text-[clamp(36px,min(4vw,7.5vh),76px)] font-bold leading-[1.02] tracking-[-0.03em]"
        >
          Despiece y ensamblado del filtro
        </motion.h2>

        {/* Etapa actual */}
        <div className="glass flex flex-col gap-2 rounded-[24px] px-6 py-4" aria-live="polite">
          <p className="text-[18px] text-niebla tabular-nums">
            Etapa {etapa} de {TOTAL_ETAPAS - 1}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={etapa}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <p className="text-[clamp(22px,1.7vw,28px)] font-bold leading-tight" data-testid="etapa-titulo">
                {info.titulo}
              </p>
              <p className="text-[clamp(18px,1.3vw,22px)] leading-snug text-hueso/85">{info.texto}</p>
            </motion.div>
          </AnimatePresence>
          {/* Barra de progreso de etapas (scaleX) */}
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden>
            <div
              className="h-full origin-left rounded-full bg-agua shadow-[0_0_12px_rgb(57_255_136/0.6)] transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
              style={{ transform: `scaleX(${etapa / (TOTAL_ETAPAS - 1)})` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setAuto(false); setStep(Math.max(0, etapa - 1)); }} className="pressable rounded-full border border-white/15 px-5 py-2.5 text-[20px] hover:bg-white/10" aria-label="Etapa anterior">
            ← Anterior
          </button>
          <button onClick={() => { setAuto(false); setStep(Math.min(TOTAL_ETAPAS - 1, etapa + 1)); }} className="pressable rounded-full border border-white/15 px-5 py-2.5 text-[20px] hover:bg-white/10" aria-label="Etapa siguiente">
            Siguiente →
          </button>
          <button
            onClick={() => {
              if (!auto && etapa >= TOTAL_ETAPAS - 1) setStep(0);
              setAuto((a) => !a);
            }}
            aria-pressed={auto}
            className={`pressable rounded-full border px-5 py-2.5 text-[20px] font-semibold ${auto ? 'border-agua bg-agua text-subsuelo' : 'border-agua/60 text-agua hover:bg-agua/10'}`}
          >
            {auto ? 'Pausar' : 'Reproducir'}
          </button>
          <button onClick={() => { setAuto(false); setStep(0); }} className="pressable rounded-full border border-white/15 px-5 py-2.5 text-[20px] hover:bg-white/10" data-testid="reiniciar">
            Reiniciar
          </button>
        </div>

        {/* Pasos de ensamblado: de abajo hacia arriba; clic = la animación va a esa etapa */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[18px] text-niebla">Pasos de ensamblado (según el diagrama)</p>
          <ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {PASOS_ENSAMBLADO.map((p) => {
              const on = pasoActivo?.n === p.n;
              return (
                <li key={p.n}>
                  <button
                    onClick={() => { setAuto(false); setStep(p.etapa); }}
                    data-paso={p.n}
                    data-etapa={p.etapa}
                    aria-current={on ? 'step' : undefined}
                    className={`pressable flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left text-[17px] leading-tight transition-colors duration-200 ${
                      on ? 'border-agua/70 bg-agua/10' : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[15px] font-bold tabular-nums ${on ? 'bg-agua text-subsuelo' : 'border border-white/25'}`}>{p.n}</span>
                    Colocar {p.pieza.corto}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div ref={panelRef} className="glass relative h-[70vh] shrink-0 rounded-[32px] md:col-span-7 md:h-[min(80vh,860px)]" data-own-keys-wheel>
        <div aria-hidden className="absolute inset-0 rounded-[32px] bg-[radial-gradient(ellipse_45%_45%_at_32%_50%,rgb(57_255_136/0.07),transparent_70%)]" />
        <div className="absolute inset-[3%]">
          <FiltroSVG
            ref={svgRef}
            activeId={tip?.pieza.id}
            onPieceEnter={(p, e) => showTip(p, e)}
            onPieceLeave={() => setTip(null)}
            onPieceTap={(p, e) => (tip?.pieza.id === p.id ? setTip(null) : showTip(p, e))}
          />
        </div>
        <AnimatePresence>
          {tip && (
            <motion.div
              key={tip.pieza.id}
              role="tooltip"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.16, ease: [0.23, 1, 0.32, 1] } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="pointer-events-none absolute z-10 w-[300px] rounded-2xl border border-white/15 bg-[#171c1b]/95 px-4 py-3 text-[18px] leading-snug shadow-2xl"
              style={{ left: Math.min(tip.x, (panelRef.current?.clientWidth ?? 600) - 310), top: tip.y, translate: '0 -50%', transformOrigin: 'left center' }}
            >
              <strong className="block text-[19px]">{tip.pieza.titulo}</strong>
              {tip.pieza.tip}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
