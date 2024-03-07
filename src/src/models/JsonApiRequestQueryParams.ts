export default class JsonApiRequestQueryParams {
    public filter?: any | null = null;
    public include?: string | null = null;
    public sort?: string | null = null;
    public page?: { number: number; size: number | undefined };
}