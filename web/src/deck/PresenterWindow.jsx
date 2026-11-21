import { useEffect, useRef, useState } from 'react';
import { CHANNEL } from './DeckProvider.jsx';
import { Elapsed, NotesBody } from './NotesBody.jsx';

// Ventana aparte para la pantalla del presentador (?notas). Se sincroniza con la
// presentación mediante BroadcastChannel y también puede avanzar o retroceder.
export function PresenterWindow() {
  const [index, setIndex] = useState(0);
  const [since, setSince] = useState(Date.now());
  const channelRef = useRef(null);
  const send = (cmd) => channelRef.current?.postMessage({ type: 'cmd', cmd });

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL);
    channelRef.current = channel;
    channel.onmessage = ({ data }) => data?.type === 'state' && setIndex(data.index);
    channel.postMessage({ type: 'hello' });

    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') channel.postMessage({ type: 'cmd', cmd: 'next' });
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') channel.postMessage({ type: 'cmd', cmd: 'prev' });
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      channel.close();
      channelRef.current = null;
    };
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-[#0b0e0d] p-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="flex items-center justify-between text-[20px] text-niebla">
          <span>
            Tiempo: <Elapsed since={since} />
          </span>
          <div className="flex gap-2">
            <button onClick={() => setSince(Date.now())} className="pressable rounded-full border border-white/15 px-4 py-2 hover:bg-white/10">
              Reiniciar tiempo
            </button>
            <button onClick={() => send('prev')} className="pressable rounded-full border border-white/15 px-4 py-2 hover:bg-white/10">
              Anterior
            </button>
            <button onClick={() => send('next')} className="pressable rounded-full border border-white/15 bg-white/10 px-4 py-2 hover:bg-white/15">
              Siguiente
            </button>
          </div>
        </div>
        <NotesBody index={index} />
      </div>
    </div>
  );
}
