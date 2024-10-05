<template>
    <div class="grid" :class="{ 'is-disabled': gridDisabled, 'is-miss': disabledClick }">
        <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
            <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell"
                :class="['cell', { [shipClass]: cell.isShip, 'hit': cell.isHit, 'miss': cell.isActive, 'on-target': cell.isOnTarget, 'target': cell.isTarget }]"
                @click="handleClick(rowIndex, colIndex)">
            </div>
        </div>
    </div>
</template>

<script>
import { placeShip } from "./utils/place-ship.js";
export default {
    name: 'Game',

    props: {
        shipClass: String,
        gridDisabled: Boolean,
        disabledClick: Boolean,
    },

    data() {
        return {
            rows: 10,
            cols: 10,
            grid: [],
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
            wasHit: false,
            hitsTracker: [],
            idsOfSunkShips: [],
            priority: 1,
            gameOver: false,
            soundEnabled: true,
            bigFireBall: new Audio('./mp3/big_fireball.mp3'),
            impact: new Audio('./mp3/impact.mp3'),
        };
    },

    watch: {
        gridDisabled(newValue) {

            setTimeout(() => {
                if (!newValue && !this.autoAttack && !this.gameOver) {
                    this.triggerAutoAttack();
                    this.autoAttack = false; // Imposta il flag per attacco automatico
                }
            }, 1000);

        },
    },

    created() {
        this.gridInitial();
    },

    methods: {
        gridInitial() {
            this.grid = Array.from({ length: this.rows }, (_, rowIndex) =>
                Array.from({ length: this.cols }, (_, colIndex) => false));
        },

        createGrid() {
            this.gameOver = false
            this.idsOfSunkShips = []
            this.grid = Array.from({ length: this.rows }, (_, rowIndex) =>
                Array.from({ length: this.cols }, (_, colIndex) => ({
                    id: null,
                    isActive: false,
                    isShip: false,
                    isHit: false,
                    isSunk: false,
                    isOnTarget: false,
                    isTarget: false,
                    priority: 1,
                    label: `Row ${rowIndex + 1}, Col ${colIndex + 1}`
                })));

            // Posiziona tutte le navi sulla griglia
            this.ships.forEach(ship => placeShip(this.grid, ship, this.rows, this.cols));
            // console.log(this.grid);
        },

        handleClick(row, col) {
            this.launchAttack(row, col);
            this.handleGridActive(row, col);
            setTimeout(() => {
                this.ships.forEach(ship => this.shipSunk(ship));
                this.autoAttack = true;
            }, 1000)
            setTimeout(() => {
                this.endGame()
            }, 2000)
        },

        launchAttack(row, col) {
            console.log('launchAttack called');
            const cell = this.grid[row][col];
            this.onTarget(this.grid, row, col);

            if (cell.isShip) {
                cell.isHit = true;
                cell.isActive = true;
                console.log('Hai colpito:', cell.id);
                setTimeout(() => {
                    this.playSound(this.bigFireBall)
                }, 1000)
                return true; // Colpo a segno
            }

            cell.isActive = true;
            this.$emit('clickDisabled');
            setTimeout(() => {
                this.playSound(this.impact)
            }, 1000)
            return false; // Nessuna nave colpita
        },

        triggerAutoAttack() {
            console.log('AutoAttack called', this.gameOver)
            if (this.gameOver) {
                return;
            }
            //lancia attaco per CPU
            let hit = false;
            const { randomRowIndex, randomColIndex } = this.findAvailableCells();
            hit = this.launchAttack(randomRowIndex, randomColIndex);
            console.log('lunch attack from triggerautoattack', hit)
            this.handleGridActive(randomRowIndex, randomColIndex);

            // Se l'attacco è un successo (colpo a segno), continua l'attacco automatico
            if (hit) {
                setTimeout(() => {
                    this.wasHit = true
                    const restOfShips = this.ships.filter(el => !this.idsOfSunkShips.includes(el.id)) //filtra le navi colpite
                    restOfShips.forEach(ship => this.shipSunk(ship));
                    this.endGame()
                    this.addPriority(randomRowIndex, randomColIndex);
                    this.checkAllShipsHit(); // Controlla se ci sono ancora navi colpite ma non affondate
                    console.log('AUTO ATTACK:', this.grid)
                    this.triggerAutoAttack();
                }, 2000);
            } else {
                setTimeout(() => {
                    this.autoAttack = false; //Ferma l'attacco automatico
                }, 1000);
            }

            this.$emit('clickDisabled');
        },

        handleGridActive(row, col) {
            const cell = this.grid[row][col];
            if (cell.isHit) {
                return;
            }
            if (!cell.isActive || !cell.isHit) {
                this.$emit('gridToggle');
            }
        },

        findAvailableCells() {
            const availableCells = this.grid;
            let randomRowIndex, randomColIndex;
            let foundNonActiveCell = false;

            // Se è stata colpita una cella, cerca celle con la priorità più alta
            if (this.wasHit) {
                do {
                    randomRowIndex = Math.floor(Math.random() * availableCells.length);
                    randomColIndex = Math.floor(Math.random() * availableCells[randomRowIndex].length);
                    if (!availableCells[randomRowIndex][randomColIndex].isActive && availableCells[randomRowIndex][randomColIndex].priority === this.priority) {
                        foundNonActiveCell = true;
                    }
                } while (!foundNonActiveCell);

                return { randomRowIndex, randomColIndex };
                // Se non è stata colpita una cella, cerca una qualsiasi cella non attiva
            } else {
                do {
                    randomRowIndex = Math.floor(Math.random() * availableCells.length);
                    randomColIndex = Math.floor(Math.random() * availableCells[randomRowIndex].length);
                    if (!availableCells[randomRowIndex][randomColIndex].isActive) {
                        foundNonActiveCell = true;
                    }
                } while (!foundNonActiveCell);

                return { randomRowIndex, randomColIndex };
            }


        },

        checkAllShipsHit() {
            // Controlla se ci sono ancora navi colpite ma non affondate
            let anyShipHit = false;

            this.ships.forEach(ship => {
                let hits = 0;
                for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
                    for (let colIndex = 0; colIndex < this.grid[rowIndex].length; colIndex++) {
                        const cell = this.grid[rowIndex][colIndex];
                        if (cell.id === ship.id && cell.isHit && !cell.isSunk) {
                            hits++;
                        }
                    }
                }
                // Se ci sono colpi su una nave che non è stata ancora affondata, segnala che esiste una nave colpita
                if (hits > 0 && hits < ship.length) {
                    anyShipHit = true;
                }
            });

            // Imposta wasHit a false solo se nessuna nave colpita è in gioco
            if (!anyShipHit) {
                this.wasHit = false;
                this.hitsTracker = [];
            }
        },

        shipSunk(ship) {
            console.log('shipSunk called')
            let hits = 0;
            const hitCells = [];

            for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
                for (let colIndex = 0; colIndex < this.grid[rowIndex].length; colIndex++) {
                    const cell = this.grid[rowIndex][colIndex];
                    if (cell.id === ship.id && cell.isHit === true) {
                        hits++;
                        hitCells.push({ rowIndex, colIndex });
                    }
                }
            }

            if (hits === ship.length) {
                console.log('Ship sunk!');

                // Segna tutte le celle colpite come "isSunk"
                hitCells.forEach(hitCell => {
                    this.grid[hitCell.rowIndex][hitCell.colIndex].isSunk = true;
                });
                this.idsOfSunkShips.push(this.grid[hitCells[0].rowIndex][hitCells[0].colIndex].id)
                const rowIndices = hitCells.map(el => el.rowIndex);
                const isHorizontal = rowIndices.every(el => el === rowIndices[0]);
                const colIndices = hitCells.map(el => el.colIndex);
                const isVertical = colIndices.every(el => el === colIndices[0]);

                if (isHorizontal) {
                    // console.log('Ship is horizontal');
                    hitCells.forEach(hitCell => {
                        this.activateSurroundingCells(hitCell.rowIndex, hitCell.colIndex);
                    });
                } else if (isVertical) {
                    // console.log('Ship is vertical');
                    hitCells.forEach(hitCell => {
                        this.activateSurroundingCells(hitCell.rowIndex, hitCell.colIndex);
                    });
                }

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

        // Assegna la priorità più alta alle celle circostanti la cella colpita
        addPriority(rowIndex, colIndex) {
            this.hitsTracker.push({ rowIndex, colIndex });
            console.log('hitTrucker', this.hitsTracker);
            this.priority = 2

            let surroundingOffsets = [[-1, 0], [0, -1], [1, 0], [0, 1]]

            if (this.hitsTracker.length > 1) {
                const rowIndices = this.hitsTracker.map(el => el.rowIndex);
                const isHorizontal = rowIndices.every(el => el === rowIndices[0]);
                const colIndices = this.hitsTracker.map(el => el.colIndex);
                const isVertical = colIndices.every(el => el === colIndices[0]);

                if (isHorizontal) {
                    console.log('Ship is horizontal');
                    this.priority = 3
                    surroundingOffsets = [[0, -1], [0, 1], [0, -2], [0, 2]]
                } else if (isVertical) {
                    console.log('Ship is vertical');
                    this.priority = 3
                    surroundingOffsets = [[-1, 0], [1, 0], [-2, 0], [2, 0]]

                }
            }

            surroundingOffsets.forEach(offset => {
                const newRow = rowIndex + offset[0];
                const newCol = colIndex + offset[1];

                if (this.isWithinGrid(newRow, newCol)) {
                    this.grid[newRow][newCol].priority = this.priority;
                }
            });
        },

        isWithinGrid(row, col) {
            return row >= 0 && row < this.grid.length && col >= 0 && col < this.grid[0].length;
        },

        endGame(player) {
            const restOfShips = this.ships.filter(el => this.idsOfSunkShips.includes(el.id)); // Filtra le navi affondate
            console.log('sunked ship ids length', restOfShips.length);
            if (restOfShips.length === 1 && !this.gameOver) {
                this.gameOver = true;
                this.autoAttack = false;
                this.$emit('gameOver', player);
            }
        },

        onTarget(matrix, i, j) {
            const cell = []
            // Celle sopra
            for (let row = i - 1; row >= 0; row--) {
                cell.push({ row: row, col: j });
            }
            // Celle sotto
            for (let row = i + 1; row < matrix.length; row++) {
                cell.push({ row: row, col: j });
            }
            // Celle a sinistra
            for (let col = j - 1; col >= 0; col--) {
                cell.push({ row: i, col: col });
            }
            // Celle a destra
            for (let col = j + 1; col < matrix[0].length; col++) {
                cell.push({ row: i, col: col });
            }
            this.grid[i][j].isTarget = true

            cell.forEach(el => this.grid[el.row][el.col].isOnTarget = true)
            setTimeout(() => {
                cell.forEach(el => this.grid[el.row][el.col].isOnTarget = false)
                this.grid[i][j].isTarget = false
            }, 1000)
        },

        disabledSound() {
            this.soundEnabled = !this.soundEnabled
        },

        playSound(sound) {
            console.log('play sound colled')
            if (this.soundEnabled) {
                sound.currentTime = 0;
                sound.play()
            }
        },
    },
};
</script>

<style scoped>
.grid {
    display: flex;
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
    background-color: var(--medium-blue);
    border: 1px solid var(--light-blue);
    width: 50px;
    height: 50px;
}

.ship {
    background-color: var(--gray) !important;
}

.hit {
    background-color: var(--deep-blue) !important;
    background-image: var(--icon-cross-red) !important;
    background-position: center;
    background-repeat: no-repeat;
    pointer-events: none;
}

.miss {
    background-color: var(--dark-blue);
    background-image: var(--icon-cross);
    background-position: center;
    background-repeat: no-repeat;
    pointer-events: none;
}

.is-disabled {
    pointer-events: none;
}

.is-miss {
    pointer-events: none;
}

.on-target {
    box-shadow: inset 0 0 50px rgba(255, 255, 255, 0.3);
}

.target {
    background-color: rgba(255, 255, 255, 0.5) !important;
    background-image: var(--icon-target) !important;
    background-position: center;
    background-repeat: no-repeat;
}
</style>
