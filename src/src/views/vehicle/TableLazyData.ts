export default class TableLazyData {
    constructor(public params: {
        sortOrder?: any;
        sortField?: any;
        filters?: {
            registrationPlate?: { value: any; matchMode: any };
            vehicleModel?: { value: any; matchMode: any };
            vehicleBrand?: { value: any; matchMode: any };
        };
        rows?: number;
        first?: number
    }) {

    }
}