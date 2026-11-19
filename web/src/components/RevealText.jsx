import { motion } from 'motion/react';

// Revela un texto letra por letra (by="char") o palabra por palabra (by="word").
// Las palabras no se parten entre líneas. El texto completo queda en aria-label.
export function RevealText({ text, as = 'h1', by = 'char', delay = 0, stagger, className = '', style }) {
  const Tag = motion[as];
  const gap = stagger ?? (by === 'char' ? 0.028 : 0.07);
  const words = text.split(' ');
  let i = 0;

  const unit = {
    hidden: { opacity: 0, y: '0.35em' },
    show: (n) => ({
      opacity: 1,
      y: 0,
      transition: { type: 'spring', duration: 0.7, bounce: 0, delay: delay + n * gap },
    }),
  };

  return (
    <Tag className={className} style={style} aria-label={text} initial="hidden" animate="show">
      {words.map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap" aria-hidden>
          {by === 'char'
            ? [...word].map((ch, c) => (
                <motion.span key={c} className="inline-block" variants={unit} custom={i++}>
                  {ch}
                </motion.span>
              ))
            : (
                <motion.span className="inline-block" variants={unit} custom={i++}>
                  {word}
                </motion.span>
              )}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
