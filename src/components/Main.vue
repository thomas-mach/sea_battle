<template>
    <div class="main">
        <div class="game-over-message container">
            <div v-show="isGameOver">{{ gameOverMessage }}</div>
        </div>
        <div class=" container" :class="{ 'game-over': isGameOver }">
            <div class="row">
                <div class="col" :class="{ 'display-none': gridDisabled }">
                    <Panel>
                        <template #player>
                            <font-awesome-icon :icon="['fas', 'skull']" :class="{ 'active-avatar': !gridDisabled }" />
                        </template>
                        <Game ref="refME" @clickDisabled="clickDisabled" @gridToggle="disableGrid"
                            @gameOver="gameOver('Player')" :shipClass="ship" :gridDisabled="gridDisabled"
                            :disabledClick="disabledClick" />
                    </Panel>
                </div>

                <div class="col" :class="{ 'display-none': !gridDisabled }">
                    <Panel>
                        <template #player>
                            <font-awesome-icon :icon="['fas', 'robot']" :class="{ 'active-avatar': gridDisabled }" />
                        </template>
                        <Game ref="refCPU" class="pointer" @clickDisabled="clickEnabled" @gridToggle="enableGrid"
                            shipClass="ship" :gridDisabled="!gridDisabled" @gameOver="gameOver('CPU')" />
                    </Panel>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <nav>
                    <button class="play-button" @click="startGame"><font-awesome-icon :icon="buttonText" /></button>
                    <button class="play-button" @click="soundDisable"><font-awesome-icon :icon="buttonSound" /></button>
                </nav>
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
            buttonText: ['fas', 'play'],
            buttonSound: ['fas', 'volume-xmark'],
            swich: true,
            ship: '',
            isGameOver: false,
            gameOverMessage: '',
            clickSound: new Audio('./mp3/battery.mp3'),
        }
    },

    methods: {
        startGame() {
            if (!this.switch) {
                this.clickSound.play();
            }
            this.ship = '';
            this.isGameOver = false;
            this.gridDisabled = false;
            this.$refs.refME.createGrid();
            this.$refs.refCPU.createGrid();
            this.buttonText = ['fas', 'arrows-rotate'];
        },

        disableGrid() {
            setTimeout(() => {
                this.gridDisabled = true
            }, 1500)
        },
        enableGrid() {
            setTimeout(() => {
                this.gridDisabled = false
            }, 1500)
        },

        clickDisabled() {
            this.disabledClick = true
        },

        clickEnabled() {
            this.disabledClick = false
        },

        soundDisable() {
            this.clickSound.play();
            this.switch = !this.switch
            if (!this.switch) {
                this.buttonSound = ['fas', 'volume-xmark']
            } else {
                this.buttonSound = ['fas', 'volume-low']
            }
            this.$refs.refME.disabledSound();
            this.$refs.refCPU.disabledSound();
        },

        gameOver(winner) {
            this.ship = 'ship'
            this.isGameOver = true;
            this.buttonText = ['fas', 'arrows-rotate'];

            // Imposta il messaggio in base a chi ha vinto
            if (winner === 'Player') {
                this.gameOverMessage = 'YOU WIN!';
            } else if (winner === 'CPU') {
                this.gameOverMessage = 'YOU LOSE!';
            }
        },

    }
}
</script>

<style scoped>
.main {
    width: 100%;
    height: 85%;
    background-color: var(--dark-blue);
    z-index: 10;
    opacity: 0, 5;
    /* border: 1px solid green; */
}

.row {
    display: flex;
    justify-content: space-between;
    margin: 0 10px;
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
    width: 120px;
    height: 60px;
    border: 1px solid var(--medium-blue);
    background-color: var(--medium-blue);
    color: var(--dark-blue);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    font-size: 40px;
    cursor: pointer;
    margin-top: 25px;
}

.play-button:hover {
    background-color: var(--dark-blue);
    color: var(--light-blue);
}

.game-over {
    pointer-events: none;
}

.game-over-message {
    display: flex;
    justify-content: center;
    height: 50px;
    color: red;
    font-size: 50px;
    margin-bottom: 12px;
    letter-spacing: 8px;
    font-weight: 700;
}

.active-avatar {
    /* color: var(--light-blue) */
    color: rgb(255, 176, 189)
}

@media screen and (max-width: 768px) {
    .row {
        justify-content: center;
    }

    .display-none {
        display: none
    }

    .game-over-message {
        height: 30px;
        font-size: 30px;
    }
}
</style>