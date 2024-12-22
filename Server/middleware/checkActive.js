const checkActive = (req, res, next) => {
  try {
    if (req.status === "deActive") {
      return res.status(401).json({
        code: 401,
        error: "access denied",
        message:
          "Your account is deActive, please get in touch with your Administrator!",
      });
    }
    if (req.status === "pending") {
      return res.status(401).json({
        code: 401,
        error: "access denied",
        message:
          "Your account is not Active, please get in touch with your Administrator!",
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
