class APIFeatures {
  constructor(dbQuery, queryString) {
    this.dbQuery = dbQuery;
    this.queryString = queryString;
  }

  // Filtering: api/v1/tours?duration=5&difficulty=easy
  filter() {
    const queryFiltersObj = { ...this.queryString };
    const invalidQueryFilters = ['page', 'sort', 'limit', 'fields'];
    invalidQueryFilters.forEach((field) => delete queryFiltersObj[field]);

    // Advanced Filtering: api/v1/tours?duration[gte]=5&difficulty=easy
    const operationsRegex = /\b(gte|gt|lte|lt)\b/g;
    let queryStr = JSON.stringify(queryFiltersObj);
    queryStr = queryStr.replace(operationsRegex, (match) => `$${match}`);

    this.dbQuery = this.dbQuery.find(JSON.parse(queryStr));

    return this;
  }

  // Sorting: api/v1/tours?sort=price,ratingsAverage (-price: descending)
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.dbQuery = this.dbQuery.sort(sortBy);
    } else {
      this.dbQuery = this.dbQuery.sort('-createdAt');
    }

    return this;
  }

  // Fields returned: api/v1/tours?fields=name,price,ratingsAverage
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.dbQuery = this.dbQuery.select(fields);
    } else {
      this.dbQuery = this.dbQuery.sort('-__v'); // removes mongo-specific fields
    }

    return this;
  }

  // Pagination: api/v1/tours?page=2&limit=5
  paginate() {
    const page = +this.queryString.page || 1;
    if (page <= 0) throw new Error('This page does not exist!');

    const limit = +this.queryString.limit || 20;
    const skip = (page - 1) * limit;

    this.dbQuery = this.dbQuery.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
