<template>
    <div>
         <!-- isim -->
         <div class="form-group">
            <div class="row my-4">
                <label for="name" class="col-sm-2 col-form-label">İsim</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="name" placeholder="İsim" v-model="shipModel.name">
                </div>
            </div>
            <!-- shipstatus -->
            <div class="row my-4">
                <label for="shipstatus" class="col-sm-2 col-form-label">Durum</label>
                <div class="col-sm-10">
                    <select class="form-control" id="shipstatus" v-model="shipModel.shipStatusId">
                        <option v-for="shipStatus in shipStatuses" :value="shipStatus.value">
                        {{ shipStatus.name }}
                        </option>
                    </select>
                </div>
            </div>
           
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShipAddContent',
    props:
    {
        shipModel: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            shipStatuses: [
                { id: 1, name: 'Bakımda',value:1 },
                { id: 2, name: 'Yapımda',value:2 }
            ]
        }
    }
    
}
</script>