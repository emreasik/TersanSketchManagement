<template>
    <div class="tool-button">
        <ToolButton :icon="icon" :isActive="icon.active" v-for="icon in icons" :key="icon.id"
            @tool-button-clicked="setToolButtonActive" />
        <SketchButton :style="activeIcon" :sketchIcon="sketchIcon" v-for="sketchIcon in sketchIcons"
            :key="sketchIcon.id" @sketch-operation-button-clicked="setSketchOperationButtonActive" />
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
        },
        setSketchOperationButtonActive(id) {
            this.$emit('sketch-operation-button-clicked', id);
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
    position: fixed;
    top: 50%;
    right: 1%;
    gap: 10px;
    transform: translate(0, -50%);

    // TODO 2 item gelince ortalama fixle
    z-index: 1;
}
</style>