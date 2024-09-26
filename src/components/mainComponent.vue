<template>
    <div class="main">
        <div class="container">
            <div class="row">
                <div class="col">
                    <GameGrid @clickDisabled="clickDisabled" @sentData="disableGrid" shipClass=""
                        :gridDisabled="gridDisabled" :disabledClick="disabledClick" />
                </div>
                <div class="col">
                    <GameGrid class="pointer" @clickDisabled="clickEnabled" @sentData="enableGrid" shipClass="ship"
                        :gridDisabled="!gridDisabled" />
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
            disabledClick: false,
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

        clickDisabled() {
            this.disabledClick = true
        },

        clickEnabled() {
            this.disabledClick = false
        }

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

.pointer {
    pointer-events: none;
}
</style>