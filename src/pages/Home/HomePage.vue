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
            const ctx = this.$refs.canvas.getContext("2d")

            const img = new Image();
            img.src = LocationMapIcon;
            img.onload = () => {
                ctx.drawImage(img, x - 15, y - 25, 30, 30);
            }
        },
        handleCanvasCursor(event) {
            const x = event.pageX - this.$refs.canvas.offsetLeft;
            const y = event.pageY - this.$refs.canvas.offsetTop;

            const ctx = this.$refs.canvas.getContext("2d")

            const imgClicked = new Image();
            imgClicked.src = LocationMapIconClicked;

            const imgNotClicked = new Image();
            imgNotClicked.src = LocationMapIcon;

            const card = document.querySelector('.card');
            let isClickedOnPoint = false;

            imgClicked.onload = () => {
                imgNotClicked.onload = () => {
                    this.markPoints.forEach(point => {
                        if (Math.abs(point.x - x) <= 30 && Math.abs(point.y - y) <= 30) {
                            ctx.drawImage(imgClicked, point.x, point.y, 30, 30);
                            console.log("clicked");
                            card.style.left = `${parseInt(point.x) + 20}px`;
                            card.style.top = `${parseInt(point.y) + 25}px`;
                            card.classList.remove('d-none');
                            isClickedOnPoint = true;
                        } else {
                            ctx.drawImage(imgNotClicked, point.x, point.y, 30, 30);
                        }
                        if (!isClickedOnPoint) {
                            card.classList.add('d-none');
                        }
                    });
                }
            }

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

<template>
    <div class="home-page">
        <Toolbar :icons="icons" @tool-button-clicked="setToolButtonActive" />
        <div class="position-relative">
            <canvas class="position-absolute" ref="canvas"
                v-on="isSketchMode ? { click: handleCanvasClick } : { click: handleCanvasCursor }">
            </canvas>
            <div class="custom-card card position-absolute d-none animate__animated animate__fadeIn"
                style="width: 18rem;">
                <h6 class="custom-card__tag">Building</h6>
                <div class="card-body">
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                        the card's content.</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">An item</li>
                    <li class="list-group-item">A second item</li>
                </ul>
                <div class="card-body d-flex justify-content-center">
                    <a href="#" class="card-link custom-card__link">Düzenle</a>
                    <a href="#" class="card-link custom-card__link">Kroki</a>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@use '../../assets/_variables.scss' as v;

body {
    margin: 0;
    overflow-x: hidden;
}

.animate__fadeIn {
    --animate-duration: 200ms;
    --animate-delay: 0.1s;
}

#canvas {
    margin: 0;
    padding: 0;
    offset: 0;
    position: relative;
}

.home-page {
    z-index: auto;
}

.custom-card {
    border-radius: 20px !important;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    width: 300px !important;

    &__tag {
        background: v.$tersan-main-color;
        border-radius: 20px 20px 0 0;
        font-size: 16px;
        margin: 0;
        color: #fff;
        padding: 15px 10px;
        text-transform: uppercase;
        text-align: center;
    }

    &__link {
        color: v.$main-white;
        font-weight: 600;
        text-decoration: none;
        padding: 10px;
        border-radius: 10px;
        background-color: v.$tersan-main-color;
        width: 50%;
        text-align: center;
        transition: background-color 0.15s ease-in-out;

        &:hover {
            color: v.$main-color-hover;
            background-color: v.$btn-toolbar-active-bg-color;
        }
    }
}
</style>

