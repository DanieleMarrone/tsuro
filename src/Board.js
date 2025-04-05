export const Board = ({ G, ctx, moves }) => {
    const boardImage = 'board.png';
    const boardWidth = 804;
    const boardHeight = 805;
    const boardSize = 6;
    const tilesImage = 'tiles.png';
    const tileSize = 118;

    return (
        <div style={{ position: 'relative', width: `${boardWidth}px`, height: `${boardHeight}px` }}>
            <img src={boardImage} style={{ width: '100%', height: '100%' }} />
            {
                G.board.map((row, x) =>
                    row.map((tile, y) => (
                        (tile == null) ? (
                            <div
                                key={`${x}-${y}`}
                                onClick={() => moves.placeTile(x, y)}
                                style={{
                                    position: 'absolute',
                                    top: 48 + y * tileSize,
                                    left: 48 + x * tileSize,
                                    width: tileSize,
                                    height: tileSize,
                                }}
                            >
                            </div>
                        ) : (
                            <div
                                key={`${x}-${y}`}
                                style={{
                                    position: 'absolute',
                                    top: 48 + y * tileSize,
                                    left: 48 + x * tileSize,
                                    width: tileSize,
                                    height: tileSize,
                                    backgroundImage: `url(${tilesImage})`,
                                    backgroundPosition: `${-(48 + Math.floor(tile / boardSize) * tileSize)}px ${-(48 + (tile % boardSize) * tileSize)}px`
                                }}
                            >
                            </div>
                        )
                    ))
                )
            }

        </div>
    );
}; 