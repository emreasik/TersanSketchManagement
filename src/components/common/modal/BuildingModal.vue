<template>
    <div class="modal fade" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <BuildingModalHeader :modalHeaderTitle="modalTypeDetails.modalHeaderLabel"></BuildingModalHeader>
                <BuildingModalBody :modalBodyLabel="modalTypeDetails.modalBodyLabel"
                    :modalBodyInputSpanX="modalTypeDetails.modalBodyInputSpanX"
                    :modalBodyInputSpanY="modalTypeDetails.modalBodyInputSpanY" :inputDetails="inputDetails">
                </BuildingModalBody>
                <BuildingMoodalFooter :firstButtonLabel="modalTypeDetails.modalFooterFirstButton"
                    :secondButtonLabel="modalTypeDetails.modalFooterSecondButton" :buttonFunction="footerButtonFuction"
                    :buttonDeleteFunction="footerDeleteButtonFuction">
                </BuildingMoodalFooter>
            </div>
        </div>
    </div>
</template>

<script>
import BuildingModalHeader from './BuildingModalHeader.vue';
import BuildingModalBody from './BuildingModalBody.vue';
import BuildingMoodalFooter from './BuildingModalFooter.vue';

export default {
    name: 'BuildingModalComponent',
    components: {
        BuildingModalHeader,
        BuildingModalBody,
        BuildingMoodalFooter
    },
    created() {
    },
    props: {
        modalTypeDetails: {
            type: Object,
            required: true
        },
        footerButtonFuction: {
            type: Function,
            required: true
        },
        footerDeleteButtonFuction: {
            type: Function,
            required: true
        },
        inputDetails: {
            type: Object,
            required: true
        }
    }
}
</script>