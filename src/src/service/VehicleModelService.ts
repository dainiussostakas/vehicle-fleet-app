import {BaseService} from "@/service/BaseService.js";

export class VehicleModelService extends BaseService {
    constructor(protected url: string) {
        super(url, 'vehicle-models');
    }
}