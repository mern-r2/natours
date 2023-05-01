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

const handleJwtError = () =>
  new AppError('Invalid token, please log in again!', 401);

const handleJwtExpiredError = () =>
  new AppError('Your token has expired, please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  // API (backend)
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Website (frontend)
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorPrd = (err, req, res) => {
  // API (backend)
  if (req.originalUrl.startsWith('/api')) {
    // programming or unknown error: do NOT leak details to the client!
    if (!err.isOperational) {
      console.error('ERROR!!!');

      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
    }

    // Programming or other unknown error: don't leak error details
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Website (frontend)
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.env === 'development') {
    sendErrorDev(err, req, res);
  } else if (env.env === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJwtError();
    if (err.name === 'TokenExpiredError') error = handleJwtExpiredError();

    sendErrorPrd(error, req, res);
  }
};
