<template>
    <div class="grid">
        <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
            <div v-for="(cell, colIndex) in row" :key="colIndex" class="cell" :class="['cell', { 'ship': cell.isShip }]"
                v-bind="PlaceShip(rowIndex, colIndex)">
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
            grid: []
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
        },

        // CellAlert(rowIndex, colIndex) {
        //     const cell = this.grid[rowIndex][colIndex]; // Recupera la cella
        //     alert(`Label: ${cell.label}`)
        // },

        PlaceShip(rowIndex, colIndex, i) {
            const direction = Math.floor(Math.random() * 2)

            if (direction === 0) {
                for (i = 0; i < 5; i++) {
                    this.grid[i][0].isShip = true
                }
            }

            // if (direction === 1 &&) {
            //     for (i = 0; i < 5; i++) {
            //         this.grid[i][colIndex].isShip = true
            //     }
            // }






            // const cell = this.grid[rowIndex][colIndex]
            // if (!cell.isShip) {
            //     this.grid[rowIndex][colIndex].isShip = true
            // } else {
            //     alert('cella ocupata')
            // }
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