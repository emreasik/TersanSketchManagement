export default class ShipService {
    constructor(fetcher) {
        this.fetcher = fetcher;
    }

    async getShips() {
        let result = await this.fetcher.post("/Ship/GetSummary", {
            pageSize: 100,
            pageNumber: 1,
            sketchId: 1
        });
        return result.data;
    }

    async addShip(shipData) {
        await this.fetcher.port("/Ship", {
            name: shipData.name,
            shipStatusID: shipData.shipStatusID,
            x: shipData.x,
            y: shipData.y,
            sketchId: shipData.sketchId,
            hexColorCode: shipData.hexColorCode,
        });
        return result.data
    }

    async updateShip(updateShipData) {
        await this.fetcher.put("/Ship", {
            id: updateShipData.id,
            name: updateShipData.name,
            shipStatusType: updateShipData.shipStatusType,
            x: updateShipData.x,
            y: updateShipData.y,
            hexColorCode: updateShipData.hexColorCode,
        });
        return result.data
    }

    async deleteShip(shipId) {
        await this.fetcher.delete("/Ship", {
            params: {
                id: shipId
            }
        });
        return result.data
    }
}
