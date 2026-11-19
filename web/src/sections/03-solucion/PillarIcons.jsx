// Iconos de los pilares. Las animaciones (CSS, solo transform/opacity) corren
// únicamente cuando la tarjeta está activa (.is-active), así explican sin distraer.
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function SensorIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect x="20" y="6" width="24" height="16" rx="3" {...base} />
      <path d="M27 22v30l-2 6M37 22v30l2 6" {...base} />
      {[0, 0.6, 1.2].map((d) => (
        <ellipse
          key={d}
          cx="32"
          cy="54"
          rx="16"
          ry="5"
          {...base}
          strokeWidth="2"
          className="icon-anim"
          style={{ transformOrigin: '32px 54px', animation: `wave 1.8s ${d}s var(--ease-out) infinite` }}
        />
      ))}
    </svg>
  );
}

export function ChipIcon() {
  const pins = [18, 26, 34, 42];
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect x="14" y="14" width="36" height="36" rx="5" {...base} />
      <rect x="23" y="23" width="18" height="18" rx="2" {...base} />
      {pins.map((p, i) => (
        <g key={p} className="icon-anim" style={{ animation: `blink 1.2s ${i * 0.15}s ease-in-out infinite` }}>
          <path d={`M${p + 2} 14V7M${p + 2} 50v7M14 ${p + 2}H7M50 ${p + 2}h7`} {...base} />
        </g>
      ))}
    </svg>
  );
}

export function PumpIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <circle cx="28" cy="34" r="18" {...base} />
      <path d="M46 26h12M46 26v-8" {...base} />
      <g className="icon-anim" style={{ transformOrigin: '28px 34px', animation: 'spin 1.1s linear infinite' }}>
        <path d="M28 34l0-11M28 34l10 6M28 34l-10 6" {...base} />
      </g>
      <circle cx="28" cy="34" r="3" fill="currentColor" />
    </svg>
  );
}

export function FilterIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <path d="M10 10h44L38 32v18l-12 6V32z" {...base} />
      {[0, 0.5, 1].map((d, i) => (
        <circle
          key={d}
          cx={26 + i * 6}
          cy="16"
          r="2.6"
          fill="currentColor"
          className="icon-anim"
          style={{ animation: `drop 1.5s ${d}s var(--ease-in-out) infinite` }}
        />
      ))}
    </svg>
  );
}

export function ScreenIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <rect x="8" y="12" width="48" height="34" rx="5" {...base} />
      <path d="M24 54h16M32 46v8" {...base} />
      {[0, 0.3, 0.6].map((d, i) => (
        <rect
          key={d}
          x="16"
          y={20 + i * 8}
          width="32"
          height="3.5"
          rx="1.75"
          fill="currentColor"
          className="icon-anim"
          style={{ transformOrigin: 'left center', transformBox: 'fill-box', animation: `bar 1.6s ${d}s var(--ease-in-out) infinite` }}
        />
      ))}
    </svg>
  );
}
