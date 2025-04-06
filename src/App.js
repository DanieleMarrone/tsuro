import { Client } from 'boardgame.io/react';
import { Tsuro } from './Game';
import { Board } from './Board';
import { Local } from 'boardgame.io/multiplayer';

const TsuroClient = Client({
  game: Tsuro,
  board: Board,
  multiplayer: Local(),
});

const App = () => (
  <div>
    <TsuroClient playerID="0" />
    <TsuroClient playerID="1" />
  </div>
);

export default App;