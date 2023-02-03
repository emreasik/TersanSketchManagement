<template>
    <div class="home-page">
        <Toolbar :icons="icons" @tool-button-clicked="setToolButtonActive"/>
        <canvas ref="canvas" @click="handleCanvasClick"></canvas>
    </div>
</template>

<script>
import Toolbar from '../../components/common/appItems/Toolbar/Toolbar.vue'
import LocationIcon from '../../assets/icons/location_marker_icon.png';
import CursorIcon from '../../assets/icons/cursor_icon.png';

export default {
    name: 'HomePage',
    components: {
        Toolbar
    },
    data() {
        return {
            icons: [
                {
                    id: 1,
                    path: CursorIcon,
                    active: true
                },
                {
                    id: 2,
                    path: LocationIcon,
                    active: false
                }
            ]
        }
    },
    mounted() {
        const image = new Image();
        image.src = new URL('../../assets/images/sketch.jpg', import.meta.url);

        image.onload = () => {
            image.height = (window.innerWidth / image.width) * image.height;
            image.width = window.innerWidth;
            this.drawCanvas(image);
        };
    },
    methods: {
        handleCanvasClick(event) {
            const x = event.pageX - this.$refs.canvas.offsetLeft;
            const y = event.pageY - this.$refs.canvas.offsetTop;
            console.log(x, y);
            this.$refs.canvas
                .getContext("2d")
                .fillRect(x - 5, y - 5, 15, 15);
        },
        drawCanvas(image) {
            const canvas = this.$refs.canvas;
            canvas.height = image.height;
            canvas.width = image.width;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, image.width, image.height);
        },
        sketchImageOnload(image) {
            image.height = (window.innerWidth / image.width) * image.height;
            image.width = window.innerWidth;
            this.drawCanvas(image);
        },
        setToolButtonActive(id) {
            console.log(id);
            this.icons.forEach(icon => {
                icon.active = icon.id === id;
            });
        }
    }
}
</script>

<style lang="scss">
@use '../../assets/_variables.scss' as v;

body {
    margin: 0;
    overflow-x: hidden;
}

#canvas {
    margin: 0;
    padding: 0;
    offset: 0;
}
</style>

