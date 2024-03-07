import {BaseService} from "@/service/BaseService.ts";

export class VehicleBrandService extends BaseService {
    constructor(protected url: string) {
        super(url, 'vehicle-brands');
    }
}