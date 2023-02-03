<template>
    <div class="tool-button">
            <ToolButton :icon="icon.path" v-for="icon in icons" :key="icon.id"/>
    </div>
</template>

<script>
import ToolButton from './ToolButton.vue';

export default {
    components: {
        ToolButton
    },
    props: {
        icons: {
            type: Array,
            required: true
        }
    },
};
</script>

<style>

</style>