import { DeckProvider } from './deck/DeckProvider.jsx';
import { Deck } from './deck/Deck.jsx';
import { PresenterWindow } from './deck/PresenterWindow.jsx';

const isPresenterWindow = new URLSearchParams(window.location.search).has('notas');

export default function App() {
  if (isPresenterWindow) return <PresenterWindow />;
  return (
    <DeckProvider>
      <Deck />
    </DeckProvider>
  );
}
