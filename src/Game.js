export const Tsuro = {
    setup: ({ ctx }) => ({
        board: Array(6).fill(null).map(() => Array(6).fill(null)),
        startingPositions: Array(2*6*4).fill(null),
        deck: Array.from({ length: 35 }, (_, i) => i).sort(() => Math.random() - 0.5),
        hand: Array(ctx.numPlayers).fill(null).map(() => Array(3).fill(null)),
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
            endIf: ({ G, ctx }) => G.startingPositions.filter( i => i !== null).length === ctx.numPlayers,
            start: true,                
            next: 'play',
        },

        play: {
            moves: {
                placeTile: ({ G }, x, y) => {
                    G.board[x][y] = G.deck.pop();
                },
            },
        },
    }
};