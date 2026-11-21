// Marcador visible para información que todavía no está en notas.md.
// Gris claro con borde punteado: se distingue sin competir con el verde de los resaltados.
export function Missing({ children, className = '' }) {
  return (
    <span
      className={`inline-block rounded-xl border-2 border-dashed border-white/35 bg-white/[0.06] px-3 py-1 text-[0.85em] font-medium leading-snug text-hueso ${className}`}
    >
      [FALTA: {children}]
    </span>
  );
}

// Mismo marcador, para material que el equipo debe insertar (imágenes CAD, diagramas, gráficos).
export function Insertar({ children, className = '' }) {
  return (
    <span
      className={`inline-block rounded-xl border-2 border-dashed border-white/35 bg-white/[0.06] px-3 py-1 text-[0.85em] font-medium leading-snug text-hueso ${className}`}
    >
      [INSERTAR {children}]
    </span>
  );
}
