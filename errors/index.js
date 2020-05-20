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
  console.error(error);
  //handle ValidationErrors, which are sent as an array
  if (Array.isArray(error)) {
    const message = error.map(e => e.stack);
    return res.status(400).json({ message });
  }
  //handle ordinary errors
  const { status = 500, message = "Error" } = error;
  res.status(status).json({ message });
}

module.exports = { AppError, catchAsync, errorHandling };
