export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: "Validation error",
      details: err.errors.map((e) => e.message).join(", "),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      error: "Record already exists",
      details: err.errors.map((e) => e.message).join(", "),
    });
  }

  res.status(500).json({
    error: "Internal server error",
    details: err.message,
  });
};
