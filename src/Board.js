import { useState, useEffect } from 'react';

export const Board = ({ G, ctx, moves, playerID }) => {
    const boardImage = 'board.png';
    const boardWidth = 804;
    const boardHeight = 805;
    const boardSize = 6;
    const tilesImage = 'tiles.png';
    const tileSize = 118;

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        setMousePosition({ x: e.pageX, y: e.pageY });
    };

    const handlePLaceMarker = (i) => {
        moves.placeMarker(i);
    };

    const handleTileSelect = (i) => {
        moves.selectTile(i);
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        moves.rotateTile();;
    };

    const handlePlaceTile = (x, y) => {
        moves.placeTile(x, y);
    }

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('contextmenu', handleRightClick);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('contextmenu', handleRightClick);
        };
    }, []);

    return (
        <div>
            <div style={{ position: 'relative', width: `${boardWidth}px`, height: `${boardHeight}px` }}>
                <img src={boardImage} style={{ width: '100%', height: '100%' }} />
                {ctx.phase === 'positioning' ? (
                    G.startingPositions.map((_, i) => {
                        if (G.startingPositions[i] !== null)
                            return null;

                        let top = 0;
                        let left = 0;

                        if (i < 12) {
                            top = 12;
                            left = 47 + ((i % 2) ? 65 : 26) + tileSize * Math.floor(i / 2);
                        } else if (i < 24) {
                            top = 47 + ((i % 2) ? 65 : 26) + tileSize * Math.floor((i - 12) / 2);
                            left = 765;
                        } else if (i < 36) {
                            top = 765;
                            left = 47 + ((i % 2) ? 26 : 65) + tileSize * Math.floor((35 - i) / 2);
                        } else {
                            top = 47 + ((i % 2) ? 26 : 65) + tileSize * Math.floor((47 - i) / 2);
                            left = 12;
                        }

                        return (
                            <div
                                key={i}
                                onClick={() => handlePLaceMarker(i)}
                                style={{
                                    position: 'absolute',
                                    color: 'white',
                                    top: `${top}px`,
                                    left: `${left}px`,
                                    width: 25,
                                    height: 25,
                                    cursor: 'pointer',
                                }}
                            >
                                {i}
                            </div>
                        );
                    })
                ) : (
                    G.board.map((row, x) =>
                        row.map((cell, y) => (
                            (cell.tile == null) ? (
                                <div
                                    key={`${x}-${y}`}
                                    onClick={() => handlePlaceTile(x, y)}
                                    style={{
                                        position: 'absolute',
                                        color: 'white',
                                        top: 48 + y * tileSize,
                                        left: 48 + x * tileSize,
                                        width: tileSize,
                                        height: tileSize,
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                    }}
                                >
                                    ({x}, {y})
                                </div>
                            ) : (
                                <div
                                    key={`${x}-${y}`}
                                    style={{
                                        position: 'absolute',
                                        color: 'white',
                                        top: 48 + y * tileSize,
                                        left: 48 + x * tileSize,
                                        width: tileSize,
                                        height: tileSize,
                                        backgroundImage: `url(${tilesImage})`,
                                        backgroundPosition: `${-(48 + (cell.tile % boardSize) * tileSize)}px ${-(48 + Math.floor(cell.tile / boardSize) * tileSize)}px`,
                                        transform: `rotate(${cell.rotation * 90}deg)`,                                        
                                    }}
                                >
                                    {cell.tile}
                                </div>
                            )
                        ))
                    )
                )}
            </div>
            <div style={{ position: 'relative', width: `100%`, height: `200px` }}>
                {
                    G.hands[playerID].map((tile, i) => (
                        (tile != null) && (
                            <div
                                key={`${i}`}
                                onClick={() => handleTileSelect(i)}
                                style={{
                                    position: 'absolute',
                                    color: 'white',
                                    top: 48,
                                    left: 48 + i * tileSize,
                                    width: tileSize,
                                    height: tileSize,
                                    cursor: 'pointer',
                                    backgroundImage: `url(${tilesImage})`,
                                    backgroundPosition: `${-(48 + (tile % boardSize) * tileSize)}px ${-(48 + Math.floor(tile / boardSize) * tileSize)}px`,
                                }}
                            >
                                {tile}
                            </div>
                        )
                    ))
                }
            </div>
            {
                (G.selectedTile.tile != null) && (
                    <div
                        style={{
                            position: 'absolute',
                            color: 'white',
                            top: mousePosition.y - tileSize / 2,
                            left: mousePosition.x - tileSize / 2,
                            width: tileSize,
                            height: tileSize,
                            backgroundImage: `url(${tilesImage})`,
                            backgroundPosition: `${-(48 + (G.selectedTile.tile % boardSize) * tileSize)}px ${-(48 + Math.floor(G.selectedTile.tile / boardSize) * tileSize)}px`,
                            transform: `rotate(${G.selectedTile.rotation * 90}deg)`,
                            pointerEvents: 'none',
                        }}
                    >
                        {G.selectedTile.tile}
                    </div>
                )
            }

        </div>
    )
};