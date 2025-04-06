import { tileConnections } from './TileConnections';

export const Tsuro = {
    setup: ({ ctx }) => ({
        board: Array(6).fill(null).map(() => Array(6).fill(null)),
        startingPositions: Array(2 * 6 * 4).fill(null),
        deck: Array.from({ length: 35 }, (_, i) => i).sort(() => Math.random() - 0.5),
        hands: Array(ctx.numPlayers).fill(null).map(() => Array()),
    }),

    phases: {
        positioning: {
            moves: {
                placeMarker: ({ G, playerID }, i) => {
                    G.startingPositions[i] = playerID;
                },
            },
            turn: {
                minMoves: 1,
                maxMoves: 1,
            },
            endIf: ({ G, ctx }) => G.startingPositions.filter(i => i !== null).length === ctx.numPlayers,
            start: true,
            next: 'play',
        },

        play: {
            onBegin: ({ G, ctx }) => {
                for (let i = 0; i < ctx.numPlayers; i++) {
                    G.hands[i].push(G.deck.pop()); 
                    G.hands[i].push(G.deck.pop()); 
                    G.hands[i].push(G.deck.pop()); 
                }
            },
            moves: {
                placeTile: ({ G, playerID }, x, y) => {
                    G.board[x][y] = G.hands[playerID].pop();
                },
            },
            turn: {
                minMoves: 1,
                maxMoves: 1,
            },
        },
    }
};