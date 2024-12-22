const superAdminPermission = (req, res, next) => {
  try {
    if (req.role !== "superAdmin") {
      return res.status(403).json({
        code: 403,
        error: "Access Denied !",
        message: " You do not have permissions",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = superAdminPermission;
