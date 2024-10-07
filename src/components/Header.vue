<template>
    <div class="header">
        <div class="container">
            <div class="row">
                <div class="title">
                    <p>sea-battle</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'headerComponent'
}
</script>

<style scoped>
.header {
    width: 100%;
    height: 10%;
    background-color: var(--dark-blue);
}

.title {
    line-height: 100px;
    font-size: 100px;
    color: var(--medium-blue);
}

.row {
    display: flex;
    justify-content: center;
    align-items: center;
}

@media screen and (max-width: 768px) {
    .title {
        font-size: 60px;
    }
}
</style>
