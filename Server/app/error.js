const notFoundError = (req, res, next) => {
  const error = {
    code: 404,
    error: "404 Not Found !",
    message: "Page not available!",
  };
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  if (error.code) {
    return res.status(error.code).json(error);
  }
  res.status(500).json({
    code: 500,
    message: "Internal Server Error",
    data: {},
  });
};

module.exports = {
  notFoundError,
  errorHandler,
};
