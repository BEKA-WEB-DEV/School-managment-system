export const buildStudentFilter = (req, res, next) => {
    const { status, class_id, year } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (class_id) filter.class_id = class_id;
    if (year) filter.academic_year = year;
  
    req.filter = filter;
    next();
  };
  
  export const paginateResults = (model) => async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const startIndex = (page - 1) * limit;
  
    try {
      const total = await model.count();
      const results = await model.findAll({
        limit,
        offset: startIndex
      });
  
      res.paginatedResults = {
        data: results,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      };
      next();
    } catch (err) {
      next(err);
    }
  };