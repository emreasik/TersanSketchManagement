export default class SketchService {
    constructor(fetcher) {
        this.fetcher = fetcher;
    }

    async getShips() {
        let result = await this.fetcher.get("/Sketch/GetAll");
        return result.data;
    }

    async addShip(sketchData) {
        let result = await this.fetcher.post("/Sketch", {
            ...sketchData,
        }
        );
        return result.data
    }

    async deleteShip(sketchName) {
        let result = await this.fetcher.delete("/Sketch", {
            params: {
                name: sketchName
            }
        });
        return result.data
    }
}
