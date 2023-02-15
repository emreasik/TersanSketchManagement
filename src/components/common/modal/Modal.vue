<template>
    <div class="modal fade" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <ModalHeader :modalHeaderTitle="modalTypeDetails.modalHeaderLabel"></ModalHeader>
                <ModalBody :modalBodyLabel="modalTypeDetails.modalBodyLabel"
                    :modalBodyInputSpanX="modalTypeDetails.modalBodyInputSpanX"
                    :modalBodyInputSpanY="modalTypeDetails.modalBodyInputSpanY"
                    :inputDetails="inputDetails"></ModalBody>
                <MoodalFooter :firstButtonLabel="modalTypeDetails.modalFooterFirstButton"
                    :secondButtonLabel="modalTypeDetails.modalFooterSecondButton" :buttonFunction="footerButtonFuction"
                    :buttonDeleteFunction="footerDeleteButtonFuction">
                </MoodalFooter>
            </div>
        </div>
    </div>
</template>

<script>
import ModalHeader from './ModalHeader.vue';
import ModalBody from './ModalBody.vue';
import MoodalFooter from './ModalFooter.vue';

export default {
    name: 'ModalComponent',
    components: {
        ModalHeader,
        ModalBody,
        MoodalFooter
    },
    created() {
        console.log(this.inputDetails);
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