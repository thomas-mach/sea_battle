export function placeShip(grid, ship, rows, cols, surroundingCell) {
    let set = false

    while (!set) {
        const direction = Math.floor(Math.random() * 2)
        let startRow, startCol

        if (direction === 0) {
            // Direzione orizzontale
            startRow = Math.floor(Math.random() * rows)
            startCol = Math.floor(Math.random() * (cols - ship.length + 1))
            let emptySpace = true

            // Verifica che lo spazio sia libero
            for (let i = 0; i < ship.length; i++) {
                if (grid[startRow][startCol + i].isShip) {
                    emptySpace = false
                    break
                }
            }

            if (emptySpace && surroundingCell(startRow, startCol, ship.length, direction)) {
                // Posiziona la nave orizzontalmente
                for (let i = 0; i < ship.length; i++) {
                    if ((grid[startRow] && grid[startRow][startCol + i])) {
                        grid[startRow][startCol + i].isShip = true
                        grid[startRow][startCol + i].id = ship.id
                    }
                }
                set = true
            }

        } else {
            // Direzione verticale
            startRow = Math.floor(Math.random() * (rows - ship.length + 1))
            startCol = Math.floor(Math.random() * cols)
            let emptySpace = true

            // Verifica che lo spazio sia libero
            for (let i = 0; i < ship.length; i++) {
                if (grid[startRow + i][startCol].isShip) {
                    emptySpace = false
                    break
                }
            }

            if (emptySpace && surroundingCell(startRow, startCol, ship.length, direction)) {
                // Posiziona la nave verticalmente
                for (let i = 0; i < ship.length; i++) {
                    if ((grid[startRow + i] && grid[startRow + i][startCol])) {
                        grid[startRow + i][startCol].isShip = true
                        grid[startRow + i][startCol].id = ship.id
                    }
                }
                set = true
            }
        }
    }
}
