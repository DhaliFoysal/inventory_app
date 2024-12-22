const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { signIn: checkUser, createUser } = require("./authService");

const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const {
  findCompanyByUserIdAndCompanyId,
} = require("../companys/companysServices");

const signIn = async (req, res, next) => {
  const { userName, password } = req.body;

  try {
    // Error Validation
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      const error = errorFormatter(errors);

      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    const user = await checkUser({ userName, password });

    if (user === null) {
      const response = {
        code: 400,
        error: "Bad Request",
        data: [
          {
            field: "userName",
            message: "invalid credentials ",
            in: "body",
          },
          {
            field: "password",
            message: "invalid credentials ",
            in: "body",
          },
        ],
      };
      return res.status(400).json(response);
    }

    // check password Match
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const response = {
        code: 400,
        error: "Bad Request",
        data: [
          {
            field: "userName",
            message: "invalid credentials ",
            in: "body",
          },
          {
            field: "password",
            message: "invalid credentials ",
            in: "body",
          },
        ],
      };
      return res.status(400).json(response);
    }

    // find company
    const company = await findCompanyByUserIdAndCompanyId(
      user.id,
      user.companyId
    );

    const privateKey = process.env.JWT_TOKEN;
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: user.companyId,
      companyName: company.name,
    };

    // create token
    const token = jwt.sign(payload, privateKey, { expiresIn: 60 * 60 });

    const response = {
      code: 200,
      message: "Signin successful",
      data: {
        access_token: token,
      },
      link: {
        self: {
          method: "POST",
          url: "/auth/signin",
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const signUp = async (req, res, next) => {
  const data = req.body;

  try {
    const userData = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      password: data.password,
      createBy: data.createBy,
    };

    const companyData = {
      name: data.companyName,
      address: data.companyAddress,
      type: data.companyType,
    };
    if (data.createBy !== "email") {
      delete userData.email;
    }
    if (data.createBy !== "phone") {
      delete userData.phone;
    }

    // Error Validation
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      const error = errorFormatter(errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }
    const saltRounds = parseInt(process.env.BCRYPT_SALTROUNDS);
    userData.password = await bcrypt.hash(req.body.password, saltRounds);

    // Create User
    const user = await createUser(userData, companyData);

    // If have User, respond here.
    if (user.isUser) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        data: [
          {
            field: data.createBy,
            value: data[data.createBy],
            message: "Account already Exist",
            in: "body",
          },
        ],
      });
    }

    const privateKey = process.env.JWT_TOKEN;
    const token = await jwt.sign(user, privateKey);
    const response = {
      code: 201,
      message: "Signup Successful",
      data: {
        access_token: token,
      },
      link: {
        self: {
          method: "POST",
          url: "/auth/signup",
        },
        createCompany: {
          method: "POST",
          url: "/auth/company",
        },
      },
    };

    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signIn,
  signUp,
};
