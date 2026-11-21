import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AnimatedCounter } from '../../components/AnimatedCounter.jsx';
import { CATEGORIAS, inventario, mxn, sumar } from '../../content/inventario.js';
import { useReduce } from '../../deck/MotionPref.jsx';
import { Parte } from '../../components/Parte.jsx';

const FILTROS = [{ id: 'todos', nombre: 'Todos' }, ...CATEGORIAS];
const fmtMxn = (v) => mxn(v);
const fmtInt = (v) => Math.round(v).toLocaleString('es-MX');

export default function Costos() {
  const reduce = useReduce();
  const [filtro, setFiltro] = useState('todos');
  const { items, notas, precios } = inventario;

  const total = useMemo(() => sumar(items), [items]);
  const porCategoria = useMemo(
    () => CATEGORIAS.map((c) => ({ ...c, total: sumar(items.filter((i) => i.categoria === c.id)), n: items.filter((i) => i.categoria === c.id).length })),
    [items],
  );
  const visibles = filtro === 'todos' ? items : items.filter((i) => i.categoria === filtro);
  const maxItem = Math.max(...items.map((i) => i.total));
  const piezas = items.reduce((s, i) => s + i.cantidad, 0);

  const ease = [0.23, 1, 0.32, 1];

  return (
    <div className="mx-auto flex h-full max-w-[1760px] flex-col gap-6 overflow-y-auto px-5 pb-10 pt-24 md:grid md:grid-cols-12 md:items-center md:gap-[3vw] md:overflow-hidden md:px-[5vw] md:pb-[5vh] md:pt-[11vh]">
      <div className="flex flex-col gap-[2.4vh] md:col-span-5">
        <Parte />
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0 } }}
          className="title-width text-[clamp(36px,min(4.2vw,8vh),80px)] font-bold leading-[1.02] tracking-[-0.03em]"
        >
          Componentes y costos
        </motion.h2>

        {/* Total: calculado sumando las filas del inventario */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0, delay: 0.08 } }}
          className="glass rounded-[28px] px-7 py-5"
        >
          <p className="text-[18px] text-niebla">Total estimado del proyecto</p>
          <p className="text-[clamp(40px,4.6vw,76px)] font-bold leading-none tracking-[-0.03em] text-agua [text-shadow:0_0_28px_rgb(57_255_136/0.35)]" data-testid="costo-total" data-valor={total}>
            <AnimatedCounter value={total} format={fmtMxn} />
          </p>
          <p className="mt-2 text-[18px] text-niebla">
            <AnimatedCounter value={items.length} format={fmtInt} delay={0.2} /> componentes,{' '}
            <AnimatedCounter value={piezas} format={fmtInt} delay={0.2} /> piezas. {precios}
          </p>
        </motion.div>

        {/* Distribución por categoría: barra apilada (scaleX) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0, delay: 0.16 } }}
          className="glass flex flex-col gap-3 rounded-[28px] px-7 py-5"
        >
          <p className="text-[18px] text-niebla">Distribución del costo</p>
          <div className="flex h-5 w-full overflow-hidden rounded-full bg-white/[0.06]" role="img" aria-label={porCategoria.map((c) => `${c.nombre}: ${Math.round((c.total / total) * 100)}%`).join(', ')}>
            {porCategoria.map((c, i) => (
              <motion.div
                key={c.id}
                className="h-full origin-left"
                style={{ width: `${(c.total / total) * 100}%`, background: c.color, boxShadow: c.id === 'agua' ? '0 0 16px rgb(57 255 136 / 0.45)' : undefined }}
                initial={{ scaleX: reduce ? 1 : 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1], delay: 0.3 + i * 0.35 }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {porCategoria.map((c, i) => (
              <div key={c.id} className="flex flex-col">
                <span className="flex items-center gap-2 text-[18px] text-niebla">
                  <span className="h-3 w-3 rounded-full" style={{ background: c.color }} aria-hidden />
                  {c.nombre}
                </span>
                <span className="text-[clamp(22px,1.8vw,30px)] font-bold tabular-nums" data-subtotal={c.id}>
                  <AnimatedCounter value={c.total} format={fmtMxn} delay={0.3 + i * 0.2} />
                </span>
                <span className="text-[17px] text-niebla tabular-nums">{Math.round((c.total / total) * 100)}% del total</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lista de materiales filtrable; la barra de cada fila muestra su peso en el costo */}
      <div className="glass flex min-h-[60vh] flex-col gap-3 rounded-[32px] p-5 md:col-span-7 md:h-[min(80vh,860px)] md:min-h-0 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Filtrar materiales" className="flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filtro === f.id}
                onClick={() => setFiltro(f.id)}
                className={`pressable relative whitespace-nowrap rounded-full px-3 py-2 text-[16px] font-semibold md:px-4 md:text-[18px] transition-colors duration-200 ${filtro === f.id ? 'text-subsuelo' : 'text-niebla hover:text-hueso'}`}
              >
                {filtro === f.id && <motion.span layoutId="costos-filtro" className="absolute inset-0 rounded-full bg-agua" transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }} />}
                <span className="relative">{f.nombre}</span>
              </button>
            ))}
          </div>
          <p className="text-[18px] text-niebla tabular-nums" aria-live="polite">
            Mostrado: <strong className="text-hueso">{mxn(sumar(visibles))}</strong>
          </p>
        </div>

        <ul className="-mr-2 min-h-0 flex-1 overflow-y-auto pr-2" data-testid="materiales">
          <AnimatePresence initial={false} mode="popLayout">
            {visibles.map((it, i) => (
              <motion.li
                key={it.n}
                layout={!reduce}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease, delay: Math.min(i, 10) * 0.03 } }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                className="border-b border-white/[0.07] py-2.5 last:border-0"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[19px] leading-snug">
                    <span className="mr-2 text-[15px] text-niebla tabular-nums">#{it.n}</span>
                    {it.componente}
                    {it.variable && <span className="ml-1 text-niebla" title="Precio variable">*</span>}
                  </span>
                  <span className="shrink-0 text-[19px] font-semibold tabular-nums">{mxn(it.total)}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden>
                    <motion.div
                      className="h-full origin-left rounded-full"
                      style={{ width: `${(it.total / maxItem) * 100}%`, background: it.categoria === 'agua' ? '#39ff88' : '#c4ccc9', opacity: it.categoria === 'agua' ? 0.85 : 0.6 }}
                      initial={{ scaleX: reduce ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, ease, delay: 0.15 + Math.min(i, 10) * 0.03 }}
                    />
                  </div>
                  <span className="w-[150px] shrink-0 text-right text-[15px] text-niebla tabular-nums">
                    {it.cantidad} × {mxn(it.unitario)}
                  </span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {notas.length > 0 && <p className="text-[15px] leading-snug text-niebla">* {notas.join(' ')}</p>}
      </div>
    </div>
  );
}
