const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const {
  postCategory,
  getCategories,
  getCategoriesById,
  updateCategoriesById,
  deleteCategory,
} = require("./categoriesServices");

const createCategory = async (req, res, next) => {
  const result = validationResult(req);
  const { name, description } = req.body;
  const { companyId } = req;

  try {
    // Error validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", date: error });
    }

    const category = await postCategory({ name, description, companyId });

    // check Exist category & return response
    if (category.isCategory) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        message: "Category  already Exist",
      });
    }

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
  const companyId = req.companyId;

  try {
    const categories = await getCategories(companyId);
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getSingleCategory = async (req, res, next) => {
  const id = req.params.id;
  const { companyId } = req;
  try {
    const category = await getCategoriesById({ id, companyId });

    if (category === null) {
      return res.status(200).json({
        code: 200,
        message: "Success",
        data: category,
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: category,
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
  const { name, description } = req.body;
  const { companyId } = req;
  const id = req.params.id;

  try {
    // Error validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request !", data: error });
    }

    const isCategory = await getCategoriesById({ id, companyId });
    if (!isCategory) {
      return res.status(404).json({
        code: 404,
        error: "404 Not Found!",
        message: "Content not Available",
      });
    }

    const updatedCategory = await updateCategoriesById({
      categoryData: req.body,
      companyId,
      id,
    });
    if (updatedCategory.fail) {
      return res.status(500).json({
        code: 500,
        error: "Server Error",
        message: "Update failed Please try again later",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Category updated Successful",
      data: updatedCategory,
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

const deleteCategoryById = async (req, res, next) => {
  try {
    // value destructure
    const { companyId } = req;
    const id = req.params.id;

    const isCategory = await getCategoriesById({ id, companyId });
    if (!isCategory) {
      return res.status(404).json({
        code: 404,
        error: "404 not found",
        message: "Content not available!",
      });
    }

    const deletedCategory = await deleteCategory({ id, companyId });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  patchCategoryById,
  deleteCategoryById,
};
