import { Query } from 'mongoose';
interface QueryParams {
    search?: string;
    sort?: string;
    page?: string;
    limit?: string;
    [key: string]: string | undefined;
}
export declare class QueryBuilder<T> {
    query: Query<T[], T>;
    private queryParams;
    constructor(query: Query<T[], T>, queryParams: QueryParams);
    search(searchableFields: string[]): this;
    filter(): this;
    sort(): this;
    paginate(): this;
    countTotal(): Promise<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
export {};
//# sourceMappingURL=queryBuilder.d.ts.map