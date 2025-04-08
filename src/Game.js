import { tileConnections } from './TileConnections';
import { INVALID_MOVE } from 'boardgame.io/core';

export const Tsuro = {
    setup: ({ ctx }) => ({
        board: Array(6).fill(null).map(() => Array(6).fill({ tile: null, rotation: 0 })),
        startingPositions: Array(2 * 6 * 4).fill(null),
        deck: Array.from({ length: 35 }, (_, i) => i).sort(() => Math.random() - 0.5),
        hands: Array(ctx.numPlayers).fill(null).map(() => Array()),
        selectedTile: { tile: null, rotation: 0 },
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
                selectTile: ({ G, playerID }, i) => {
                    G.selectedTile = { tile: G.hands[playerID][i], rotation: 0 }
                },
                rotateTile: ({ G }) => {
                    if (G.selectedTile.tile == null) {
                        return INVALID_MOVE;
                    }

                    G.selectedTile.rotation = (G.selectedTile.rotation + 1) % 4;
                },
                placeTile: ({ G, events, playerID }, x, y) => {
                    if (G.selectedTile.tile == null) {
                        return INVALID_MOVE;
                    }

                    G.board[x][y] = G.selectedTile;
                    G.hands[playerID].splice(G.hands[playerID].indexOf(G.selectedTile.tile), 1);
                    G.selectedTile = { tile: null, rotation: 0 }                 
                    G.hands[playerID].push(G.deck.pop());
                    events.endTurn();
                },
            }
        }
    },
};