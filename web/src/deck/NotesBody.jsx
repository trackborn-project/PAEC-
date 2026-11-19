import { useEffect, useState } from 'react';
import { sections } from '../content/sections.js';

const pad = (n) => String(n).padStart(2, '0');

export function Elapsed({ since }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.max(0, Math.floor((now - since) / 1000));
  return (
    <span className="tabular-nums" title="Tiempo transcurrido">
      {pad(Math.floor(s / 3600))}:{pad(Math.floor((s % 3600) / 60))}:{pad(s % 60)}
    </span>
  );
}

// Texto que dice el presentador en la sección actual, más un adelanto de la siguiente.
export function NotesBody({ index }) {
  const section = sections[index];
  const following = sections[index + 1];
  const notes = section.notes ?? [`[FALTA: notas de esta sección; se redactan en la Fase ${section.phase}]`];

  return (
    <div className="flex flex-col gap-5">
      <p className="text-[18px] text-niebla">
        Sección {index + 1} de {sections.length}
      </p>
      <h2 className="text-[30px] font-semibold leading-tight">{section.title}</h2>
      <div className="flex flex-col gap-4 text-[22px] leading-relaxed text-hueso/95">
        {notes.map((p, i) => (
          <p key={i} className={p.startsWith('(') ? 'italic text-niebla' : undefined}>
            {p}
          </p>
        ))}
      </div>
      {following && (
        <p className="mt-2 border-t border-white/10 pt-4 text-[18px] text-niebla">
          Después: {index + 2}. {following.title}
        </p>
      )}
    </div>
  );
}
