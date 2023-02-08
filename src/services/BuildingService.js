export default class BuildingService {
    constructor(fetcher) {
        this.fetcher = fetcher;
    }
    async getBuildings() {
        let result = await this.fetcher.post("/Building/GetSummary", {
            pageSize: 100,
            pageNumber: 1,
            sketchId: 1
        });
        return result.data;
    }
    async addBuilding(buildingData) {
        let result = await this.fetcher.post("/Building", {
            name: buildingData.name,
            x: buildingData.x,
            y: buildingData.y,
            sketchId: buildingData.sketchId,
        });

        return result.data;
    }
    async updateBuilding(updateBuildingData) {
        let result = await this.fetcher.put("/Building", {
            id: updateBuildingData.id,
            name: updateBuildingData.name,
            x: updateBuildingData.x,
            y: updateBuildingData.y,
        });

        return result.data;
    }
    async deleteBuilding(buildingId) {
        console.log(buildingId);
        let result = await this.fetcher.delete("/Building", {
            params: {
                id: buildingId
            }
        });
        return result.data;
    }
}