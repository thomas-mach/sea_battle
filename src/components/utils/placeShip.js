export function placeShip(grid, ship, rows, cols, surroundingCell) {
    let set = false

    while (!set) {
        const direction = Math.floor(Math.random() * 2)
        let startRow, startCol
        if (direction === 0) {
            startRow = Math.floor(Math.random() * rows)
            startCol = Math.floor(Math.random() * (cols - ship.length + 1))
            let emptySpace = true

            for (let i = 0; i < ship.length; i++) {
                if (grid[startRow][startCol + i].isShip) {
                    emptySpace = false
                    break
                }
            }
            if (emptySpace && surroundingCell(startRow, startCol, ship.length, direction)) {
                for (let i = 0; i < ship.length; i++) {
                    grid[startRow][startCol + i].isShip = true
                }
                set = true
            }
        } else {
            startRow = Math.floor(Math.random() * (rows - ship.length + 1))
            startCol = Math.floor(Math.random() * cols)
            let emptySpace = true

            for (let i = 0; i < ship.length; i++) {
                if (grid[startRow + i][startCol].isShip) {
                    emptySpace = false
                    break
                }
            }
            if (emptySpace && surroundingCell(startRow, startCol, ship.length, direction)) {
                for (let i = 0; i < ship.length; i++) {
                    grid[startRow + i][startCol].isShip = true
                }
                set = true
            }
        }
    }
}