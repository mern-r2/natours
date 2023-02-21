const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // Filtering: api/v1/tours?duration=5&difficulty=easy
    const queryFiltersObj = { ...req.query };
    const invalidQueryFilters = ['page', 'sort', 'limit', 'fields'];
    invalidQueryFilters.forEach((field) => delete queryFiltersObj[field]);

    // Advanced Filtering: api/v1/tours?duration[gte]=5&difficulty=easy
    const operationsRegex = /\b(gte|gt|lte|lt)\b/g;
    let queryStr = JSON.stringify(queryFiltersObj);
    queryStr = queryStr.replace(operationsRegex, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // Sorting: api/v1/tours?sort=price,ratingsAverage (-price: descending)
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Fields returned: api/v1/tours?fields=name,price,ratingsAverage
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.sort('-__v'); // removes mongo-specific fields
    }

    // Pagination: api/v1/tours?page=2&limit=5
    const page = +req.query.page || 1;
    if (page <= 0) throw new Error('This page does not exist!');

    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;

    if (skip > 0) {
      const numDocs = await Tour.countDocuments();
      if (skip >= numDocs) throw new Error('This page does not exist!');
    }

    query = query.skip(skip).limit(limit);

    // Execute query
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid data sent!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // to return the updated tour
      runValidators: true,
    });

    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: 'Invalid data sent!',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: 'Invalid data sent!',
    });
  }
};
