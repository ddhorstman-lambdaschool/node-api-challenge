class AppError extends Error {
  constructor(message, status) {
    super(message);

    this.status = status;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

function errorHandling(error, req, res, next) {
  console.error(error.e || error.err || error.error || error.errors || error);
  const { status = 500, message = "Error" } = error;
  res.status(status).json({ message });
}

module.exports = { AppError, catchAsync, errorHandling };
