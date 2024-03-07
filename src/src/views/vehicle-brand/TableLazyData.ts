export default class TableLazyData {
    constructor(public params: {
        sortOrder?: any;
        sortField?: any;
        filters?: {
            title?: { value: any; matchMode: any };
        };
        rows?: number;
        first?: number
    }) {

    }
}