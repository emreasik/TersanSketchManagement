import axios from "axios";

const fetcher = axios.create({
    baseURL: "http://localhost:3000",
});

export default class ApiService {
    static async getBuildings() {
        const data = await fetcher.get("/buildings");
        return data.data;
    }
}