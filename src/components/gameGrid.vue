<template>
    <div class="grid">
        <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
            <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell"
                :class="['cell', { [shipClass]: cell.isShip, 'hit': cell.isHit, 'miss': cell.isActive }]"
                @click="launchAttack(rowIndex, colIndex)">
                <!-- cell content end logic -->
            </div>
        </div>
    </div>
</template>

<script>
import { placeShip } from "./utils/placeShip.js"
export default {
    name: "GameGrid",
    data() {
        return {
            rows: 10,
            cols: 10,
            grid: [],
            ships: [
                { length: 4 },
                { length: 3 },
                { length: 3 },
                { length: 2 },
                { length: 2 },
                { length: 2 },
                { length: 1 },
                { length: 1 },
                { length: 1 },
                { length: 1 },
            ]
        }
    },

    props: {
        shipClass: {
            type: String
        }
    },
    methods: {
        createGrid() {
            this.grid = Array.from({ length: this.rows }, (_, rowIndex) =>
                Array.from({ length: this.cols }, (_, colIndex) => ({
                    isActive: false,
                    isShip: false,
                    isHit: false,
                    label: `Row ${rowIndex + 1}, Col ${colIndex + 1}`
                })))
            console.log(this.grid)
            this.placeAllShip()
        },

        surroundingCell(startRow, startCol, length, direzione) {
            let beginningRow, endRow, beginningCol, endCol;

            if (direzione === 0) { // Orizzontal
                beginningRow = Math.max(startRow - 1, 0); // Top row (if egsist)
                endRow = Math.min(startRow + 1, this.rows - 1); // Bottom row (if egsist)
                beginningCol = Math.max(startCol - 1, 0); // Column to the left of the ship
                endCol = Math.min(startCol + length, this.cols - 1); // Column to the right of the ship

            } else { // Vertical
                beginningRow = Math.max(startRow - 1, 0); // Top row (if egsist)
                endRow = Math.min(startRow + length, this.rows - 1); // Bottom row (if egsist)
                beginningCol = Math.max(startCol - 1, 0); // Column to the left of the ship
                endCol = Math.min(startCol + 1, this.cols - 1); // Column to the right of the ship

            }

            // Chech surrounding cell of ship
            for (let i = beginningRow; i <= endRow; i++) {
                for (let j = beginningCol; j <= endCol; j++) {
                    if (this.grid[i][j].isShip) {
                        return false; // If there is an adjacent ship, we cannot place it here
                    }
                }
            }

            return true;
        },

        placeAllShip() {
            this.ships.forEach(ship => placeShip(this.grid, ship, this.rows, this.cols, this.surroundingCell))
        },

        launchAttack(row, col) {
            console.log('lunchAttack called')
            if (this.grid[row][col].isShip && !this.grid[row][col].isActive) {
                this.grid[row][col].isHit = true
                this.grid[row][col].isActive = true
            } else if (!this.grid[row][col].isActive) {
                this.grid[row][col].isActive = true
            }
        }
    },
    created() {
        this.createGrid()
    },

}
</script>

<style scoped>
.grid {
    display: felx;
    flex-direction: column;
    width: 500px;
    aspect-ratio: 1;
    border: 1px solid var(--light-blue);

}

.row {
    display: flex;
}

.cell {
    background-color: var(--medium-blue);
    border: 1px solid var(--light-blue);
    width: 50px;
    height: 50px;
}

.ship {
    background-color: var(--gray) !important;
}

.hit {
    background-color: red !important;
}

.miss {
    background-color: var(--light-gray);
}
</style>