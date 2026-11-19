// Variantes compartidas para entradas escalonadas dentro de cada sección.
export const container = (delayChildren = 0.12, staggerChildren = 0.07) => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

export const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', duration: 0.6, bounce: 0 } },
};
