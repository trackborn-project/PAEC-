import { useMemo } from 'react';
import { motion } from 'motion/react';

// Tierra que se agrieta: grietas generadas con una semilla fija (siempre iguales)
// que se dibujan desde su origen al aparecer la sección.
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildCracks(W, H) {
  const rand = rng(40);
  const cracks = [];
  const walk = (x, y, angle, len, width, depth, delay) => {
    const pts = [[x, y]];
    const segs = Math.round(len / 18);
    for (let i = 0; i < segs; i++) {
      angle += (rand() - 0.5) * 0.9;
      x += Math.cos(angle) * 18;
      y += Math.sin(angle) * 18;
      pts.push([x, y]);
      if (depth < 2 && i > 2 && rand() < 0.12) {
        walk(x, y, angle + (rand() < 0.5 ? -1 : 1) * (0.7 + rand() * 0.6), len * 0.45, width * 0.55, depth + 1, delay + (i / segs) * 0.9);
      }
      if (x < -20 || y < -20 || x > W + 20 || y > H + 20) break;
    }
    cracks.push({ d: 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L'), width, delay });
  };
  const origins = [
    [0.32, 0.38],
    [0.68, 0.3],
    [0.5, 0.7],
    [0.18, 0.78],
    [0.84, 0.72],
  ];
  origins.forEach(([ox, oy], k) => {
    const n = 3 + Math.floor(rand() * 2);
    for (let j = 0; j < n; j++) {
      walk(ox * W, oy * H, (j / n) * Math.PI * 2 + rand() * 0.8, 160 + rand() * 180, 5 - j * 0.6, 0, 0.25 + k * 0.18);
    }
  });
  return cracks;
}

// Textura de tierra en una capa propia: así no se vuelve a calcular mientras se dibujan las grietas.
const TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='t'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.2 0 0 0 0 0.12 0 0 0 0 0.05 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23t)'/%3E%3C/svg%3E\")";

export function CrackedSoil({ className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Soil className="absolute inset-0 h-full w-full" />
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: TEXTURE, willChange: 'transform' }} />
    </div>
  );
}

function Soil({ className }) {
  const W = 800;
  const H = 640;
  const cracks = useMemo(() => buildCracks(W, H), []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustración de tierra seca que se agrieta">
      <defs>
        <radialGradient id="soil" cx="50%" cy="45%" r="75%">
          <stop offset="0%" stopColor="#a8703f" />
          <stop offset="60%" stopColor="#7a4d2a" />
          <stop offset="100%" stopColor="#3d2614" />
        </radialGradient>
        <radialGradient id="dry" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#e2b277" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e2b277" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="url(#soil)" />
      {/* La tierra se aclara al secarse */}
      <motion.rect
        width={W}
        height={H}
        fill="url(#dry)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
      />
      {cracks.map((c, i) => (
        <g key={i}>
          <motion.path
            d={c.d}
            fill="none"
            stroke="#1c0f06"
            strokeWidth={c.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, delay: c.delay, ease: [0.23, 1, 0.32, 1] }}
          />
          {/* Borde claro de la grieta: da relieve */}
          <motion.path
            d={c.d}
            fill="none"
            stroke="#e6b57a"
            strokeOpacity="0.35"
            strokeWidth={Math.max(1, c.width * 0.3)}
            strokeLinecap="round"
            transform="translate(1.5 1.5)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, delay: c.delay + 0.05, ease: [0.23, 1, 0.32, 1] }}
          />
        </g>
      ))}
    </svg>
  );
}
