<template>
    <div class="grid" :class="{ 'is-disabled': gridDisabled }">
        <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
            <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell"
                :class="['cell', { [shipClass]: cell.isShip, 'hit': cell.isHit, 'miss': cell.isActive }]"
                @click="handleClick(rowIndex, colIndex)">
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
            ],
            autoAttack: false,

        }
    },

    props: {
        shipClass: {
            type: String
        },
        gridDisabled: {
            type: Boolean
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
            console.log('launchAttack called');

            // Controlla se la cella è già attiva (già attaccata)
            if (this.grid[row][col].isActive) {
                console.log('Cella già attaccata!');
                return false; // Non puoi attaccare una cella già attiva
            }

            // Se la cella contiene una nave e non è attiva, segna come colpita
            if (this.grid[row][col].isShip) {
                this.grid[row][col].isHit = true;
                this.grid[row][col].isActive = true;
                return true; // Colpo a segno
            }

            // Se la cella non contiene una nave, segna solo come attiva
            this.grid[row][col].isActive = true;
            return false; // Nessuna nave colpita
        },


        handleGridActive(row, col) {
            if (this.grid[row][col].isHit) {

            }
            if (!this.grid[row][col].isActive || !this.grid[row][col].isHit)
                this.$emit('sentData')
        },


        handleClick(row, col) {
            this.launchAttack(row, col)
            this.handleGridActive(row, col)
            this.autoAttack = true
        },

        findAvailableCells() {
            const availableCells = [];

            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    if (!this.grid[row][col].isActive) {
                        availableCells.push({ row, col });
                    }
                }
            }
            return availableCells
        },

        triggerAutoAttack() {
            // Trova tutte le celle che non sono state attaccate
            const availableCells = this.findAvailableCells()

            // Se non ci sono più celle disponibili, ferma l'attacco automatico
            if (availableCells.length === 0) {
                console.log('Tutte le celle sono state attaccate, attacco automatico terminato.');
                this.autoAttack = false;
                return;
            }

            // Se ci sono celle disponibili, scegli una cella a caso tra quelle non attaccate
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const { row, col } = availableCells[randomIndex];

            const hit = this.launchAttack(row, col);
            this.handleGridActive(row, col);

            // Se l'attacco è un successo (colpo a segno), continua l'attacco automatico
            if (hit) {
                setTimeout(() => {
                    this.triggerAutoAttack();
                }, 1000); // Aspetta un secondo prima del prossimo attacco
            } else {
                // Altrimenti, ferma l'attacco automatico
                setTimeout(() => {
                    this.autoAttack = false;
                }, 1000);
            }
        },


    },

    created() {
        this.createGrid()
    },
    watch: {
        gridDisabled(newValue) {
            setTimeout(() => {
                if (!newValue && !this.autoAttack) {
                    this.triggerAutoAttack();
                    this.autoAttack = false; // Imposta il flag per attacco automatico
                }
            }, 1200)
        }
    }

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

.is-disabled {
    pointer-events: none;
    opacity: 0.5;
}
</style>