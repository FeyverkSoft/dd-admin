export interface IAction<T> {
    type: T;
    [id: string]: any;
}