const env = require('../config/env');
const { AppError } = require('../utils/appError');

// invalid id when getting a tour (not in mongo format)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((error) => error.message);
  const message = `Invalid input data. ${errors.join('. ')}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorPrd = (err, res) => {
  // programming or unknown erorr: do NOT leak details to the client!
  if (!err.isOperational) {
    console.error('ERROR!!!');

    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.env === 'development') {
    sendErrorDev(err, res);
  } else if (env.env === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

    sendErrorPrd(error, res);
  }
};
