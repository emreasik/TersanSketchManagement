export default class BuildingService {
    constructor(fetcher) {
        this.fetcher = fetcher;
    }
    getBuildings() {
        return this.fetcher.post("/Building/GetSummary", {
            pageSize: 100,
            pageNumber: 1,
            sketchId: 1
        }).then(function (response) {
            return response.data.data;
        })
            .catch(function (error) {
                console.log(error);
            }
            );
    }
    addBuilding(buildingData) {
        return this.fetcher.post("/Building", {
            name: buildingData.name,
            x: buildingData.x,
            y: buildingData.y,
            sketchId: buildingData.sketchId,
        }).then(function (response) {
            return response.data;
        })
            .catch(function (error) {
                console.log(error);
            }
            );
    }
    updateBuilding(updateBuildingData) {
        return this.fetcher.put("/Building", {
            id: updateBuildingData.id,
            name: updateBuildingData.name,
            x: updateBuildingData.x,
            y: updateBuildingData.y,
        }).then(function (response) {
            alert("Building updated successfully!")
            console.log(response);
            return response.data;
        })
            .catch(function (error) {
                console.log(error);
            }
            );
    }
}