<template>
    <div class="grid" :class="{ 'is-disabled': gridDisabled, 'is-miss': disabledClick }">
        <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
            <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell"
                :class="['cell', { [shipClass]: cell.isShip, 'hit': cell.isHit, 'miss': cell.isActive }]"
                @click="handleClick(rowIndex, colIndex)">
                <!-- cell content end logic -->
            </div>
        </div>
        <!-- <h1>{{ AvailableCells }}</h1> -->
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
            hitShip: [],
            ships: [
                { id: 1, length: 4 },
                { id: 2, length: 3 },
                { id: 3, length: 3 },
                { id: 4, length: 2 },
                { id: 5, length: 2 },
                { id: 6, length: 2 },
                { id: 7, length: 1 },
                { id: 8, length: 1 },
                { id: 9, length: 1 },
                { id: 10, length: 1 },
            ],
            autoAttack: false,
            sunkedShipMessage: ''

        }
    },

    props: {
        shipClass: String,
        gridDisabled: Boolean,
        disabledClick: Boolean
    },

    methods: {
        handleClick(row, col) {
            this.launchAttack(row, col)
            this.ships.forEach(ship => this.shipSunk(ship))
            this.handleGridActive(row, col)
            this.autoAttack = true
        },

        createGrid() {
            this.grid = Array.from({ length: this.rows }, (_, rowIndex) =>
                Array.from({ length: this.cols }, (_, colIndex) => ({
                    id: null,
                    isActive: false,
                    isShip: false,
                    isHit: false,
                    isSunk: false,
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
            const cell = this.grid[row][col]

            if (cell.isShip) {
                cell.isHit = true;
                cell.isActive = true
                console.log('Hai colpito:', cell.id)
                return true; // Colpo a segno
            }

            cell.isActive = true
            this.$emit('clickDisabled')

            return false; // Nessuna nave colpita
        },


        handleGridActive(row, col) {
            const cell = this.grid[row][col]
            if (cell.isHit) {
                return
            }
            if (!cell.isActive || !cell.isHit) {
                this.$emit('sentData')
            }
        },



        findAvailableCells() {
            const availableCells = this.grid
            let randomRowIndex, randomColIndex;
            let foundNonActiveCell = false;
            do {
                randomRowIndex = Math.floor(Math.random() * availableCells.length);
                randomColIndex = Math.floor(Math.random() * availableCells[randomRowIndex].length);
                if (!availableCells[randomRowIndex][randomColIndex].isActive) {
                    foundNonActiveCell = true;
                }
            } while (!foundNonActiveCell)
            return { randomRowIndex, randomColIndex }
        },

        tryToSunk(row, col) {


            console.log('tryToSunk called');
            console.log(row, col)

            if (this.isWithinGrid(row - 1, col) && !this.grid[row - 1][col].isActive) {

                console.log(row - 1, col);
                return {
                    row: row - 1,
                    col: col
                };
            }
            if (this.isWithinGrid(row + 1, col) && !this.grid[row + 1][col].isActive) {

                console.log(row + 1, col);
                return {
                    row: row + 1,
                    col: col
                };
            }
            if (this.isWithinGrid(row, col - 1) && !this.grid[row][col - 1].isActive) {

                console.log(row, col - 1);
                return {
                    row: row,
                    col: col - 1
                };
            }
            if (this.isWithinGrid(row, col + 1) && !this.grid[row][col + 1].isActive) {

                console.log(row, col + 1);
                return {
                    row: row,
                    col: col + 1
                };
            } else {
                this.triggerAutoAttack();
            }
        },

        triggerAutoAttack() {
            if (this.hitShip.length === 0) {
                const { randomRowIndex, randomColIndex } = this.findAvailableCells()
                const hit = this.launchAttack(randomRowIndex, randomColIndex)



                this.handleGridActive(randomRowIndex, randomColIndex);


                if (hit) {

                    this.ships.forEach(ship => {
                        const isShipSunk = this.shipSunk(ship); // Verifica se la nave è affondata.

                        if (isShipSunk) {
                            console.log(`Ship with ID ${ship.id} has sunk.`);
                            this.hitShip = [];  // Azzera l'array delle celle colpite per quella nave.
                        }

                    });
                    this.hitShip.push({ row: randomRowIndex, col: randomColIndex })
                    console.log('hitShipArray', this.hitShip)
                    // Se l'attacco ha colpito una nave, prova a colpirne altre parti
                    setTimeout(() => {
                        this.autoAttackNextHit(randomRowIndex, randomColIndex);


                    }, 400);
                } else {
                    // Se l'attacco è fallito, ferma l'attacco automatico
                    setTimeout(() => {
                        this.autoAttack = false;
                    }, 400);
                }
                this.$emit('clickDisabled');
            } else if (this.hitShip.length === 1) {
                console.log(this.hitShip)
                this.autoAttackNextHit(this.hitShip[0].row, this.hitShip[0].col)

            }
        },

        autoAttackNextHit(row, col) {
            this.ships.forEach(ship => this.shipSunk(ship))

            const result = this.tryToSunk(row, col);


            if (result) {
                const hit2 = this.launchAttack(result.row, result.col);
                this.handleGridActive(result.row, result.col);

                // Se il secondo attacco è un colpo a segno, continua con un altro attacco
                if (hit2) {
                    setTimeout(() => {
                        this.hitShip.push({ row: result.row, col: result.col })
                        console.log(this.hitShip)
                        this.autoAttackNextHit(result.row, result.col);
                    }, 400);
                } else {
                    // Altrimenti, ferma l'attacco automatico
                    setTimeout(() => {
                        this.autoAttack = false;

                    }, 400);
                }
            }
        },

        shipSunk(ship) {
            let hits = 0;
            const hitCells = [];

            for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
                for (let colIndex = 0; colIndex < this.grid[rowIndex].length; colIndex++) {
                    const cell = this.grid[rowIndex][colIndex];
                    if (cell.id === ship.id && cell.isHit === true) {
                        hits++;
                        hitCells.push({ rowIndex, colIndex });
                        console.log(cell.id, 'was hit:', hits, 'times');
                    }
                }
            }

            if (hits === ship.length) {
                console.log('Ship sunk!');

                // Segna tutte le celle colpite come "isSunk"
                hitCells.forEach(hitCell => {
                    this.grid[hitCell.rowIndex][hitCell.colIndex].isSunk = true;
                });

                const rowIndices = hitCells.map(el => el.rowIndex);
                const isHorizontal = rowIndices.every(el => el === rowIndices[0]);
                const colIndices = hitCells.map(el => el.colIndex);
                const isVertical = colIndices.every(el => el === colIndices[0]);

                if (isHorizontal) {
                    console.log('Ship is horizontal');
                    hitCells.forEach(hitCell => {
                        this.activateSurroundingCells(hitCell.rowIndex, hitCell.colIndex);
                    });
                } else if (isVertical) {
                    console.log('Ship is vertical');
                    hitCells.forEach(hitCell => {
                        this.activateSurroundingCells(hitCell.rowIndex, hitCell.colIndex);
                    });
                }
                return true
            }
        },

        // Funzione per attivare le celle intorno a una specifica cella
        activateSurroundingCells(rowIndex, colIndex) {
            const surroundingOffsets = [
                [-1, -1], [-1, 0], [-1, 1],  // celle sopra
                [0, -1], [0, 1],   // celle ai lati
                [1, -1], [1, 0], [1, 1]     // celle sotto
            ];

            surroundingOffsets.forEach(offset => {
                const newRow = rowIndex + offset[0];
                const newCol = colIndex + offset[1];

                // Verifica se la nuova cella è all'interno dei limiti della griglia
                if (this.isWithinGrid(newRow, newCol)) {
                    this.grid[newRow][newCol].isActive = true;
                }
            });
        },

        // Funzione per verificare se una cella è all'interno della griglia
        isWithinGrid(row, col) {
            return row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[0].length;
        }

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
            }, 500)
        },

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
    pointer-events: none;
}

.miss {
    background-color: var(--light-gray);
    pointer-events: none;

}

.is-disabled {
    pointer-events: none;
    opacity: 0.5;
}

.is-miss {
    pointer-events: none;
}
</style>