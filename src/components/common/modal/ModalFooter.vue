<template>
    <div class="modal-footer justify-content-between">
        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="buttonDeleteFunction">Sil</button>
        <div class="d-flex gap-3">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ secondButtonLabel }}</button>
            <button type="button" class="btn bg-main-color text-white" @click="buttonFunction" data-bs-dismiss="modal">
                {{ firstButtonLabel }} </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ModalFooter',
    props: {
        firstButtonLabel: {
            type: String,
            required: true
        },
        secondButtonLabel: {
            type: String,
            required: true
        },
        buttonFunction: {
            type: Function,
            required: true
        },
        buttonDeleteFunction: {
            type: Function,
            required: true
        }
    }
}
</script>