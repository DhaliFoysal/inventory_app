const bcrypt = require("bcrypt");
const { validationResult, query } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const generateURL = require("../../utils/generateURL");
const {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUserById,
} = require("./usersService");

const postUser = async (req, res, next) => {
  const userData = req.body;
  const companyId = req.companyId;
  try {
    // error validation
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      const error = errorFormatter(errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALTROUNDS);
    userData.password = await bcrypt.hash(userData.password, saltRounds);

    const user = await createUser(userData, companyId);
    if (user.isCompany === false) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found",
        message: "Company Not Found!",
      });
    }

    const response = {
      code: 201,
      massage: "User create successful",
      data: user,
      links: {
        self: {
          method: "POST",
          url: "/users",
        },
        get: {
          method: "GET",
          url: `/users/${user.id}`,
        },
        update: {
          method: "PATCH",
          url: `/users/${user.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/users/${user.id}`,
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
  const queries = req.query;

  const result = validationResult(req);
  try {
    // Error validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request !", data: error });
    }

    queries.page = parseInt(queries.page || 1);
    queries.limit = parseInt(queries.limit || 10);
    let { page, limit } = queries;

    const offset = (page - 1) * limit;
    const { users, total_items } = await getAllUsers({
      role,
      companyId,
      offset,
      queries,
    });

    let total_page = 0;

    if (users) {
      total_page = Math.ceil(total_items / limit);
    }

    const currentUrl = generateURL(req.query);

    const reqQuery = req.query;
    reqQuery.page = parseInt(reqQuery.page) + 1;
    const nextUrl = generateURL(reqQuery);

    reqQuery.page = parseInt(reqQuery.page) - 2;
    const prevUrl = generateURL(reqQuery);

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
        total_items: total_items,
      },
      links: {
        self: {
          method: "GET",
          url: `/users?${currentUrl}`,
        },
        next: {
          method: "GET",
          url: `/users?${nextUrl}`,
        },
        prev: {
          method: "GET",
          url: `/users?${prevUrl}`,
        },
      },
    };

    if (page >= total_page) {
      delete response.pagination.next_page;
      delete response.links.next;
    }
    if (page <= 1) {
      delete response.pagination.prev_page;
      delete response.links.prev;
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const companyId = req.companyId;
    const userId = req.params.id;
    const role = req.role;

    let user = await getSingleUser({ userId, companyId, role });
    if (user.length <= 0) {
      return res
        .status(404)
        .json({ code: 404, error: "Not Found", message: "User not found" });
    }

    const response = {
      code: 200,
      message: "Success",
      data: user[0],
      links: {
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
  const userId = req.params.id;
  const data = req.body;
  const { companyId, role } = req;

  try {
    // error validation
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      const error = errorFormatter(errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    const isUser = await getSingleUser({ userId, companyId, role });
    if (isUser.length <= 0) {
      return res.status(404).json({
        code: 404,
        error: "Not Found",
        message: "Content Not Available!",
      });
    }
    const updatedUser = await updateUser(data, userId);

    delete updatedUser.password;

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
  const userId = req.params.id;
  const { companyId, role } = req;

  try {
    const isUser = await getSingleUser({ userId, companyId, role });

    if (isUser.length <= 0) {
      return res.status(404).json({
        code: 404,
        error: "Not Found",
        message: "Content not Available!",
      });
    }
    
    const deletedUser = await deleteUserById(userId)
    res.status(204).json()

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
