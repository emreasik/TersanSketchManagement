export default class BuildingService {
    constructor(fetcher) {
        this.fetcher = fetcher;
    }

    async getBuildings() {
        const data = await this.fetcher.get("/Building/GetAll");
        console.log(data.data.data);
        return data.data.data;
    }

    async addBuilding(buildingData) {
        return await this.fetcher.post("/Building", {
            name: buildingData.name,
            x: buildingData.x,
            y: buildingData.y,
            sketchId: buildingData.sketchId,
        }).then(function (response) {
            alert("Building added successfully!")
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            }
            );
    }
}