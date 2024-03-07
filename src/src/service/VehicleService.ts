import {BaseService} from "@/service/BaseService.js";

export class VehicleService extends BaseService {
    constructor(protected url: string) {
        super(url, 'vehicles');
    }
}