<template>
   

    <div class="modal fade" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <!-- header -->
            <div class="modal-header bg-main-color">
                <h5 class="modal-title text-white" id="modalLabel">{{ title }}</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <!-- body -->
            <div class="modal-body">
                <slot></slot>
            </div>
            <!-- Footer -->
            <div class="modal-footer justify-content-between">
            <div>
                <button type="button" v-if="isDeletable" class="btn btn-danger" data-bs-dismiss="modal" @click="$emit('delete')">Sil</button>
            </div>
        <div class="d-flex gap-3">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="$emit('cancel')">İptal</button>
            <button type="button" class="btn bg-main-color text-white" @click="$emit('save')" data-bs-dismiss="modal"> Kaydet </button>
        </div>
        </div>
            </div>
        </div>
    </div>
</template>

<script>

export default{
    name: 'ModalComponent',
    props: {
        title: {
            type: String,
            required: true
        },
        isDeletable : {
            type: Boolean,
            default: false
        }
    },
    emits: ['delete', 'save', 'cancel']
}

</script>