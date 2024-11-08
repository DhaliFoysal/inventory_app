const jwt = require("jsonwebtoken");

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
    let user;

    jwt.verify(token, privateKey, (err, result) => {
      if (err) {
        return res
          .status(401)
          .json({ code: 401, error: "Unauthorized", message: "Please Login " });
      }
      return (user = result);
    });

    if (!user) {
      return;
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
        data: {
          message: "Please Create Company",
        },
        links: {
          company: {
            method: "POST",
            url: "/auth/company",
          },
        },
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkLogin;
