const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  checkUser,
  createUser,
  getUser,
  createCompany,
} = require("./authService");
const { validationResult,} = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");

const signIn = async (req, res, next) => {
  // Error Validation
  const { errors } = validationResult(req);

  if (errors.length > 0) {
    const error = errorFormatter(errors);

    return res
      .status(400)
      .json({ code: 400, error: "Bad Request", data: error });
  }

  const { userName, password } = req.body;

  try {
    const { userIsValid, user } = await checkUser(userName, password);

    if (!userIsValid && user === null) {
      const error = {
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
      next(error);
    }

    if (userIsValid && user) {
      const privateKey = process.env.JWT_TOKEN;
      const token = jwt.sign(user, privateKey, { expiresIn: 60 * 60 });
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
    }
  } catch (error) {
    next(error);
  }
};

const signUp = async (req, res, next) => {
  try {
    // Error Validation
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      const error = errorFormatter(errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    const hashPassword = await bcrypt.hash(req.body.password, 12);
    req.body.password = hashPassword;

    // Create User
    const user = await createUser(req.body);

    // Get new user
    const newUser = await getUser(user.insertId);

    const privateKey = process.env.JWT_TOKEN;
    const token = await jwt.sign(newUser, privateKey);
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
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const company = async (req, res, next) => {
  // Error Validation
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    const error = errorFormatter(errors);
    return res
      .status(400)
      .json({ code: 400, error: "Bad Request", data: error });
  }

  try {
    if (req.company_id) {
      return res.status(409).json({
        code: 409,
        error: "Conflict ",
        data: [
          {
            field: "header",
            message: "Company already exist!",
            value: "",
            in: "header",
          },
        ],
      });
    }

    // Create Company
    const { name, address } = req.body;
    const user = await createCompany({ name, address, userId: req.userId });

    const privateKey = process.env.JWT_TOKEN;
    const token = await jwt.sign(user, privateKey);

    res.status(201).json({
      code: 201,
      message: "Success",
      data: {
        access_token: token,
      },
      link: {
        self: {
          method: "POST",
          url: "/auth/company",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signIn,
  signUp,
  company,
};
