import { tileConnections } from './TileConnections';
import { INVALID_MOVE } from 'boardgame.io/core';

export const Tsuro = {
    setup: ({ ctx }) => ({
        board: Array(6).fill(null).map(() => Array(6).fill({ tile: null, rotation: 0 })),
        deck: Array.from({ length: 35 }, (_, i) => i).sort(() => Math.random() - 0.5),
        startingPositions: Array(2 * 6 * 4).fill(null),
        playerPositions: Array(ctx.numPlayers).fill({ x: null, y: null, in: null }),
        hands: Array(ctx.numPlayers).fill(null).map(() => Array()),
        selectedTile: { tile: null, rotation: 0 },
    }),

    phases: {
        positioning: {
            moves: {
                placeMarker: ({ G, playerID }, i) => {
                    G.startingPositions[i] = playerID;

                    if (i < 12) {
                        G.playerPositions[playerID] = { x: Math.floor(i / 2), y: 0, in: i % 2 };
                    }
                    else if (i < 24) {
                        G.playerPositions[playerID] = { x: 5, y: Math.floor((i - 12) / 2), in: i % 2 + 2 };
                    } else if (i < 36) {
                        G.playerPositions[playerID] = { x: Math.floor((35 - i) / 2), y: 5, in: i % 2 + 4 };
                    } else {
                        G.playerPositions[playerID] = { x: 0, y: Math.floor((47 - i) / 2), in: i % 2 + 6 };
                    }
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

                    if (G.playerPositions[playerID].x !== x ||
                        G.playerPositions[playerID].y !== y) {
                        return INVALID_MOVE;
                    }

                    G.board[x][y] = G.selectedTile;
                    G.hands[playerID].splice(G.hands[playerID].indexOf(G.selectedTile.tile), 1);
                    G.selectedTile = { tile: null, rotation: 0 }
                    G.hands[playerID].push(G.deck.pop());

                    const out = tileConnections[G.board[x][y].tile][G.playerPositions[playerID].in];
                    switch (out) {
                        case 0:
                            G.playerPositions[playerID].x = x;
                            G.playerPositions[playerID].y = y - 1;
                            G.playerPositions[playerID].in = 5;
                            break;
                        case 1:
                            G.playerPositions[playerID].x = x;
                            G.playerPositions[playerID].y = y;
                            G.playerPositions[playerID].in = 4;
                            break;
                        case 2:
                            G.playerPositions[playerID].x = x + 1;
                            G.playerPositions[playerID].y = y;
                            G.playerPositions[playerID].in = 7;
                            break;
                        case 3:
                            G.playerPositions[playerID].x = x + 1;
                            G.playerPositions[playerID].y = y;
                            G.playerPositions[playerID].in = 6;
                            break;
                        case 4:
                            G.playerPositions[playerID].x = x;
                            G.playerPositions[playerID].y = y + 1;
                            G.playerPositions[playerID].in = 1;
                            break;
                        case 5:
                            G.playerPositions[playerID].x = x;
                            G.playerPositions[playerID].y = y + 1;
                            G.playerPositions[playerID].in = 0;
                            break;
                        case 6:
                            G.playerPositions[playerID].x = x - 1;
                            G.playerPositions[playerID].y = y;
                            G.playerPositions[playerID].in = 3;
                            break;
                        case 7:
                            G.playerPositions[playerID].x = x - 1;
                            G.playerPositions[playerID].y = y;
                            G.playerPositions[playerID].in = 2;
                            break;
                    }

                    events.endTurn();
                },
            }
        }
    },
};