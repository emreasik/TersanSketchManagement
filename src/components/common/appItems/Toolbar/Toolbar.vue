<template>
    <div class="tool-button">
        <ToolButton :icon="icon" :isActive="icon.active" v-for="icon in icons" :key="icon.id"
            @tool-button-clicked="setToolButtonActive"/>
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
    methods: {
        setToolButtonActive(id) {
            this.$emit('tool-button-clicked', id);
        }
    }
};
</script>

<style>

</style>