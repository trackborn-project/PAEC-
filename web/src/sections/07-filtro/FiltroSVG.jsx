import { forwardRef } from 'react';
import { AGUA, CX, LABEL_X, PIEZAS, VB } from './filtroData.js';

// Filtro redibujado a mano en SVG a partir de Contenido/filtro.jpg.
// Cada pieza es un <g id="pieza-…">; GSAP mueve ese grupo en vertical (solo transform).
const LINE = '#c9d1ce';
const FILL = 'rgb(255 255 255 / 0.035)';
const stroke = { fill: 'none', stroke: LINE, strokeWidth: 2.5, strokeLinejoin: 'round', strokeLinecap: 'round' };

// Cono del embudo (coordenadas locales: borde superior en y = 0).
const CONE = 'M-120 0 L-22 118 L22 118 L120 0 Z';

function Embudo({ id, children, water }) {
  return (
    <>
      <defs>
        <clipPath id={`cono-${id}`}>
          <path d={CONE} />
        </clipPath>
      </defs>
      <path d={CONE} fill={FILL} />
      {/* Agua dentro del embudo: aparece en la etapa del recorrido */}
      <g data-agua={id} opacity="0">
        <path d="M-96 28 L-22 118 L22 118 L96 28 Z" fill={water} fillOpacity="0.32" />
      </g>
      <g clipPath={`url(#cono-${id})`}>{children}</g>
      <path d={CONE} {...stroke} />
      <ellipse cx="0" cy="0" rx="120" ry="20" fill="rgb(255 255 255 / 0.04)" {...stroke} />
      <ellipse cx="0" cy="0" rx="104" ry="14" {...stroke} strokeOpacity="0.35" />
      {/* Tubo de salida */}
      <rect x="-22" y="118" width="44" height="58" fill={FILL} {...stroke} />
    </>
  );
}

function Malla() {
  // Domo de malla con trama cruzada (carbón activo debajo).
  return (
    <g>
      <defs>
        <pattern id="trama" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 V10 M0 0 H10" stroke={LINE} strokeOpacity="0.55" strokeWidth="1.4" />
        </pattern>
      </defs>
      <path d="M-100 26 Q0 -6 100 26 L22 118 L-22 118 Z" fill="#1a1f1d" />
      <path d="M-100 26 Q0 -6 100 26 L22 118 L-22 118 Z" fill="url(#trama)" />
      <path d="M-100 26 Q0 -6 100 26" {...stroke} />
    </g>
  );
}

function Grava() {
  const stones = [
    [-70, 40, 13, 9], [-44, 36, 12, 9], [-18, 34, 13, 8], [8, 34, 12, 9], [34, 36, 13, 9], [62, 40, 12, 8],
    [-56, 58, 12, 9], [-30, 56, 13, 9], [-4, 55, 12, 8], [22, 56, 13, 9], [48, 58, 12, 9],
    [-40, 76, 12, 8], [-14, 75, 13, 9], [12, 76, 12, 8], [36, 78, 11, 8],
    [-22, 94, 11, 8], [4, 95, 12, 8], [24, 96, 10, 7],
  ];
  return (
    <g>
      {stones.map(([x, y, rx, ry], i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#1d2220" stroke={LINE} strokeWidth="1.6" />
      ))}
    </g>
  );
}

function Tezontle() {
  const rocks = [
    [-62, 44, 20], [-24, 40, 21], [16, 40, 20], [56, 44, 19],
    [-42, 74, 19], [0, 72, 20], [40, 76, 18],
    [-18, 100, 16], [18, 102, 15],
  ];
  return (
    <g>
      {rocks.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#1d2220" stroke={LINE} strokeWidth="1.8" />
          {/* Poros de la piedra volcánica */}
          <circle cx={x - r * 0.35} cy={y - r * 0.2} r="2.6" fill={LINE} fillOpacity="0.55" />
          <circle cx={x + r * 0.3} cy={y + r * 0.1} r="2.2" fill={LINE} fillOpacity="0.55" />
          <circle cx={x - r * 0.05} cy={y + r * 0.45} r="1.8" fill={LINE} fillOpacity="0.55" />
          <circle cx={x + r * 0.4} cy={y - r * 0.45} r="1.6" fill={LINE} fillOpacity="0.55" />
        </g>
      ))}
    </g>
  );
}

function Balde() {
  const body = 'M-150 0 L-126 262 Q0 286 126 262 L150 0 Z';
  return (
    <>
      <defs>
        <clipPath id="balde-interior">
          <path d={body} />
        </clipPath>
      </defs>
      <path d={body} fill={FILL} />
      {/* Agua del depósito: crece desde el fondo con scaleY (transform) */}
      <g clipPath="url(#balde-interior)">
        <rect data-nivel x="-160" y="40" width="320" height="250" fill={AGUA[3]} fillOpacity="0.28" />
      </g>
      <path data-cuerpo d={body} {...stroke} />
      {/* Aro superior y borde */}
      <ellipse cx="0" cy="0" rx="150" ry="24" fill="rgb(255 255 255 / 0.04)" {...stroke} />
      <ellipse cx="0" cy="0" rx="136" ry="18" {...stroke} strokeOpacity="0.35" />
      <path d="M-148 22 Q0 52 148 22" {...stroke} strokeOpacity="0.6" />
      {/* Etiqueta del balde (rectángulo en blanco, como en la imagen) */}
      <rect x="-84" y="84" width="168" height="112" rx="6" {...stroke} strokeOpacity="0.7" />
      {/* Asa */}
      <path d="M-152 34 Q-160 120 -120 150" {...stroke} />
      <path d="M152 34 Q160 120 120 150" {...stroke} />
    </>
  );
}

function Bomba() {
  return (
    <>
      {/* Pulso: indica que la bomba está activa */}
      <circle data-pulso cx="-10" cy="36" r="70" fill="none" stroke={AGUA[3]} strokeWidth="3" opacity="0" style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }} />
      <rect data-cuerpo x="-62" y="0" width="104" height="72" rx="10" fill="#1a1f1d" {...stroke} />
      <rect x="-54" y="10" width="44" height="52" rx="4" {...stroke} strokeOpacity="0.6" />
      {[18, 28, 38, 48].map((y) => (
        <path key={y} d={`M-50 ${y} H-14`} stroke={LINE} strokeOpacity="0.55" strokeWidth="1.6" />
      ))}
      {/* Boquilla */}
      <rect x="-22" y="-26" width="24" height="26" rx="3" fill="#1a1f1d" {...stroke} />
      <rect x="-26" y="-34" width="32" height="10" rx="3" {...stroke} />
      {/* Cable y enchufe */}
      <path d="M-62 52 C-140 60 -160 20 -230 34" {...stroke} />
      <rect x="-260" y="24" width="30" height="22" rx="4" {...stroke} />
      <path d="M-260 30 H-272 M-260 40 H-272" {...stroke} />
      {/* Salida hacia el riego */}
      <path data-salida d="M-10 -36 C-10 -90 40 -110 110 -96" fill="none" stroke={AGUA[3]} strokeWidth="5" strokeLinecap="round" strokeDasharray="14 16" opacity="0" />
    </>
  );
}

const CONTENT = { malla: <Malla />, grava: <Grava />, tezontle: <Tezontle /> };

export const FiltroSVG = forwardRef(function FiltroSVG({ onPieceEnter, onPieceLeave, onPieceTap, activeId }, ref) {
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      className="h-full w-full"
      role="img"
      aria-label="Filtro de agua por etapas: embudo de entrada, tres etapas de filtrado, balde y bomba"
    >
      {/* Etiquetas con línea guía (fijas en la posición de cada pieza separada) */}
      {PIEZAS.map((p, i) => {
        const y = p.separado + (p.kind === 'bomba' ? 36 : 6);
        const x0 = p.kind === 'balde' ? CX + 160 : p.kind === 'bomba' ? CX + 60 : CX + 130;
        return (
          <g key={p.id} id={`etiqueta-${p.id}`} data-etiqueta={i} opacity="0">
            <line data-guia x1={x0} y1={y} x2={LABEL_X - 16} y2={y} stroke={LINE} strokeOpacity="0.6" strokeWidth="2" strokeDasharray="4 6" style={{ transformBox: 'fill-box', transformOrigin: '0% 50%' }} />
            <circle cx={x0} cy={y} r="5" fill={AGUA[3]} />
            <text x={LABEL_X} y={y - 4} fill="#eef1ef" fontSize="34" fontWeight="700" fontFamily="Archivo Variable">
              {p.titulo}
            </text>
            <text x={LABEL_X} y={y + 34} fill="#a3aca9" fontSize="28" fontFamily="Archivo Variable">
              {p.sub}
            </text>
          </g>
        );
      })}

      {/* Piezas: se dibujan de abajo hacia arriba para que cada embudo tape el tubo del anterior */}
      {[...PIEZAS].reverse().map((p) => (
        <g
          key={p.id}
          id={`pieza-${p.id}`}
          data-pieza={p.id}
          transform={`translate(${CX} ${p.armado})`}
          onPointerEnter={(e) => onPieceEnter?.(p, e)}
          onPointerLeave={() => onPieceLeave?.(p)}
          onClick={(e) => onPieceTap?.(p, e)}
          style={{ cursor: 'pointer' }}
          opacity={activeId && activeId !== p.id ? 0.55 : 1}
        >
          {p.kind === 'balde' ? (
            <Balde />
          ) : p.kind === 'bomba' ? (
            <Bomba />
          ) : (
            <Embudo id={p.id} water={AGUA[Math.min(PIEZAS.indexOf(p), 3)]}>
              {CONTENT[p.kind]}
            </Embudo>
          )}
        </g>
      ))}

      {/* Gota que recorre las etapas */}
      <g id="gota" opacity="0">
        <path data-gota d="M0 -22 C10 -8 16 2 16 10 A16 16 0 0 1 -16 10 C-16 2 -10 -8 0 -22 Z" fill={AGUA[0]} />
      </g>
    </svg>
  );
});
