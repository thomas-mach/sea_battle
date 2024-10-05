<template>
    <div class="footer">
        <div class="container">
            <div class="row">
                <p> &copy; see-battle by Thomas Mach 2024</p>
                <p>Version 1.0.0</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'footerComponent'
}
</script>

<style scoped>
.footer {
    width: 100%;
    height: 5%;
    background-color: var(--dark-blue);
    /* border: 1px solid blue; */
}

.row {
    display: flex;
    justify-content: space-between;
    align-content: center;
    margin: 0 10px;
}

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

p {
    font-family: Arial, Helvetica, sans-serif;
    color: var(--gray);
    font-size: 14px;
}
</style>