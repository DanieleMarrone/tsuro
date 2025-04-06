import { useState, useEffect } from 'react';

export const Board = ({ G, ctx, moves, playerID }) => {
    const boardImage = 'board.png';
    const boardWidth = 804;
    const boardHeight = 805;
    const boardSize = 6;
    const tilesImage = 'tiles.png';
    const tileSize = 118;

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [selectedTile, setSelectedTile] = useState(null);
    const [rotation, setRotation] = useState(0);

    const handleMouseMove = (e) => {
        setMousePosition({ x: e.pageX, y: e.pageY });
    };

    const handleTileSelect = (tile, i) => {
        setSelectedTile(tile);
        setRotation(0);
        moves.selectTile(i);
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        setRotation((prevRotation) => (prevRotation + 90) % 360);
    };

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
                                onClick={() => moves.placeMarker(i)}
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
                                    onClick={() => { moves.placeTile(x, y, rotation); setSelectedTile(null);}}
                                    style={{
                                        position: 'absolute',
                                        top: 48 + y * tileSize,
                                        left: 48 + x * tileSize,
                                        width: tileSize,
                                        height: tileSize,
                                        cursor: 'pointer',
                                    }}
                                >
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
                                        transform: `rotate(${cell.rotation}deg)`,                                        
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
                                onClick={() => (ctx.currentPlayer == playerID) && handleTileSelect(tile, i)}
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
                                    //transition: 'transform 0.2s ease-in-out',
                                }}
                            // onMouseOver={(e) => {
                            //     e.currentTarget.style.transform = 'scale(1.2)'; // Ingrandisce il div
                            // }}
                            // onMouseOut={(e) => {
                            //     e.currentTarget.style.transform = 'scale(1)'; // Ripristina la dimensione originale
                            // }}                                
                            >
                                {tile}
                            </div>
                        )
                    ))
                }
            </div>
            {
                (selectedTile != null) && (
                    <div
                        style={{
                            position: 'absolute',
                            top: mousePosition.y - tileSize / 2,
                            left: mousePosition.x - tileSize / 2,
                            width: tileSize,
                            height: tileSize,
                            backgroundImage: `url(${tilesImage})`,
                            backgroundPosition: `${-(48 + (selectedTile % boardSize) * tileSize)}px ${-(48 + Math.floor(selectedTile / boardSize) * tileSize)}px`,
                            transform: `rotate(${rotation}deg)`,
                            pointerEvents: 'none',
                        }}
                    ></div>
                )
            }

        </div>
    )
};