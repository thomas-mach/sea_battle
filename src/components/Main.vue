<template>
    <div class="main">
        <div class="container">
            <div class="row">
                <div class="col">
                    <Game @clickDisabled="clickDisabled" @gridToggle="disableGrid" shipClass=""
                        :gridDisabled="gridDisabled" :disabledClick="disabledClick" />
                </div>
                <div class="col">
                    <Game class="pointer" @clickDisabled="clickEnabled" @gridToggle="enableGrid" shipClass="ship"
                        :gridDisabled="!gridDisabled" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Game from './Game.vue';
export default {
    components: {
        Game
    },

    data() {
        return {
            gridDisabled: false,
            disabledClick: false,
        }
    },

    methods: {
        disableGrid() {
            setTimeout(() => {
                this.gridDisabled = true
            }, 500)

        },
        enableGrid() {
            setTimeout(() => {
                this.gridDisabled = false
            }, 500)
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