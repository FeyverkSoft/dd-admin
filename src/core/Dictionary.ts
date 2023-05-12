export interface IDictionary<T> {
    [id: string]: T;
}

export class Dictionary<T> implements IDictionary<T> {
    [id: string]: T;
}