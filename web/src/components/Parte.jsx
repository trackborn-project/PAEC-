import { useDeck } from '../deck/DeckProvider.jsx';

// Parte de la rúbrica a la que pertenece la sección actual (campo `parte` en content/sections.js).
// Mismo estilo que el antetítulo de la portada.
export function Parte({ className = '' }) {
  const { section } = useDeck();
  if (!section?.parte) return null;
  return <p className={`text-[clamp(16px,1.25vw,22px)] font-medium text-ambar ${className}`}>{section.parte}</p>;
}
