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
        let result = await this.fetcher.post("/Ship", {
            ...shipData,
            hexColorCode: "#ffffff",
            sketchId: 1
        }
        );
        return result.data
    }

    async updateShip(updateShipData) {
        let result = await this.fetcher.put("/Ship", {
            ...updateShipData
        });
        return result.data
    }

    async deleteShip(shipId) {
        let result = await this.fetcher.delete("/Ship", {
            params: {
                id: shipId
            }
        });
        return result.data
    }
}
