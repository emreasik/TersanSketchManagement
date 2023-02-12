<script>
import Toolbar from '../../components/common/appItems/Toolbar/Toolbar.vue'
import ToolbarLocationIcon from '../../assets/icons/location_marker_icon.png';
import ToolbarCursorIcon from '../../assets/icons/cursor_icon.png';
import ToolbarSketchIcon from '../../assets/icons/sketch_icon.png';
import ToolbarAddIcon from '../../assets/icons/add_icon.png';
import ToolbarListIcon from '../../assets/icons/list_icon.png';

import LocationMapIcon from '../../assets/icons/location_map_icon.png';
import LocationMapIconClicked from '../../assets/icons/location_map_icon_clicked.png';
import { buildingService } from '../../services/ApiService.js';
import { Modal } from 'bootstrap'
import { ElNotification } from 'element-plus'
import toastMessages from '../../helpers/toastConstants.js'
import SketchMarkerIcon from '../../assets/icons/SketchMarkerIconSVG.vue';
import ModalComponent from '../../components/common/modal/Modal.vue';
import { addBuildingLabels } from '../../components/common/modal/constants/labels.js'
import { updateBuildingLabels } from '../../components/common/modal/constants/labels.js'

export default {
    name: 'HomePage',
    components: {
        Toolbar,
        SketchMarkerIcon,
        ModalComponent
    },
    data() {
        return {
            icons: [],
            sketchIcons: [],
            buildingDetails: {},
            buildingDetailsForUpdate: {},
            markPoints: [],
            isSketchMode: false,
            serviceMarkPoints: [],
            clickedPoint: {},
            sketchImage: new Image(),
            locationMapIcon: new Image(),
            locationMapIconClicked: new Image(),
            markerColor: "#E74C3C",
            isModalAddType: false,
            modalAddBuildingDetails: addBuildingLabels(),
            modalUpdateBuildingDetails: updateBuildingLabels(),
        }
    },
    async created() {
        //init
        this.setInitialIcons();
        this.setInitialSketchIcons();
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

            this.isModalAddType = true;
            this.openModal(this.$refs.AddModalComponent.$el);

            this.buildingDetails.x = x - 15;
            this.buildingDetails.y = y - 25;
        },
        openModal(modalRefence) {
            let modal = new Modal(modalRefence);
            modal.show();
        },
        closeCard() {
            const card = document.querySelector('.card');
            card.classList.add('d-none');
        },
        openUpdateModal() {
            this.isModalAddType = false;
            this.openModal(this.$refs.UpdateModalComponent.$el);
            this.updateBuildingVariables();
        },
        updateBuildingVariables() {
            const building = this.markPoints.find(point => point.id === this.buildingDetails.id);
            this.buildingDetailsForUpdate.id = building.id;
            this.buildingDetailsForUpdate.name = building.name;
            this.buildingDetailsForUpdate.x = building.x;
            this.buildingDetailsForUpdate.y = building.y;
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
                this.buildingDetails = {};
                this.successToastAdd('Bina');
            } else {
                this.errorToastAdd('Bina');
            }
        },
        async updateBuilding() {
            let result = await buildingService.updateBuilding(this.buildingDetailsForUpdate)
            if (!!result.isUpdated) {
                console.log(typeof result.isUpdated);
                this.markPoints = this.markPoints.filter(point => point.id !== result.id);
                this.markPoints.push({
                    id: result.id,
                    name: result.name,
                    x: result.x,
                    y: result.y,
                });
                this.clickedPoint = result;

                this.buildingDetailsForUpdate = {};
                this.closeCard();
                this.canvasRefresh();
                this.successToastUpdate('Bina');
            } else {
                this.errorToastUpdate('Bina');
            }
        },
        canvasRefresh() {
            console.log(this.markPoints);
            this.drawCanvas(this.sketchImage);
            this.drawMarkPoints();
        },
        async deleteBuilding() {
            let result = await buildingService.deleteBuilding(this.buildingDetails.id);
            if (result.isDeleted) {
                this.markPoints = this.markPoints.filter(point => point.id !== result.id);
                this.closeCard();
                this.canvasRefresh();
                this.successToastDelete('Bina');
            } else {
                this.errorToastDelete('Bina');
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
        successToastAdd(constructorType) {
            ElNotification(toastMessages.SUCCCESS_ADD(constructorType))
        },
        successToastUpdate(constructorType) {
            ElNotification(toastMessages.SUCCCESS_UPDATE(constructorType))
        },
        successToastDelete(constructorType) {
            ElNotification(toastMessages.SUCCCESS_DELETE(constructorType))
        },
        errorToastAdd(constructorType) {
            ElNotification(toastMessages.ERROR_ADD(constructorType))
        },
        errorToastDelete(constructorType) {
            ElNotification(toastMessages.ERROR_DELETE(constructorType))
        },
        errorToastUpdate(constructorType) {
            ElNotification(toastMessages.ERROR_UPDATE(constructorType))
        },
        setInitialIcons() {
            this.icons = [
                {
                    id: 1,
                    path: ToolbarCursorIcon,
                    active: true
                },
                {
                    id: 2,
                    path: ToolbarLocationIcon,
                    active: false
                },
                {
                    id: 3,
                    path: ToolbarSketchIcon,
                    active: false,
                }
            ];
        },
        setInitialSketchIcons() {
            this.sketchIcons = [
                {
                    id: 1,
                    path: ToolbarAddIcon,
                },
                {
                    id: 2,
                    path: ToolbarListIcon,
                }
            ];
        },
    }
}
</script>

<template>
    <div class="home-page">
        <Toolbar :icons="icons" :sketchIcons="sketchIcons" @tool-button-clicked="setToolButtonActive" />
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
    <ModalComponent ref="AddModalComponent" :modalTypeDetails="modalAddBuildingDetails" :markerSvgColor="markerColor"
        :inputDetails="buildingDetails" :footerButtonFuction="addNewBuilding"></ModalComponent>
    <ModalComponent ref="UpdateModalComponent" :modalTypeDetails="modalUpdateBuildingDetails"
        :markerSvgColor="markerColor" :inputDetails="buildingDetailsForUpdate" :footerButtonFuction="updateBuilding" :footerDeleteButtonFuction="deleteBuilding">
    </ModalComponent>
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

.svg-color-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #faf5f5;
    padding: 5px;

    &__marker {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        &__component {
            width: 100px;
            height: 100px;
        }
    }

    &__picker {
        width: 50%;
        display: flex;
        justify-content: flex-start;

        &__input {
            width: 60px;
            height: 50px;
        }
    }
}
</style>

