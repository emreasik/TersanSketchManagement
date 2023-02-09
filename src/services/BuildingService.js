export default class BuildingService {
    constructor(fetcher) {
        this.fetcher = fetcher;
    }
    //Todo: metodu kullanan yerlere window size ekle
    async getBuildings(sketchId,windowSize) {
        console.log(windowSize);
        let result = await this.fetcher.post("/Building/GetSummary", {
            pageSize: 100,
            pageIndex: 0,
            sketchId: 4,
            windowHeight: windowSize.windowHeight,
            windowWidth: windowSize.windowWidth
        });
        console.log(result.data);
        return result.data;
    }
    //TODO: buildinge window size ekle
    async addBuilding(buildingData, windowSize) {
        console.log(buildingData);
        console.log(windowSize);
        let result = await this.fetcher.post("/Building", {
            name: buildingData.name,
            x: buildingData.x,
            y: buildingData.y,
            sketchId: buildingData.sketchId,
            windowWidth: windowSize.windowWidth,
            windowHeight: windowSize.windowHeight
        });
        console.log(result.data);
        return result.data;
    }

    async updateBuilding(updateBuildingData, windowSize) {
        let result = await this.fetcher.put("/Building", {
            id: updateBuildingData.id,
            name: updateBuildingData.name,
            x: updateBuildingData.x,
            y: updateBuildingData.y,
            windowHeight: windowSize.windowHeight,
            windowWidth: windowSize.windowWidth

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