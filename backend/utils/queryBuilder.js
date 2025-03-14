export class QueryBuilder {
    constructor(baseQuery) {
      this.query = baseQuery;
      this.params = [];
    }
  
    addFilter(field, value, operator = '=') {
      if (value) {
        this.query += ` WHERE ${field} ${operator} ?`;
        this.params.push(value);
      }
      return this;
    }
  
    addSort(sortBy, order = 'ASC') {
      if (sortBy) {
        this.query += ` ORDER BY ${sortBy} ${order}`;
      }
      return this;
    }
  
    addPagination(page = 1, limit = 10) {
      const offset = (page - 1) * limit;
      this.query += ` LIMIT ? OFFSET ?`;
      this.params.push(limit, offset);
      return this;
    }
  
    getQuery() {
      return { sql: this.query, values: this.params };
    }
  }