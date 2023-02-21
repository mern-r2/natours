const env = require('../config/env');

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
    sendErrorPrd(err, res);
  }
};
