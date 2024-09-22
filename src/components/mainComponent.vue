<template>
    <div class="main">
        <div class="container">
            <div class="row">
                <div class="col">
                    <GameGrid />
                </div>
                <div class="col">
                    <GameGrid />
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