<template>
    <div class="tool-button__container" :class="{ active: isActive }" @click="$emit('toolButtonClicked', icon.id)">
        <div class="tool-button__container__button">
            <img :src="icon.path" alt="cursor">
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
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style lang="scss">
@use '../../../../assets/variables' as v;

.active {
    background: v.$btn-toolbar-active-bg-color !important;
    box-shadow: -3px 3px 8px -1px v.$btn-toolbar-active-bg-color !important;
}

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
    box-shadow: -3px 3px 8px -1px rgba(20, 77, 129, 1);
    background: v.$btn-toolbar-bg-color;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    cursor: pointer;

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