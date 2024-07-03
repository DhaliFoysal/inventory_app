const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUserById,
} = require("./usersService");

const postUser = async (req, res, next) => {
  try {
    // error validation
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      const error = errorFormatter(errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    const { name, email, phone, password, role, status } = req.body;
    const reqValue = {
      name,
      email,
      phone,
      password,
      role,
      status,
      companyId: req.companyId,
    };

    const hashPassword = await bcrypt.hash(password, 12);
    reqValue.password = hashPassword;

    const result = await createUser(reqValue);
    reqValue.id = result.insertId;
    delete reqValue.password;

    const response = {
      code: 201,
      massage: "User create successful",
      data: reqValue,
      links: {
        self: {
          method: "POST",
          url: "/users",
        },
        signin: {
          method: "POST",
          url: "/auth/signin",
        },
        update: {
          method: "PATCH",
          url: `/users/${result.insertId}`,
        },
        delete: {
          method: "DELETE",
          url: `/users/${result.insertId}`,
        },
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getAllUser = async (req, res, next) => {
  const { role, companyId } = req;
  try {
    // check permission
    if (role === "user") {
      return res.status(401).json({
        code: 401,
        error: "access denied",
        message: "You do not have permission to access",
      });
    }
    const query = req.query;
    const users = await getAllUsers(query, role, companyId);

    let { page, limit } = query;
    let total_user = 0;
    let total_page = 0;

    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 1;
    }

    if (users[0]) {
      total_user = users[0].total_user;
      total_page = Math.ceil(total_user / limit);
    }

    const response = {
      code: 200,
      message: "Success",
      data: users,
      pagination: {
        page,
        limit: limit,
        next_page: parseInt(page) + 1,
        prev_page: parseInt(page) - 1,
        total_page,
        total_items: total_user,
      },
    };

    if (page >= total_page) {
      delete response.pagination.next_page;
    }
    if (page <= 1) {
      delete response.pagination.prev_page;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    if (req.role === "user") {
      return res.status(401).json({
        code: 401,
        error: "access denied",
        message: "You do not have permission to access",
      });
    }

    const companyId = req.companyId;
    const userId = req.params.id;
    const role = req.role;

    const user = await getSingleUser(userId, companyId, role);
    user[0].link = `/users/${userId}`;

    const response = {
      code: 200,
      message: "Success",
      data: user[0],
      lins: {
        self: {
          method: "GET",
          url: `users/${userId}`,
        },
        update: {
          method: "PATCH",
          url: `users/${userId}`,
        },
        delete: {
          method: "DELETE",
          url: `users/${userId}`,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const patchUser = async (req, res, next) => {
  try {
    // error validation
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      const error = errorFormatter(errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    const userId = req.params.id;
    const updatedUser = await updateUser(req.body, userId);

    if (updatedUser) {
      updatedUser.link = `/users/${userId}`;
    }

    const response = {
      code: 200,
      message: "Success",
      data: updatedUser,
      links: {
        self: {
          method: "PATCH",
          url: `/users/${userId}`,
        },
        update: {
          method: "PATCH",
          url: `/users/${userId}`,
        },
        delete: {
          method: "DELETE",
          url: `/users/${userId}`,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    // error validation
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      const error = errorFormatter(errors);
      res.status(400).json({ code: 400, error: "Bad Request", data: error });
    }

    const deletedUser = await deleteUserById(req.params.id);

    if (deletedUser) {
      return res.status(204).json({ code: 204 });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postUser,
  getAllUser,
  getUserById,
  patchUser,
  deleteUser,
};
