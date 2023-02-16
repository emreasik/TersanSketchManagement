<template>
    <div class="tool-button__sketch-container" @click="$emit('sketchOperationButtonClicked', sketchIcon.id)">
        <div class="tool-button__sketch-container__button">
            <img :src="sketchIcon.path" alt="cursor">
        </div>
    </div>
</template>

<script>
export default {
    name: 'SketchButton',
    props: {
        sketchIcon: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang="scss">
@use '../../../../assets/variables' as v;

.tool-button__sketch-container {
    box-shadow: -3px 3px 8px -1px rgba(20, 77, 129, 1);
    background: v.$btn-toolbar-bg-color;
    border-radius: 50%;
    width: 60px;
    height: 0px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    overflow: hidden;

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