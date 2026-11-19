// Marcador visible para información que todavía no está en notas.md.
export function Missing({ children, className = '' }) {
  return (
    <span
      className={`inline-block rounded-xl border-2 border-dashed border-ambar/70 bg-ambar/10 px-3 py-1 text-[0.85em] font-medium leading-snug text-ambar ${className}`}
    >
      [FALTA: {children}]
    </span>
  );
}
