<template>
    <div class="grid">
        <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
            <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell" :class="['cell', { 'ship': cell.isShip }]"
                @click="fire(rowIndex, colIndex)">
                <!-- cell content end logic -->
            </div>
        </div>
    </div>
</template>

<script>
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
    methods: {
        CreateGrid() {
            this.grid = Array.from({ length: this.rows }, (_, rowIndex) =>
                Array.from({ length: this.cols }, (_, colIndex) => ({
                    isActive: false,
                    isShip: false,
                    label: `Row ${rowIndex + 1}, Col ${colIndex + 1}`
                })))
            console.log(this.grid)
            this.PlaceAllShip()
        },

        PlaceShip(ship) {
            let set = false

            while (!set) {
                const direction = Math.floor(Math.random() * 2)
                let startRow, startCol
                if (direction === 0) {
                    startRow = Math.floor(Math.random() * this.rows)
                    startCol = Math.floor(Math.random() * (this.cols - ship.length + 1))
                    let emptySpace = true

                    for (let i = 0; i < ship.length; i++) {
                        if (this.grid[startRow][startCol + i].isShip) {
                            emptySpace = false
                            break
                        }
                    }
                    if (emptySpace) {
                        for (let i = 0; i < ship.length; i++) {
                            this.grid[startRow][startCol + i].isShip = true
                        }
                        set = true
                    }
                } else {
                    startRow = Math.floor(Math.random() * (this.rows - ship.length + 1))
                    startCol = Math.floor(Math.random() * this.cols)
                    let emptySpace = true

                    for (let i = 0; i < ship.length; i++) {
                        if (this.grid[startRow + i][startCol].isShip) {
                            emptySpace = false
                            break
                        }
                    }
                    if (emptySpace) {
                        for (let i = 0; i < ship.length; i++) {
                            this.grid[startRow + i][startCol].isShip = true
                        }
                        set = true
                    }
                }
            }
        },
        PlaceAllShip() {
            this.ships.forEach(ship => this.PlaceShip(ship))
        },
        fire(row, col) {
            if (this.grid[row][col].isShip)
                alert('hit')
        }

    },
    created() {
        this.CreateGrid()
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
</style>