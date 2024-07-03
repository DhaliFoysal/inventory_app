const jwt = require("jsonwebtoken");

const checkLoginForCompany = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    const privateKey = process.env.JWT_TOKEN;
    const token = authorization.split(" ")[1];
    const user = await jwt.verify(token, privateKey);
    req.userId = user.id;
    req.name = user.name;
    req.phone = user.phone;
    req.email = user.email;
    req.role = user.role;
    req.status = user.status;
    req.companyId = user.companyId;
    next();
  } catch {
    next("Authorization failed ");
  }
};

module.exports = checkLoginForCompany;
