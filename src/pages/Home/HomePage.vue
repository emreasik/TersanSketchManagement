<script>
export default {
    name: 'HomePage',
    mounted() {
        const image = new Image();
        image.src = new URL('../../assets/images/sketch.jpg', import.meta.url);
        console.log(image.src);
        // scale image to full screen
        console.log(image.height);
        // console.log(image.width);
        // image.height = (window.innerWidth / image.width) * image.height;
        // image.width = window.innerWidth;
        // console.log(image.height);
        // console.log(image.width);
        // const canvas = this.$refs.canvas;
        // console.log(canvas);
        // canvas.width = image.width;
        // canvas.height = image.height;
        // console.log(canvas);

        // const ctx = canvas.getContext("2d");

        // image.onload = () => {
        //     ctx.drawImage(image, 0, 0, image.width, image.height);
        //     console.log("image drawn");
        // };
    },
    methods: {
        handleCanvasClick(event) {
            const x = event.pageX - this.$refs.canvas.offsetLeft;
            const y = event.pageY - this.$refs.canvas.offsetTop;
            console.log(x, y);
            this.$refs.canvas
                .getContext("2d")
                .fillRect(x - 5, y - 5, 15, 15);
        }
    }
}
</script>

<template>
    <div class="home-page">
        <canvas ref="canvas" @click="handleCanvasClick"></canvas>
    </div>
</template>

<style lang="scss">
@use '../../assets/_variables.scss' as v;

body {
    margin: 0;
}

#canvas {
    margin: 0;
    padding: 0;
    offset: 0;
}
</style>