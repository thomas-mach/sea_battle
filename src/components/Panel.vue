<template>
    <div class="panel">
        <slot name="player"></slot>
        <slot />
    </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 15px;
    border-radius: 10px;
    background-color: rgba(139, 140, 137, 0.3);
    color: var(--dark-blue);
    font-size: 50px;
}
</style>