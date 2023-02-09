<template>
    <div class="tool-button">
        <ToolButton :icon="icon" :isActive="icon.active" v-for="icon in icons" :key="icon.id"
            @tool-button-clicked="setToolButtonActive" />
        <SketchButton :style="activeIcon" :sketchIcon="sketchIcon" v-for="sketchIcon in sketchIcons"
            :key="sketchIcon.id" />
    </div>
</template>

<script>
import ToolButton from './ToolButton.vue';
import SketchButton from './SketchButton.vue';

export default {
    components: {
        ToolButton,
        SketchButton
    },
    props: {
        icons: {
            type: Array,
            required: true
        },
        sketchIcons: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            activeIcon: false
        };
    },
    methods: {
        setToolButtonActive(id) {
            this.$emit('tool-button-clicked', id);
        }
    },
    computed: {
        activeIcon() {
            let active = this.icons.find(icon => icon.active);
            if (active.id === 3) {
                return {
                    height: '60px !important',
                };
            }
        }
    }
};
</script>

<style lang="scss">
.tool-button {
    display: flex;
    flex-direction: column;
    padding: 5px;
    position: fixed;
    bottom: 40vh;
    right: 0;
    margin-right: 10px;
    gap: 10px;
    // TODO 2 item gelince ortalama fixle
    z-index: 1;
}
</style>