<template>
    <div class="main">
        <div class="container">
            <nav>
                <button class="play-button" @click="startGame">PLAY</button>
                <button class="play-button" @click="callCreatedGrid">RESET</button>
            </nav>
        </div>
        <div class="container">
            <div class="row">
                <div class="col">
                    <Panel>
                        <template #player>
                            <h1>ME</h1>
                        </template>
                        <Game @clickDisabled="clickDisabled" @gridToggle="disableGrid" shipClass=""
                            :gridDisabled="gridDisabled" :disabledClick="disabledClick" />
                    </Panel>
                </div>

                <div class="col">
                    <Panel>
                        <template #player>
                            <h1>CPU</h1>
                        </template>
                        <Game class="pointer" @clickDisabled="clickEnabled" @gridToggle="enableGrid" shipClass="ship"
                            :gridDisabled="!gridDisabled" />
                    </Panel>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Panel from './Panel.vue'
import Game from './Game.vue';
export default {
    components: {
        Panel, Game
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
            }, 800)

        },
        enableGrid() {
            setTimeout(() => {
                this.gridDisabled = false
            }, 800)
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

nav {
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 20px;
}

.play-button {
    width: 160px;
    background-color: var(--medium-blue);
    color: var(--dark-blue);
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 10px;
    font-size: 30px;
    letter-spacing: 8px;
    font-weight: 700;
    padding: 20px;
    cursor: pointer;
    margin-bottom: 50px;
}

.play-button:hover {
    background-color: var(--light-blue);
}
</style>