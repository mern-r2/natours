class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // removes this class from the stacktrace
    Error.captureStackTrace(this, this.constructor);
  }
}

exports.AppError = AppError;
