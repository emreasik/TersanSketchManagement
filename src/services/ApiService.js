import axios from "axios";
import BuildingService from "./BuildingService";

export const fetcher = axios.create({
    baseURL: "https://localhost:7052/api",
});

export const buildingService = new BuildingService(fetcher);
