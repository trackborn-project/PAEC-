import { useEffect } from 'react';
import { useReduce } from './MotionPref.jsx';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

// Tres orbes de luz. Cada uno tiene una capa ámbar (sequía) y otra cian/verde (agua);
// el ánimo de la sección decide cuál se ve, cambiando solo la opacidad.
const ORBS = [
  { size: '62vmax', top: '-22vmax', left: '-14vmax', depth: 60, dry: '#f2a33a', wet: '#3fd6e0', strength: 0.34 },
  { size: '54vmax', top: '38vh', left: '58vw', depth: -90, dry: '#c98b4e', wet: '#2aa7c0', strength: 0.3 },
  { size: '40vmax', top: '62vh', left: '-6vw', depth: 120, dry: '#e07a2e', wet: '#8fd694', strength: 0.22 },
];

function Orb({ orb, px, py, mood }) {
  const reduce = useReduce();
  const x = useSpring(useTransform(px, (v) => (reduce ? 0 : v * orb.depth)), { stiffness: 40, damping: 20 });
  const y = useSpring(useTransform(py, (v) => (reduce ? 0 : v * orb.depth)), { stiffness: 40, damping: 20 });
  const layer = (color) => `radial-gradient(circle at center, ${color} 0%, transparent 62%)`;
  const fade = { duration: 1.4, ease: [0.77, 0, 0.175, 1] };

  return (
    <motion.div
      className="absolute rounded-full"
      style={{ width: orb.size, height: orb.size, top: orb.top, left: orb.left, x, y, opacity: orb.strength }}
    >
      <motion.div className="absolute inset-0" style={{ background: layer(orb.dry) }} animate={{ opacity: 1 - mood }} transition={fade} />
      <motion.div className="absolute inset-0" style={{ background: layer(orb.wet) }} animate={{ opacity: mood }} transition={fade} />
    </motion.div>
  );
}

export function OrbBackground({ mood }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  useEffect(() => {
    const onMove = (e) => {
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [px, py]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {ORBS.map((orb, i) => (
        <Orb key={i} orb={orb} px={px} py={py} mood={mood} />
      ))}
      {/* Viñeta para mantener contraste en los bordes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(5_14_17/0.7)_100%)]" />
    </div>
  );
}
