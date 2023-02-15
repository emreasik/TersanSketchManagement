<template>
    <div class="modal-header bg-main-color">
        <h5 class="modal-title text-white" id="modalLabel">{{ modalHeaderTitle }}</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
</template>

<script>
export default {
    name: 'BuildingModalHeader',
    props: {
        modalHeaderTitle: {
            type: String,
            required: true
        }
    }
}
</script>