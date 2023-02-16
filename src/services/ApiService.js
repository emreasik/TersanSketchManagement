import axios from "axios";
import BuildingService from "./BuildingService";
import ShipService from "./ShipService";
import SketchService from "./SketchService";

export const fetcher = axios.create({
    baseURL: "https://localhost:7052/api",
});

const buildingService = new BuildingService(fetcher);
const shipService = new ShipService(fetcher);
const sketchService = new SketchService(fetcher);

export {
    buildingService,
    shipService,
    sketchService,
}
