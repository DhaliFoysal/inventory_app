const { checkUserById } = require("../src/modules/users/usersService");

const checkPermission = async (req, res, next) => {
  try {
    // console.log(user);
    const user = await checkUserById(req.params.id);
    const { role: thisUserRole, companyId: thisUserCompanyId } = req;

    if (req.role === "user" || req.userId == req.params.id) {
      return res.status(401).json({
        code: 401,
        error: "access denied",
        message: "You do not have permission to access",
      });
    }

    if (user && user !== null) {
      if (
        thisUserRole === user.role ||
        (thisUserRole === "admin" && user.role === "superAdmin") ||
        (thisUserRole !== "superAdmin" && user.companyId !== thisUserCompanyId)
      ) {
        return res.status(404).json({
          code: 404,
          error: "404 Not Found",
          message: "Content not available!",
        });
      }
    } else {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found",
        message: "Content not available!",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkPermission,
};
