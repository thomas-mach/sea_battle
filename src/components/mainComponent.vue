<template>
    <div class="main">
        <div class="container">
            <div class="row">
                <div class="col">
                    <GameGrid @sentData="disableGrid" :gridDisabled="gridDisabled" />
                </div>
                <div class="col">
                    <GameGrid @sentData="enableGrid" shipClass="ship" :gridDisabled="!gridDisabled" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GameGrid from './gameGrid.vue';
export default {
    name: 'mainComponent',
    components: {
        GameGrid
    },

    data() {
        return {
            gridDisabled: false,
        }
    },

    methods: {
        disableGrid(data) {
            console.log(data)
            setTimeout(() => {
                this.gridDisabled = true
            }, 1000)

        },
        enableGrid() {
            setTimeout(() => {
                this.gridDisabled = false
            }, 1000)
        },

    }
}


</script>

<style scoped>
.main {
    width: 100%;
    height: 70%;
    background-color: var(--dark-blue)
}

.row {
    display: flex;
    justify-content: space-between;
}
</style>