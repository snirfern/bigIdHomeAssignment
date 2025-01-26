export interface IBaseDal<T,R> {
    create(newArticle: Partial<R>): Promise<T>;

    findByField(field: string, value: string): Promise<T | null>;
}
