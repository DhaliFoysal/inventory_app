const checkActive = (req, res, next) => {
  try {
    if (req.status === "deactivate") {
      return res.status(401).json({
        code: 401,
        error: "access denied",
        message: "Your account is deactivated!",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkActive,
};
