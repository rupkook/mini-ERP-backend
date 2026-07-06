"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
class QueryBuilder {
    constructor(query, queryParams) {
        this.query = query;
        this.queryParams = queryParams;
    }
    search(searchableFields) {
        const searchTerm = this.queryParams.search;
        if (searchTerm) {
            const searchConditions = searchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            }));
            this.query = this.query.find({ $or: searchConditions });
        }
        return this;
    }
    filter() {
        const excludeFields = ['search', 'sort', 'page', 'limit'];
        const filterObj = {};
        Object.keys(this.queryParams).forEach((key) => {
            if (!excludeFields.includes(key) && this.queryParams[key] !== undefined) {
                filterObj[key] = this.queryParams[key];
            }
        });
        this.query = this.query.find(filterObj);
        return this;
    }
    sort() {
        if (this.queryParams.sort) {
            const sortBy = this.queryParams.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    paginate() {
        const page = parseInt(this.queryParams.page || '1', 10);
        const limit = parseInt(this.queryParams.limit || '10', 10);
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
    async countTotal() {
        const page = parseInt(this.queryParams.page || '1', 10);
        const limit = parseInt(this.queryParams.limit || '10', 10);
        const total = await this.query.model.countDocuments(this.query.getFilter());
        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
exports.QueryBuilder = QueryBuilder;
//# sourceMappingURL=queryBuilder.js.map