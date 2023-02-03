<template>
    <div class="tool-button__container">
        <div @click="buttonClick" class=" tool-button__container__button">
            <img :src="icon" alt="cursor">
        </div>
    </div>
</template>

<script>
export default {
    name: 'ToolButton',
    props: {
        icon: {
            type: String,
            required: true
        }
    },
    methods: {
        buttonClick() {
            alert('clicked');
        }
    }
}
</script>

<style lang="scss">
.tool-button {
    display: flex;
    flex-direction: column;
    padding: 5px;
    position: fixed;
    bottom: 50vh;
    right: 0;
    margin-right: 10px;
    gap: 10px;
    // TODO 2 item gelince ortalama fixle
}

.tool-button__container {
    // box-shadow: -4px 4px 8px -1px rgba(20, 77, 129, 1);
    box-shadow: -3px 3px 8px -1px rgba(20, 77, 129, 1);

    background: #144D81;
    border-radius: 50%;
    width: 60px;
    height: 60px;

    &__button {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;


        img {
            width: 35px;
            height: 35px;
        }
    }
}
</style>