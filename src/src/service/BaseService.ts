import JsonApiRequestQueryParams from "@/models/JsonApiRequestQueryParams.ts";
import Kitsu from "./KitsuClient";

export class BaseService {
    protected apiClient: Kitsu;

    constructor(protected model: string, options = {}) {
        this.apiClient = new Kitsu({
            baseURL: 'http://51.158.187.119:18080/api/v1/',
            camelCaseTypes: false,
            ...options
        });
    }

    getList(jsonApiRequestQueryParams: JsonApiRequestQueryParams|any = null) {
        let params: {
            sort?: any,
            page?: any,
            filter?: any,
            include?: any,
        } = {};

        if (jsonApiRequestQueryParams?.sort) {
            params.sort = jsonApiRequestQueryParams?.sort;
        }

        if (jsonApiRequestQueryParams?.page) {
            params.page = jsonApiRequestQueryParams?.page;
        }

        if (jsonApiRequestQueryParams?.filter) {
            params.filter = jsonApiRequestQueryParams?.filter;
        }

        if (jsonApiRequestQueryParams?.include) {
            params.include = jsonApiRequestQueryParams?.include;
        }

        return this.apiClient.get(this.model, {
            params,
        });
    }

    update(data = {}) {
        return this.apiClient.update(this.model, data);
    }

    create(data = {}) {
        return this.apiClient.create(this.model, data);
    }

    delete(id: string) {
        return this.apiClient.remove(this.model, id);
    }
}