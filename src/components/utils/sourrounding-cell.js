export function surroundingCell(grid, startRow, startCol, length, direction, rows, cols) {
    let beginningRow, endRow, beginningCol, endCol;

    if (direction === 0) { // Orizzontale
        beginningRow = Math.max(startRow - 1, 0); // Riga superiore (se esiste)
        endRow = Math.min(startRow + 1, rows - 1); // Riga inferiore (se esiste)
        beginningCol = Math.max(startCol - 1, 0); // Colonna a sinistra della nave
        endCol = Math.min(startCol + length, cols - 1); // Colonna a destra della nave

    } else { // Verticale
        beginningRow = Math.max(startRow - 1, 0); // Riga superiore (se esiste)
        endRow = Math.min(startRow + length, rows - 1); // Riga inferiore (se esiste)
        beginningCol = Math.max(startCol - 1, 0); // Colonna a sinistra della nave
        endCol = Math.min(startCol + 1, cols - 1); // Colonna a destra della nave
    }

    // Controlla le celle intorno alla nave
    for (let i = beginningRow; i <= endRow; i++) {
        for (let j = beginningCol; j <= endCol; j++) {
            if (grid[i][j].isShip) {
                return false; // Se c'è una nave adiacente, non possiamo piazzarla qui
            }
        }
    }

    return true;
}
