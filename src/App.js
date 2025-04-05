import { Client } from 'boardgame.io/react';
import { Tsuro } from './Game';
import { Board } from './Board';

const App = Client({
  game: Tsuro,
  board: Board,
});

export default App;