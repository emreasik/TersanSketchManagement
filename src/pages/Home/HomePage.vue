<template>
    <div class="home-page">
        <Toolbar :icons="icons" @tool-button-clicked="setToolButtonActive" />
        <canvas ref="canvas"
            v-on="isSketchMode ? { click: handleCanvasClick } : { click: handleCanvasCursor }"></canvas>
    </div>
</template>

<script>
import ApiService from '../../services/ApiService.js';
import Toolbar from '../../components/common/appItems/Toolbar/Toolbar.vue'
import LocationToolbarIcon from '../../assets/icons/location_marker_icon.png';
import CursorToolbarIcon from '../../assets/icons/cursor_icon.png';
import LocationMapIcon from '../../assets/icons/location_map_icon.png';
import LocationMapIconClicked from '../../assets/icons/location_map_icon_clicked.png';

export default {
    name: 'HomePage',
    components: {
        Toolbar,
    },
    data() {
        return {
            icons: [
                {
                    id: 1,
                    path: CursorToolbarIcon,
                    active: true
                },
                {
                    id: 2,
                    path: LocationToolbarIcon,
                    active: false
                }
            ],
            markPoints: [],
            isSketchMode: false,
        }
    },
    async created() {
        this.markPoints = await ApiService.getBuildings();
        console.log(this.markPoints);
        this.drawMarkPoints()
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
            const ctx = this.$refs.canvas.getContext("2d")
            // .fillRect(x - 5, y - 5, 15, 15);

            const img = new Image();
            img.src = LocationMapIcon;
            img.onload = () => {
                console.log("img");
                ctx.drawImage(img, x - 15, y - 25, 30, 30);
            }
        },
        handleCanvasCursor(event) {
            const x = event.pageX - this.$refs.canvas.offsetLeft;
            const y = event.pageY - this.$refs.canvas.offsetTop;

            const ctx = this.$refs.canvas.getContext("2d")

            const imgClicked = new Image();
            imgClicked.src = LocationToolbarIcon;

            const imgNotClicked = new Image();
            imgNotClicked.src = LocationMapIcon;

            // if any client clicked 20px around the point
            this.markPoints.forEach(point => {
                console.log(point.x, point.y);
                console.log(x, y);
                console.log("-------------");
                // point is in the range of 20px
                if (Math.abs(point.x - x) <= 30 && Math.abs(point.y - y) <= 30) {
                    ctx.fillStyle = 'red';
                    ctx.drawImage(imgClicked, point.x, point.y, 30, 30);
                } else {
                    ctx.fillStyle = 'blue';
                    ctx.drawImage(imgNotClicked, point.x, point.y, 30, 30);

                }
            });
        },
        drawMarkPoints() {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'blue';

            const img = new Image();
            img.src = LocationMapIcon;

            img.onload = () => {
                this.markPoints.forEach(point => {
                    img.id = point.id;
                    ctx.drawImage(img, point.x, point.y, 30, 30);
                });
            }
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
            if (id === 2) {
                this.isSketchMode = true;
            } else {
                this.isSketchMode = false;
            }
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

