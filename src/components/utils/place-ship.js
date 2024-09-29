import { surroundingCell } from './sourrounding-cell'; // Importa surroundingCell dal suo file

export function placeShip(grid, ship, rows, cols) {
    let set = false;

    while (!set) {
        const direction = Math.floor(Math.random() * 2);
        let startRow, startCol;

        if (direction === 0) {
            // Direzione orizzontale
            startRow = Math.floor(Math.random() * rows);
            startCol = Math.floor(Math.random() * (cols - ship.length + 1));
            let emptySpace = true;

            // Verifica che lo spazio sia libero
            for (let i = 0; i < ship.length; i++) {
                if (grid[startRow][startCol + i].isShip) {
                    emptySpace = false;
                    break;
                }
            }

            // Se lo spazio è libero e la funzione surroundingCell restituisce true
            if (emptySpace && surroundingCell(grid, startRow, startCol, ship.length, direction, rows, cols)) {
                // Posiziona la nave orizzontalmente
                for (let i = 0; i < ship.length; i++) {
                    if ((grid[startRow] && grid[startRow][startCol + i])) {
                        grid[startRow][startCol + i].isShip = true;  // Imposta la cella come parte della nave
                        grid[startRow][startCol + i].id = ship.id;  // Assegna l'id della nave alla cella
                    }
                }
                set = true;  // La nave è stata posizionata, esci dal ciclo
            }

        } else {
            // Direzione verticale
            startRow = Math.floor(Math.random() * (rows - ship.length + 1));
            startCol = Math.floor(Math.random() * cols);
            let emptySpace = true;

            // Verifica che lo spazio sia libero
            for (let i = 0; i < ship.length; i++) {
                if (grid[startRow + i][startCol].isShip) {
                    emptySpace = false;
                    break;
                }
            }

            // Se lo spazio è libero e la funzione surroundingCell restituisce true
            if (emptySpace && surroundingCell(grid, startRow, startCol, ship.length, direction, rows, cols)) {
                // Posiziona la nave verticalmente
                for (let i = 0; i < ship.length; i++) {
                    if ((grid[startRow + i] && grid[startRow + i][startCol])) {
                        grid[startRow + i][startCol].isShip = true;  // Imposta la cella come parte della nave
                        grid[startRow + i][startCol].id = ship.id;  // Assegna l'id della nave alla cella
                    }
                }
                set = true;  // La nave è stata posizionata, esci dal ciclo
            }
        }
    }
}
