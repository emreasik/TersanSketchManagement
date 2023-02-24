<template>
     <div class="custom-card card position-absolute d-none animate__animated animate__fadeIn" :id="id"
                style="width: 18rem;">
                <h6 class="custom-card__tag">{{ clickedPoint.name }}</h6>
                <div class="card-body" v-if="clickedPoint.info">
                    <p class="card-text w-100"> <span class="w-25 fw-bold">Detay  : </span><span class="w-75 d-inline-flex justify-content-start">{{ clickedPoint.info }}</span></p>
                </div>

                <ul class="list-group list-group-flush" v-if="clickedPoint.features">
                    <li class="list-group-item" v-for="(item, index) in clickedPoint.features" :key="index">
                    <span class="fw-bold">{{ index }}  : </span>{{ item }}
                    </li>
                </ul>
                <div class="card-body d-flex justify-content-center">
                    <button class="card-link custom-card__link" @click="openUpdateModal" v-if="IsEditable">Düzenle</button>
                    <button class="card-link custom-card__link" v-if="hasInnerSketch">Kroki</button>
                </div>
            </div>
</template>

<script>
export default {
    name: "Card",
    props: {
        clickedPoint: {
            type: Object,
            required: true
        },
        hasInnerSketch: {
            type: Boolean,
            required: true
        },
        IsEditable: {
            type: Boolean,
            required: true
        },
        id: {
            type: String,
            required: true
        }
    },
    methods: {
        openUpdateModal() {
            this.$emit("openUpdateModal");
        }
    }
}
</script>