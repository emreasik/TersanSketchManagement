<template>
    <div class="modal-body">
        <form>
            <label for="">{{ inputDetails }}</label>
            <label for="">{{ setInputDatas }}</label>
            <div class="mb-3">
                <label for="recipient-name" class="col-form-label"> {{ modalBodyLabel }}</label>
                <input type="text" class="form-control" v-model="inputDetails.name" @input="emitData">
            </div>
            <div class="mb-3">
                <div class="d-flex gap-3">
                    <div class="d-flex input-group flex-nowrap">
                        <span class="input-group-text " id="addon-wrapping">{{ modalBodyInputSpanX }}</span>
                        <input type="text" class="form-control shadow-none" v-model="inputDetails.x" @input="emitData"
                            aria-label="Username" aria-describedby="addon-wrapping">
                    </div>
                    <div class="d-flex input-group flex-nowrap">
                        <span class="input-group-text" id="addon-wrapping"> {{ modalBodyInputSpanY }}</span>
                        <input type="text" class="form-control shadow-none" v-model="inputDetails.y" @input="emitData"
                            aria-label="Username" aria-describedby="addon-wrapping">
                    </div>
                </div>
            </div>
            <div class="svg-color-container">
                <div class="svg-color-container__marker">
                    <SketchMarkerIcon :svgColor="markerColor" className="svg-color-container__marker__component" />
                </div>
                <div class="svg-color-container__picker">
                    <input class="svg-color-container__picker__input" v-model="markerColor" type="color" id="favcolor"
                        name="favcolor" />
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import SketchMarkerIcon from '../../../assets/icons/SketchMarkerIconSVG.vue';

export default {
    name: 'ModalBody',
    data() {
        return {
            markerColor: this.markerSvgColor,
            inputs: {}
        }
    },
    computed: {
        setInputDatas() {
            return this.inputs = this.inputDetails;
        }
    },
    components: {
        SketchMarkerIcon,
    },
    props: {
        modalBodyLabel: {
            type: String,
            required: true
        },
        modalBodyInputSpanX: {
            type: String,
            required: true
        },
        modalBodyInputSpanY: {
            type: String,
            required: true
        },
        markerSvgColor: {
            type: String,
            required: true
        },
        inputDetails: {
            type: Object,
            required: true
        }
    },
    methods: {
        emitData() {
            this.$emit('inputData', this.inputs);
        }
    },
}
</script>