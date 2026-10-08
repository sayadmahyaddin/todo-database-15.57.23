function validation(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        message: "error",
        error: error.issues,
      });
    }
  };
}

module.exports = validation;
