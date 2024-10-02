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
    padding: 30px;
    border-radius: 30px;
    background-color: rgba(139, 140, 137, 0.3);
    color: var(--dark-blue)
}
</style>