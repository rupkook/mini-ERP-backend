import { Query } from 'mongoose';

interface QueryParams {
  search?: string;
  sort?: string;
  page?: string;
  limit?: string;
  [key: string]: string | undefined;
}

export class QueryBuilder<T> {
  public query: Query<T[], T>;
  private queryParams: QueryParams;

  constructor(query: Query<T[], T>, queryParams: QueryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }

  search(searchableFields: string[]): this {
    const searchTerm = this.queryParams.search;
    if (searchTerm) {
      const searchConditions = searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      }));
      this.query = this.query.find({ $or: searchConditions } as any);
    }
    return this;
  }

  filter(): this {
    const excludeFields = ['search', 'sort', 'page', 'limit'];
    const filterObj: Record<string, unknown> = {};

    Object.keys(this.queryParams).forEach((key) => {
      if (!excludeFields.includes(key) && this.queryParams[key] !== undefined) {
        filterObj[key] = this.queryParams[key];
      }
    });

    this.query = this.query.find(filterObj as any);
    return this;
  }

  sort(): this {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate(): this {
    const page = parseInt(this.queryParams.page || '1', 10);
    const limit = parseInt(this.queryParams.limit || '10', 10);
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  async countTotal(): Promise<{ total: number; page: number; limit: number; totalPages: number }> {
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
