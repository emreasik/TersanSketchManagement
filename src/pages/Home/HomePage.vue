<script>
import Toolbar from '../../components/common/appItems/Toolbar/Toolbar.vue'
import DrawLineSettingsBar from '../../components/common/appItems/DrawLineItems/DrawLineSettingsBar.vue';
import ToolbarLocationIcon from '../../assets/icons/location_marker_icon.png';
import ToolbarCursorIcon from '../../assets/icons/cursor_icon.png';
import ToolbarSketchIcon from '../../assets/icons/sketch_icon.png';
import ToolbarAddIcon from '../../assets/icons/add_icon.png';
import ToolbarListIcon from '../../assets/icons/list_icon.png';
import ShipIcon from '../../assets/icons/shipIcon.png';
import Ship from '../../assets/icons/ship.png';
import ToolBarCreateRestrictionIcon from '../../assets/icons/create_restriction_icon.png';

import LocationMapIcon from '../../assets/icons/location_map_icon.png';
import LocationMapIconClicked from '../../assets/icons/location_map_icon_clicked.png';
import { buildingService, shipService } from '../../services/ApiService.js';
import { Modal } from 'bootstrap'
import { ElNotification } from 'element-plus'
import toastMessages from '../../helpers/toastConstants.js'
import { fillSvgColor, svgConvertToBase64 } from '../../helpers/Svg/svgConstants.js'

import SketchMarkerIcon from '../../assets/icons/SketchMarkerIconSVG.vue';
import { DrawLine } from '../../helpers/Canvas';
import BuildingModalComponent from '../../components/common/modal/BuildingModal.vue';
import ModalComponent from '../../components/common/modal/Common/Modal.vue';
import ShipAddContent from '../../components/common/modal/ShipAddContent.vue';
import { addBuildingLabels, updateBuildingLabels } from '../../components/common/modal/constants/labels.js'


export default {
    name: 'HomePage',
    components: {
        Toolbar,
        SketchMarkerIcon,
        BuildingModalComponent,
        DrawLineSettingsBar,
        ModalComponent,
        ShipAddContent
    },
    data() {
        return {
            icons: [],
            sketchIcons: [],
            buildingDetails: {},
            buildingDetailsForUpdate: {},
            markPoints: [],
            previousMarkPoint: {},
            isSketchMode: false,
            isDrawMode: false,
            isShipMode: false,
            drawLine: null,
            serviceMarkPoints: [],
            clickedPoint: {},
            sketchImage: new Image(),
            locationMapIcon: new Image(),
            locationMapIconClicked: new Image(),
            markerColor: "#E74C3C",
            modalAddBuildingDetails: addBuildingLabels(),
            modalUpdateBuildingDetails: updateBuildingLabels(),
            isDrawLineVisible: false,
            // TODO: Move to constants
            scale: 1,
            shipModel: {
                name: '',
                shipStatusId: 1
            },
            ships: [],

        }
    },
    created() {
        //init
        this.setInitialIcons();
        this.setInitialSketchIcons();
        this.setInitialBuildingDetails();
    },
    async mounted() {
        await this.setSketchImage();
        this.setDrawLine();
        await this.setMarkPoints();
        this.setInitialClickIcons();
        await this.setShips();
    },
    methods: {
        setDrawLine() {
            this.drawLine = new DrawLine(this.$refs.canvas);
        },
        handleClickDrawMode(event) {
            let clickedPoint = {
                x: event.offsetX,
                y: event.offsetY
            }
            this.drawLine.setDrawLine(clickedPoint, event.ctrlKey);

        },

        handleClickShipDrawMode(event) {
            let clickedPoint = {
                x: event.offsetX,
                y: event.offsetY
            }
            this.drawLine.setDrawLine(clickedPoint, event.ctrlKey);
            // set image to canvas
            if (this.drawLine.hasEnoughEdgesForRectangle()) {
                console.log("has enough points");
                this.openModal(this.$refs.AddShipModalComponent.$el);

            }
        },

        async setMarkPoints() {
            this.markPoints = (await buildingService.getBuildings()).data;
            // this.markPoints.forEach((markPoint) => {
            //     let image = new Image();
            //     image.src = svgConvertToBase64(markPoint.hexColorCode);
            //     markPoint.hexColorCodeImage = image;
            // });
            this.drawMarkPoints();
        },
        async setShips() {
            this.ships = (await shipService.getShips()).data;
            this.drawShips();
        },
        setSketchImage() {
            this.sketchImage.src = new URL('../../assets/images/sketch2.jpg', import.meta.url);

            return new Promise((resolve, reject) => {
                this.sketchImage.onload = () => {
                    this.sketchImage.height = import.meta.env.VITE_APP_SCREEN_HEIGHT;
                    this.sketchImage.width = import.meta.env.VITE_APP_SCREEN_WIDTH;
                    this.drawCanvas(this.sketchImage);
                    resolve();
                };
                this.sketchImage.onerror = (err) => {
                    reject(err);
                };
            });
        },
        setInitialBuildingDetails() {
            this.buildingDetails = {
                id: 0,
                name: '',
                x: 0,
                y: 0,
                hexColorCode: this.markerColor,
                sketchId: 1,
            }
        },
        setInitialClickIcons() {
            this.locationMapIcon.src = LocationMapIcon;
            this.locationMapIconClicked.src = LocationMapIconClicked;
        },
        handleCanvasClick(event) {
            // const x = event.pageX - this.$refs.canvas.offsetLeft;
            // const y = event.pageY - this.$refs.canvas.offsetTop;
            const x = event.offsetX;
            const y = event.offsetY;
            //find the point o canvas
            console.log(x, y);
            console.log(this.buildingDetailsForUpdate);
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
            this.openModal(this.$refs.UpdateModalComponent.$el);
            this.updateBuildingVariablesWhenUpdateModalOpen();
        },
        updateBuildingVariablesWhenUpdateModalOpen() {
            const building = this.markPoints.find(point => point.id === this.buildingDetails.id);
            this.buildingDetailsForUpdate = { ...building };
        },
        async addNewBuilding() {
            let result = await buildingService.addBuilding(this.buildingDetails);
            if (!!result.isCreated) {
                this.markPoints.push({
                    id: result.id,
                    name: result.name,
                    x: result.x,
                    y: result.y,
                    hexColorCode: result.hexColorCode
                });
                this.drawMarkPoints();
                this.buildingDetails = {
                    id: 0,
                    name: '',
                    x: 0,
                    y: 0,
                    hexColorCode: this.markerColor,
                    sketchId: 1,
                };
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
                    hexColorCode: result.hexColorCode
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
            this.drawCanvas(this.sketchImage);
            this.drawMarkPoints();
            this.drawShips();
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
            // const x = event.pageX - this.$refs.canvas.offsetLeft;
            // const y = event.pageY - this.$refs.canvas.offsetTop;

            const x = event.offsetX;
            const y = event.offsetY;
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
                    this.decideCardPosition(20, 25,3);

                    // update building Id
                    this.buildingDetails.id = point.id;
                } else {
                    ctx.drawImage(this.locationMapIcon, point.x, point.y, 30, 30);
                }
                if (!isClickedOnPoint) {
                    card.classList.add('d-none');
                }
            });
            this.ships.forEach(ship => {
                if (((x-ship.x) <= ship.width && (x-ship.x) > 0) && ( (y-ship.y) <= ship.height) && (y-ship.y) > 0) {
                    isClickedOnPoint = true;
                    this.clickedPoint = {
                        x: ship.x,
                        y: ship.y
                    }
                    this.decideCardPosition(ship.width, ship.height,3);
                    card.classList.remove('d-none');
                } else {
                }
                if (!isClickedOnPoint) {
                    card.classList.add('d-none');
                }
            });
        },

        decideCardPosition(x,y,factor) {
            let left = this.clickedPoint.x + x;
            let top = this.clickedPoint.y + y;
            let card = document.querySelector('.card');
            
            if(left + 100 > import.meta.env.VITE_APP_SCREEN_WIDTH) {
                
                left = this.clickedPoint.x - 100*factor;
               
            }
            if(top + 100 > import.meta.env.VITE_APP_SCREEN_HEIGHT){

                    top = this.clickedPoint.y - 100*factor;
            }
            this.setCardPosition(card, left, top);
            
        },
        setCardPosition(card,x,y) {
            card.style.left = `${x}px`;
            card.style.top = `${y}px`;
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

            // this.markPoints.forEach(point => {
            //     const img = new Image();
            //     const hexColorCode = point.hexColorCode;
            //     const x = point.x;
            //     const y = point.y;
            //     // let svg = fillSvgColor(hexColorCode);

            //     // img.id = point.id;

            //     // img.style.fill = point.hexColorCode;
            //     this.locationMapIconClicked.onload = () => {
            //         ctx.drawImage(this.locationMapIconClicked, x, y, 30, 30);
            //     };
            //     // img.src = ShipIcon
            // });

            // this.markPoints.forEach(point => {
            //     let img = point.hexColorCodeImage;
            //     ctx.drawImage(img, point.x, point.y, 30, 30);
            // });
        },
        drawShips() {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.src = Ship;


            img.onload = () => {
                this.ships.forEach(ship => {
                    ctx.drawImage(img, ship.x, ship.y, ship.width, ship.height);
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
            this.icons.forEach(icon => {
                icon.active = icon.id === id;
            });
            if (id === 2) {
                this.isDrawMode = false;
                this.isSketchMode = true;
                this.isDrawLineVisible = false;
                this.isShipMode = false;
            }
            else if (id === 4) {
                this.isDrawMode = true;
                this.isSketchMode = false;
                this.isShipMode = false;
                this.isDrawLineVisible = true;
            }
            else if (id === 5) {
                this.isDrawMode = false;
                this.isSketchMode = false;
                this.isDrawLineVisible = true;
                this.isShipMode = true;
            }
            else {
                this.isShipMode = false;
                this.isSketchMode = false;
                this.isDrawMode = false;
                this.isDrawLineVisible = false;
            }
        },
        resetCanvas() {
            if (this.drawLine.reset()) {
                this.canvasRefresh();
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
                    id: 4,
                    path: ToolBarCreateRestrictionIcon,
                    active: false,
                },
                {
                    id: 5,
                    path: ShipIcon,
                    active: false,
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
        scalePage(event) {
            event.preventDefault();
            if (event.deltaY > 0 && this.scale > 1) {
                this.scale -= 0.1;
            } else if (event.deltaY < 0) {
                this.scale += 0.1;
            }
            else {
                this.scale = 1;
            }
            this.$refs.homepage.style.transform = `scale(${this.scale})`;
            this.$refs.homepage.style.transformOrigin = event.pageX + 'px ' + event.pageY + 'px';
        },
        async addShip() {
            let img = new Image();
            img.src = Ship;

            let startPoint = this.drawLine.getStartPointOfRectangle();
            let size = this.drawLine.calculateWidthAndHeightOfRectangle();
            img.onload = () => {
                this.drawLine.pushImageToRectangleField(img, () => this.resetCanvas());
            }
            let result = await shipService.addShip({
                ...this.shipModel,
                ...startPoint,
                ...size
            });
            this.ships.push(result);
            this.shipModel = {};
        },
        cancelAddShip() {
            console.log('cancel');
            this.shipModel = {};
        },
    }
}
</script>

<template>
    <div class="home-page">
        <DrawLineSettingsBar :is-visible='isDrawLineVisible' @reset-draw-line="resetCanvas" />
        <Toolbar :icons="icons" :sketchIcons="sketchIcons" @tool-button-clicked="setToolButtonActive" />
        <div class="position-relative" v-on:wheel="scalePage($event)" ref="homepage">
            <canvas class="position-absolute" ref="canvas"
                v-on="isSketchMode ? { click: handleCanvasClick } : isDrawMode ? { click: handleClickDrawMode } : isShipMode ? { click: handleClickShipDrawMode } : { click: handleCanvasCursor }">
            </canvas>
            <div class="custom-card card position-absolute d-none animate__animated animate__fadeIn"
                style="width: 18rem;">
                <h6 class="custom-card__tag">{{ clickedPoint.name }}</h6>
                <div class="card-body">
                    <p class="card-text">Some informations about this building.</p>
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
    <BuildingModalComponent ref="AddModalComponent" :modalTypeDetails="modalAddBuildingDetails"
        :inputDetails="buildingDetails" :footerButtonFuction="addNewBuilding">
    </BuildingModalComponent>
    <BuildingModalComponent ref="UpdateModalComponent" :modalTypeDetails="modalUpdateBuildingDetails"
        :inputDetails="buildingDetailsForUpdate" :footerButtonFuction="updateBuilding"
        :footerDeleteButtonFuction="deleteBuilding">
    </BuildingModalComponent>
    <ModalComponent ref="AddShipModalComponent" :title="'deneme'" @save="addShip()" @cancel="cancelAddShip()">
        <ShipAddContent :shipModel="shipModel" />
    </ModalComponent>
</template>

<style lang="scss">
@use '../../assets/_variables.scss' as v;

body {
    margin: 0;
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

