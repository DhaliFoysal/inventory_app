const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const {
  postCategory,
  getCategories,
  getCategoriesById,
  updateCategoriesById,
} = require("./categoriesServices");
const generateURL = require("../../utils/generateURL");

const createCategory = async (req, res, next) => {
  const result = validationResult(req);

  try {
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", date: error });
    }
    const category = await postCategory(req);
    res.status(201).json({
      code: 201,
      message: "Success",
      data: category,
      links: {
        self: {
          method: "POST",
          url: `/categories`,
        },
        update: {
          method: "PATCH",
          url: `/categories/${category.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/categories/${category.id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (req, res, next) => {
  const result = validationResult(req);

  try {
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", date: error });
    }

    // find offset
    let { page, limit } = req.query;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = limit * page - limit;

    const categories = await getCategories(req, limit, offset);

    const total_items = categories[0]?.total_categories || 0;
    const total_page = Math.ceil(total_items / limit);

    const currentUrl = generateURL(req.query);

    // generate Next url
    const params = req.query;
    params.page = page + 1;
    const nextUrl = generateURL(params);

    // generate Next url
    params.page = page - 1;
    const prevUrl = generateURL(params);

    const response = {
      code: 200,
      message: "Success",
      data: categories,
      pagination: {
        page,
        limit,
        next_page: page + 1,
        prev_page: page - 1,
        total_page,
        total_items,
      },
      links: {
        self: {
          method: "GET",
          url: `/categories?${currentUrl}`,
        },
        next: {
          method: "GET",
          url: `/categories?${nextUrl}`,
        },
        prev: {
          method: "GET",
          url: `/categories?${prevUrl}`,
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

const getSingleCategory = async (req, res, next) => {
  const id = req.params.id;
  const { companyId, userId } = req;
  try {
    const result = await getCategoriesById(id, companyId, userId);
    if (!result.length > 0) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found !",
        message: "Content Not Available !",
      });
    }
    return res.status(200).json({
      code: 200,
      message: "Success",
      data: result[0],
      links: {
        self: {
          method: "GET",
          url: `/categories/${id}`,
        },
        update: {
          method: "PATCH",
          url: `/categories/${id}`,
        },
        delete: {
          method: "DELETE",
          url: `/categories/${id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const patchCategoryById = async (req, res, next) => {
  // error validation
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = errorFormatter(result.errors);
    return res
      .status(400)
      .json({ code: 400, error: "Bad Request !", data: error });
  }

  try {
    // value destructure
    const value = req.body;
    const { companyId, role } = req;
    const id = req.params.id;

    const category = await updateCategoriesById(value, id, companyId);

    if (category.code === 404) {
      return res.status(404).json();
    }
    return res.status(200).json({
      code: 200,
      message: "Category updated Successful",
      data: category.data,
      links: {
        self: {
          method: "PATCH",
          url: `/category/${id}`,
        },
        update: {
          method: "PATCH",
          url: `/category/${id}`,
        },
        delete: {
          method: "DELETE",
          url: `/category/${id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  patchCategoryById,
};
