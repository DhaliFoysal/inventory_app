const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma");

const checkLogin = async (req, res, next) => {
  
  const { authorization } = req.headers;

  try {
    const privateKey = process.env.JWT_TOKEN;

    if (!authorization) {
      return res
        .status(401)
        .json({ code: 401, error: "Unauthorized", message: "Please Login " });
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, privateKey, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          code: 401,
          error: "Unauthorized",
          message: "Please Login",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        return res
          .status(401)
          .json({ code: 401, error: "Unauthorized", message: "Please Login " });
      }

      req.userId = user.id;
      req.name = user.name;
      req.phone = user.phone;
      req.email = user.email;
      req.role = user.role;
      req.status = user.status;
      req.companyId = user.companyId;

      if (!user.companyId) {
        return res.status(200).json({
          code: 200,
          error: "Company null",
          message:
            "Your Company not found, please get in touch with your Administrator! ",
        });
      }
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = checkLogin;
