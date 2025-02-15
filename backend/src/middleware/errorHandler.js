export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      error: "Record already exists",
    });
  }

  res.status(500).json({
    error: "Internal server error",
  });
};
