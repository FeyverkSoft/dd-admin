export interface BaseSearchResult<T> {
    isLoading: boolean,
    total: number;
    offset: number;
    limit: number;
    items: Array<T>;
}