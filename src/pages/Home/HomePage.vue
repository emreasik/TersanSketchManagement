<script>
import Toolbar from '../../components/common/appItems/Toolbar/Toolbar.vue'
import LocationToolbarIcon from '../../assets/icons/location_marker_icon.png';
import CursorToolbarIcon from '../../assets/icons/cursor_icon.png';
import LocationMapIcon from '../../assets/icons/location_map_icon.png';
import LocationMapIconClicked from '../../assets/icons/location_map_icon_clicked.png';
import { buildingService } from '../../services/ApiService.js';
import { Modal } from 'bootstrap'
import { ElNotification } from 'element-plus'
import toastMessages from '../../helpers/toastConstants.js'

export default {
    name: 'HomePage',
    components: {
        Toolbar,
    },
    data() {
        return {
            icons: [],
            buildingDetails: {},
            markPoints: [],
            isSketchMode: false,
            serviceMarkPoints: [],
            clickedPoint: {},
            sketchImage : new Image(),
            locationMapIcon : new Image(),
            locationMapIconClicked : new Image(),
        }
    },
    async created() {
        //init
        this.setInitialIcons();
        this.setInitialBuildingDetails();
        await this.setMarkPoints();
        this.setInitialClickIcons();
    },
    mounted() {
        this.setSketchImage();  
    },
    methods: {
        async setMarkPoints() {
            this.markPoints = (await buildingService.getBuildings()).data;
            this.drawMarkPoints()
        },
        setSketchImage() {
            this.sketchImage.src = new URL('../../assets/images/sketch.jpg', import.meta.url);

            this.sketchImage.onload = () => {
                this.sketchImage.height = (window.innerWidth / this.sketchImage.width) * this.sketchImage.height;
                this.sketchImage.width = window.innerWidth;
                this.drawCanvas(this.sketchImage);
            };
        },
        setInitialBuildingDetails() {
            this.buildingDetails = {
                id: 0,
                name: '',
                x: 0,
                y: 0,
                sketchId: 1,
            }
        },
        setInitialClickIcons() {
            this.locationMapIcon.src = LocationMapIcon;
            this.locationMapIconClicked.src = LocationMapIconClicked;
        },
        handleCanvasClick(event) {
            const x = event.pageX - this.$refs.canvas.offsetLeft;
            const y = event.pageY - this.$refs.canvas.offsetTop;

        this.openModal('exampleModal');

            this.buildingDetails.x = x - 15;
            this.buildingDetails.y = y - 25;
        },
        openModal(modalName) {
            let myModal = new Modal(document.getElementById(modalName), {});
            myModal.show();
        },
        openUpdateModal() {
            this.openModal('buildingUpdateModal');
            this.updateBuildingVariables();
        },
        updateBuildingVariables() {
            const building = this.markPoints.find(point => point.id === this.buildingDetails.id);
            this.buildingDetails.name = building.name;
            this.buildingDetails.x = building.x;
            this.buildingDetails.y = building.y;
        },
        async addNewBuilding() {
            let result = await buildingService.addBuilding(this.buildingDetails);
            
                if (!!result.isCreated) {
                    this.markPoints.push({
                        id: result.id,
                        name: result.name,
                        x: result.x,
                        y: result.y,
                    });
                    this.drawMarkPoints();
                    this.successToast();
                }
        },
        async updateBuilding() {
            let result = await buildingService.updateBuilding(this.buildingDetails)
                if (!!result.isUpdated) {
                    this.markPoints = this.markPoints.filter(point => point.id !== result.id);
                    this.markPoints.push({
                        id: result.id,
                        name: result.name,
                        x: result.x,
                        y: result.y,
                    });
                    this.clickedPoint = result
                    // draw gerekebilir eğer point değişirse
                    //TODO: draw
                }
        },
        handleCanvasCursor(event) {
            const x = event.pageX - this.$refs.canvas.offsetLeft;
            const y = event.pageY - this.$refs.canvas.offsetTop;

            const ctx = this.$refs.canvas.getContext("2d")

            const card = document.querySelector('.card');
            let isClickedOnPoint = false;

            this.markPoints.forEach(point => {
                if (Math.abs(point.x - x) <= 30 && Math.abs(point.y - y) <= 30) {
                    ctx.drawImage(this.locationMapIconClicked, point.x, point.y, 30, 30);
                    card.style.left = `${parseInt(point.x) + 20}px`;
                    card.style.top = `${parseInt(point.y) + 25}px`;
                    card.classList.remove('d-none');
                    isClickedOnPoint = true;
                    this.clickedPoint = point;

                    // update building Id
                    this.buildingDetails.id = point.id;
                } else {
                    ctx.drawImage(this.locationMapIcon, point.x, point.y, 30, 30);
                }
                if (!isClickedOnPoint) {
                    card.classList.add('d-none');
                }
            });
        },
        drawMarkPoints() {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext('2d');

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
        },
        successToast() {
            ElNotification(toastMessages.SUCCCESS('Bina'))
        },
        errorToast() {
            ElNotification(toastMessages.ERROR('Bina'))
        },
        setInitialIcons() {
            this.icons = [
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
            ];
        },
        
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
                <h6 class="custom-card__tag">{{ clickedPoint.name }}</h6>
                <div class="card-body">
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                        the card's content.</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">An item</li>
                    <li class="list-group-item">A second item</li>
                </ul>
                <div class="card-body d-flex justify-content-center">
                    <button class="card-link custom-card__link" @click="openUpdateModal">Düzenle</button>
                    <button class="card-link custom-card__link">Kroki</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Add Building Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-main-color">
                    <h5 class="modal-title text-white" id="exampleModalLabel">Yeni Bina Ekle</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="recipient-name" class="col-form-label">Bina Adı</label>
                            <input type="text" class="form-control" id="recipient-name" v-model="buildingDetails.name">
                        </div>
                        <div class="mb-3">
                            <div class="d-flex gap-3">
                                <div class="d-flex input-group flex-nowrap">
                                    <span class="input-group-text " id="addon-wrapping">X</span>
                                    <input type="text" class="form-control shadow-none" :value="buildingDetails.x"
                                        aria-label="Username" aria-describedby="addon-wrapping">
                                </div>
                                <div class="d-flex input-group flex-nowrap">
                                    <span class="input-group-text" id="addon-wrapping">Y</span>
                                    <input type="text" class="form-control shadow-none" :value="buildingDetails.y"
                                        aria-label="Username" aria-describedby="addon-wrapping">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                    <button type="button" class="btn bg-main-color text-white" @click="addNewBuilding"
                        data-bs-dismiss="modal">Kaydet</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Update Building Modal -->
    <div class="modal fade" id="buildingUpdateModal" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-main-color">
                    <h5 class="modal-title text-white" id="exampleModalLabel">Bina Düzenle</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="recipient-name" class="col-form-label">Bina Adı</label>
                            <input type="text" class="form-control" id="recipient-name" v-model="buildingDetails.name">
                        </div>
                        <div class="mb-3">
                            <div class="d-flex gap-3">
                                <div class="d-flex input-group flex-nowrap">
                                    <span class="input-group-text " id="addon-wrapping">X</span>
                                    <input type="text" class="form-control shadow-none" :value="buildingDetails.x"
                                        aria-label="Username" aria-describedby="addon-wrapping">
                                </div>
                                <div class="d-flex input-group flex-nowrap">
                                    <span class="input-group-text" id="addon-wrapping">Y</span>
                                    <input type="text" class="form-control shadow-none" :value="buildingDetails.y"
                                        aria-label="Username" aria-describedby="addon-wrapping">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">İptal</button>
                    <button type="button" class="btn bg-main-color text-white" @click="updateBuilding"
                        data-bs-dismiss="modal">Kaydet</button>
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

.bg-main-color {
    background-color: v.$tersan-main-color !important;
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

