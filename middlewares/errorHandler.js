const errHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "an unknown error occured";
  res.status(error.statusCode).json({ message: error.message });
};
module.exports = errHandler;
