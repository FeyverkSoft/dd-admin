export interface BaseSearchResult<T> {
    total: number;
    offset: number;
    limit: number;
    items: Array<T>;
}