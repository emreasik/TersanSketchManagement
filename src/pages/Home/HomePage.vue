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
import SVGMarkerIcon from '../../assets/icons/mysvg.svg';

import { buildingService } from '../../services/ApiService.js';
import { Modal } from 'bootstrap'
import { ElNotification } from 'element-plus'
import toastMessages from '../../helpers/toastConstants.js'
import SketchMarkerIcon from '../../assets/icons/SketchMarkerIconSVG.vue';
import {DrawLine} from '../../helpers/Canvas';
import ModalComponent from '../../components/common/modal/Modal.vue';
import { addBuildingLabels } from '../../components/common/modal/constants/labels.js'
import { updateBuildingLabels } from '../../components/common/modal/constants/labels.js'


export default {
    name: 'HomePage',
    components: {
        Toolbar,
        SketchMarkerIcon,
        ModalComponent,
        DrawLineSettingsBar
    },
    data() {
        return {
            icons: [],
            sketchIcons: [],
            buildingDetails: {},
            buildingDetailsForUpdate: {},
            markPoints: [],
            isSketchMode: false,
            isDrawMode: false,
            isShipMode: false,
            drawLine:null,
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
            scale : 1
           
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
    async mounted() {
        await this.setSketchImage();
        this.setDrawLine();

    },
    methods: {
        setDrawLine(){
            this.drawLine = new DrawLine(this.$refs.canvas);
        },
        handleClickDrawMode(event) {
            let clickedPoint = {
                x:event.offsetX,
                y:event.offsetY            }
            this.drawLine.setDrawLine(clickedPoint,event.ctrlKey);
            
        },

        handleClickShipDrawMode(event) {
            let clickedPoint = {
                x:event.offsetX,
                y:event.offsetY           
            }
            this.drawLine.setDrawLine(clickedPoint,event.ctrlKey);
            // set image to canvas
            if(this.drawLine.hasEnoughPointsForRectangle()){
                let img = new Image();
                img.src = Ship;
                img.onload = () => {
                    this.drawLine.pushImageToRectangleField(img,()=>this.resetCanvas());
                }
            }
        },

        async setMarkPoints() {
            this.markPoints = (await buildingService.getBuildings()).data;
            this.drawMarkPoints()

        },
        setSketchImage() {
            this.sketchImage.src = new URL('../../assets/images/sketch2.jpg', import.meta.url);

            

            return new Promise((resolve, reject) => {
                this.sketchImage.onload = () => {
                this.sketchImage.height = 1240;
                this.sketchImage.width = 1920;
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
        setBuildingDetailsFromModalComponent(updateBuildingData) {
            console.log(updateBuildingData);
            this.buildingDetailsForUpdate = updateBuildingData;
            console.log(this.buildingDetailsForUpdate);
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
            this.updateBuildingVariables();
        },
        updateBuildingVariables() {
            console.log("updateBuildingVariables", this.buildingDetailsForUpdate);
            const building = this.markPoints.find(point => point.id === this.buildingDetails.id);
            console.log(building);
            this.buildingDetailsForUpdate.id = building.id;
            this.buildingDetailsForUpdate.name = building.name;
            this.buildingDetailsForUpdate.x = building.x;
            this.buildingDetailsForUpdate.y = building.y;
            console.log("updateBuildingVariables", this.buildingDetailsForUpdate);
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

            // const img = new Image();
            // img.src = SVGMarkerIcon;
            // console.log(img.src);

            // img.onload = () => {
            //     this.markPoints.forEach(point => {
            //         img.id = point.id;
            //         img.style.fill = "#FFFFFF";
            //         console.log(img.style);
            //         ctx.drawImage(img, point.x, point.y, 30, 30);
            //     });
            // }

            this.markPoints.forEach(point => {
                const img = new Image();
                const x = point.x;
                const y = point.y;
                const svg = `
                <svg style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="_x32_3_x2C__Location_x2C__map_x2C__pin_x2C__mark_x2C__navigation"><g>
                <path d="M256,32.7c85.36,0,154.53,69.2,154.53,154.53c0,64-114.82,220.49-154.53,292.07    c-38.07-68.7-154.53-231.83-154.53-292.07C101.47,101.9,170.67,32.7,256,32.7z M325.07,181.41c0-38.03-31.02-69.05-69.07-69.05    c-38.02,0-69.04,31.02-69.04,69.05c0,38.02,31.02,69.04,69.04,69.04C294.05,250.45,325.07,219.43,325.07,181.41z" 
                style="fill:${point.hexColorCode};"/>
                <path d="M256,489.3c-0.001,0-0.001,0-0.002,0c-3.635-0.001-6.982-1.974-8.745-5.153c-10.098-18.222-25.631-42.934-43.617-71.547    C153.663,333.102,91.47,234.162,91.47,187.23C91.47,96.508,165.278,22.7,256,22.7s164.53,73.808,164.53,164.53    c0,49.378-58.682,141.696-110.456,223.147c-17.792,27.99-34.597,54.428-45.33,73.774C262.981,487.328,259.634,489.3,256,489.3z     M256,42.7c-79.694,0-144.53,64.836-144.53,144.53c0,41.168,63.056,141.481,109.098,214.726    c13.602,21.64,25.813,41.065,35.442,57.316c10.349-17.405,23.477-38.059,37.186-59.625    C338.493,328.386,400.53,230.79,400.53,187.23C400.53,107.536,335.694,42.7,256,42.7z"/>
                <path d="M256,260.45c-43.583,0-79.04-35.457-79.04-79.04c0-43.588,35.457-79.05,79.04-79.05c43.599,0,79.07,35.462,79.07,79.05    C335.07,224.993,299.599,260.45,256,260.45z M256,122.36c-32.555,0-59.04,26.49-59.04,59.05c0,32.555,26.485,59.04,59.04,59.04    c32.571,0,59.07-26.485,59.07-59.04C315.07,148.85,288.571,122.36,256,122.36z"/></g></g><g id="Layer_1"/>
                </svg>`;

                // img.id = point.id;

                // img.src = (SVGMarkerIcon);

                // img.style.fill = point.hexColorCode;
                img.onload = () => {
                    ctx.drawImage(img, x, y, 30, 30);
                };
                img.src = 'data:image/svg+xml;base64,' + btoa(svg);
            });
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
                this.isDrawMode = false;
                this.isSketchMode = true;
                this.isDrawLineVisible = false;
            }
            else if (id === 4) {
                this.isDrawMode = true;
                this.isSketchMode = false;
                this.isDrawLineVisible = true;
            }
            else if(id === 5)
            {
                this.isDrawMode = false;
                this.isSketchMode = false;
                this.isDrawLineVisible = true;
                this.isShipMode = true;
            }
             else {
                this.isSketchMode = false;
                this.isDrawMode = false;
                this.isDrawLineVisible = false;
            }
        },
        resetCanvas(){
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
                    id : 4,
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
            } else if(event.deltaY < 0 ) {
                this.scale += 0.1;
            }
            else{
                this.scale = 1;
            }
            this.$refs.homepage.style.transform = `scale(${this.scale})`;
            this.$refs.homepage.style.transformOrigin = event.pageX + 'px ' + event.pageY + 'px';
        },

        
    }
}
</script>

<template>
    <div class="home-page">
        <DrawLineSettingsBar :is-visible='isDrawLineVisible' @reset-draw-line="resetCanvas"/>
        <Toolbar :icons="icons" :sketchIcons="sketchIcons" @tool-button-clicked="setToolButtonActive" />
        <div class="position-relative" v-on:wheel="scalePage($event)" ref="homepage">
            <canvas class="position-absolute" ref="canvas"
                v-on="isSketchMode ? { click: handleCanvasClick } : isDrawMode ? {click : handleClickDrawMode} : isShipMode ? {click : handleClickShipDrawMode} : { click: handleCanvasCursor }">
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
    <ModalComponent ref="AddModalComponent" :modalTypeDetails="modalAddBuildingDetails" :markerSvgColor="markerColor"
        :inputDetails="buildingDetails" :footerButtonFuction="addNewBuilding"></ModalComponent>
    <ModalComponent ref="UpdateModalComponent" @input-data="setBuildingDetailsFromModalComponent"
        :modalTypeDetails="modalUpdateBuildingDetails" :markerSvgColor="markerColor"
        :inputDetails="buildingDetailsForUpdate" :footerButtonFuction="updateBuilding"
        :footerDeleteButtonFuction="deleteBuilding">
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

