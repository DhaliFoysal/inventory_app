const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const {
  createPost,
  fetchAllCustomer,
  fetchAllCustomerById,
} = require("./customersService");
const generateUrl = require("../../utils/generateURL");

const postCustomer = async (req, res, next) => {
  const result = validationResult(req);
  const { userId, companyId } = req;
  const value = req.body;
  try {
    // Error Validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bade Request !", data: error });
    }

    const post = await createPost(value, companyId, userId);
    if (post.code === 409) {
      return res.status(409).json({
        code: post.code,
        error: "Conflict",
        message: "Customer already Exist",
      });
    }

    res.status(201).json({
      code: 201,
      message: "Success",
      data: post.data,
      links: {
        self: {
          method: "POST",
          url: `/customers`,
        },
        update: {
          method: "PATCH",
          url: `/customers/${post.data.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/customers/${post.data.id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllCustomers = async (req, res, next) => {
  const companyId = req.companyId;
  const result = validationResult(req);
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);

  try {
    // error validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    const customers = await fetchAllCustomer(req.query, companyId);
    const totalPage = Math.ceil(customers[0]?.total_customers / limit) || 0;
    const currentUrl = generateUrl(req.query);
    const queryURL = req.query;

    queryURL.page = parseInt(queryURL.page) + 1;
    const nextURL = generateUrl(queryURL);

    queryURL.page = parseInt(queryURL.page) - 2;
    const prevURL = generateUrl(queryURL);

    const response = {
      code: 200,
      message: "Success",
      data: customers,
      pagination: {
        page: `${page}`,
        limit: `${limit}`,
        total_page: `${totalPage}`,
        total_items: `${customers[0]?.total_customers || 0}`,
        next_page: `${page + 1}`,
        prev_page: `${page - 1}`,
      },
      links: {
        self: {
          method: "GET",
          url: `/customers?${currentUrl}`,
        },
        next: {
          method: "GET",
          url: `/customers?${nextURL}`,
        },
        prev: {
          method: "GET",
          url: `/customers?${prevURL}`,
        },
      },
    };

    if (page >= totalPage) {
      delete response.pagination.next_page;
      delete response.links.next;
    }

    if (page <= 1) {
      delete response.pagination.prev_page;
      delete response.links.prev;
    }

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  const id = req.params.id;
  const companyId = req.companyId;
  const result = validationResult(req);

  try {
    // Error validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bade Request !", data: error });
    }

    const customer = await fetchAllCustomerById(id, companyId);
    const response = {
      code: 200,
      message: "Success",
      data: customer[0] || {},
      links: {
        self: {
          method: "GET",
          url: `/customers/${id}`,
        },
        update: {
          method: `PATCH`,
          url: `/customers/${id}`,
        },
        delete: {
          method: `DELETE`,
          url: `/customers/${id}`,
        },
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const patchCustomerById = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const deleteCustomerById = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postCustomer,
  getAllCustomers,
  getCustomerById,
  patchCustomerById,
  deleteCustomerById,
};
