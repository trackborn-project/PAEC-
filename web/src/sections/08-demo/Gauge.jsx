import { motion } from 'motion/react';
import { useReduce } from '../../deck/MotionPref.jsx';

// Medidor semicircular. value 0–100 (escala relativa, sin unidades). La aguja solo rota (transform).
const R = 150;
const CX = 200;
const CY = 190;

const polar = (deg, r = R) => {
  const a = ((deg - 180) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};

export function Gauge({ value, threshold, dry }) {
  const reduce = useReduce();
  const [tx1, ty1] = polar((threshold / 100) * 180, R - 26);
  const [tx2, ty2] = polar((threshold / 100) * 180, R + 26);
  const [lx, ly] = polar((threshold / 100) * 180, R + 50);

  return (
    <svg viewBox="0 0 400 230" className="mx-auto h-[min(25vh,240px)] w-auto" role="img" aria-label={dry ? 'Medidor: tierra seca' : 'Medidor: humedad suficiente'}>
      <defs>
        <linearGradient id="gauge-g" x1="0" x2="1">
          <stop offset="0" stopColor="#c4ccc9" />
          <stop offset="0.5" stopColor="#7d8784" />
          <stop offset="1" stopColor="#39ff88" />
        </linearGradient>
      </defs>
      <path d={`M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="30" strokeLinecap="round" />
      <path d={`M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}`} fill="none" stroke="url(#gauge-g)" strokeWidth="30" strokeLinecap="round" opacity="0.9" />
      {/* Umbral ilustrativo */}
      <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#eef1ef" strokeWidth="4" strokeLinecap="round" />
      <text x={lx} y={ly} textAnchor="middle" fill="#eef1ef" fontSize="18" fontFamily="Archivo Variable">umbral</text>
      <text x={CX - R} y={CY + 34} textAnchor="middle" fill="#a3aca9" fontSize="20" fontFamily="Archivo Variable">Seco</text>
      <text x={CX + R} y={CY + 34} textAnchor="middle" fill="#a3aca9" fontSize="20" fontFamily="Archivo Variable">Húmedo</text>

      <motion.g
        style={{ originX: 0.5, originY: 1 }}
        animate={{ rotate: (value / 100) * 180 - 90 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 18 }}
      >
        <path d={`M${CX - 7} ${CY} L${CX} ${CY - R + 22} L${CX + 7} ${CY} Z`} fill={dry ? '#ff5d5d' : '#eef1ef'} />
      </motion.g>
      <circle cx={CX} cy={CY} r="14" fill="#0f1211" stroke="#eef1ef" strokeWidth="3" />
    </svg>
  );
}
