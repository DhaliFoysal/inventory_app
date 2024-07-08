const userPermission = async (req, res, next) => {
  const role = req.role;
  try {
    if (role === "user") {
      return res.status(403).json({
        code: 403,
        error: "Access Denied",
        message: "You do not have permission to access",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = userPermission;
