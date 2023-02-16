<template>
    <div>
        <!-- isim -->
        <div class="form-group">
            <div class="row my-4">
                <label for="sketch_name" class="col-sm-2 col-form-label">Kroki</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="name" placeholder="İsim" v-model="sketchModal.name">
                    {{ sketchModal.name }}
                    <input type="file" class="form-control">
                </div>
            </div>
            <div class="row my-4">
                <label for="sketch_description" class="col-sm-2 col-form-label">Açıklama</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="name" placeholder="Açıklama" v-model="sketchModal.description">
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'SketchAddContent',
    props:
    {
        sketchModal: {
            type: Object,
            required: true,
        }
    }
}
</script>