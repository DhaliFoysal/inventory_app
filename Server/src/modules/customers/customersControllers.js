const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const {
  createPost,
  fetchAllCustomer,
  fetchAllCustomerById,
  customersForDropdown,
  customerUpdate,
  customerDelete,
  createCustomer,
} = require("./customersService");
const generateUrl = require("../../utils/generateURL");
const { getCompanyById } = require("../companys/companysControllers");

const postCustomer = async (req, res, next) => {
  const result = validationResult(req);
  const companyId = req.companyId;
  const userData = req.body;

  try {
    // Error Validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bade Request !", data: error });
    }

    userData.isTrader = /^true$/i.test(req.body.isTrader);

    const customer = await createCustomer(userData, companyId);

    if (customer.isCustomer) {
      return res.status(409).json({
        code: 409,
        error: "Conflict",
        message: "Customer already Exist",
      });
    }

    return res.status(201).json({
      code: 201,
      message: "Success",
      data: customer,
      links: {
        self: {
          method: "POST",
          url: `/customers`,
        },
        update: {
          method: "PATCH",
          url: `/customers/${customer.id}`,
        },
        delete: {
          method: "DELETE",
          url: `/customers/${customer.id}`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// const getAllCustomers = async (req, res, next) => {
//   const companyId = req.companyId;
//   const result = validationResult(req);
//   let page = parseInt(req.query.page);
//   let limit = parseInt(req.query.limit);

//   try {
//     // error validation
//     if (!result.isEmpty()) {
//       const error = errorFormatter(result.errors);
//       return res
//         .status(400)
//         .json({ code: 400, error: "Bad Request", data: error });
//     }

//     const customers = await fetchAllCustomer(req.query, companyId);
//     const totalPage = Math.ceil(customers[0]?.total_customers / limit) || 0;
//     const currentUrl = generateUrl(req.query);
//     const queryURL = req.query;

//     queryURL.page = parseInt(queryURL.page) + 1;
//     const nextURL = generateUrl(queryURL);

//     queryURL.page = parseInt(queryURL.page) - 2;
//     const prevURL = generateUrl(queryURL);

//     const response = {
//       code: 200,
//       message: "Success",
//       data: customers,
//       pagination: {
//         page: `${page}`,
//         limit: `${limit}`,
//         total_page: `${totalPage}`,
//         total_items: `${customers[0]?.total_customers || 0}`,
//         next_page: `${page + 1}`,
//         prev_page: `${page - 1}`,
//       },
//       links: {
//         self: {
//           method: "GET",
//           url: `/customers?${currentUrl}`,
//         },
//         next: {
//           method: "GET",
//           url: `/customers?${nextURL}`,
//         },
//         prev: {
//           method: "GET",
//           url: `/customers?${prevURL}`,
//         },
//       },
//     };

//     if (page >= totalPage) {
//       delete response.pagination.next_page;
//       delete response.links.next;
//     }

//     if (page <= 1) {
//       delete response.pagination.prev_page;
//       delete response.links.prev;
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// };

// const getCustomersForDropdown = async (req, res, next) => {
//   const search = req.query.search;
//   const result = validationResult(req);

//   try {
//     // Error Validation
//     if (!result.isEmpty()) {
//       const error = errorFormatter(result.errors);
//       return res
//         .status(400)
//         .json({ code: 400, error: "Bade Request !", data: error });
//     }

//     const customers = await customersForDropdown(search, req.companyId);
//     const response = {
//       code: 200,
//       message: "Success",
//       data: customers,
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// };

// const getCustomerById = async (req, res, next) => {
//   const id = req.params.id;
//   const companyId = req.companyId;
//   const result = validationResult(req);

//   try {
//     // Error validation
//     if (!result.isEmpty()) {
//       const error = errorFormatter(result.errors);
//       return res
//         .status(400)
//         .json({ code: 400, error: "Bade Request !", data: error });
//     }

//     const customer = await fetchAllCustomerById(id, companyId);

//     // TODO implement pagination

//     // todo  implement pagination

//     if (customer.length <= 0) {
//       return res
//         .status(404)
//         .json({
//           code: 404,
//           error: "Not Found",
//           message: "Content not available",
//         });
//     }
//     const response = {
//       code: 200,
//       message: "Success",
//       data: customer[0] || {},
//       links: {
//         self: {
//           method: "GET",
//           url: `/customers/${id}`,
//         },
//         update: {
//           method: `PATCH`,
//           url: `/customers/${id}`,
//         },
//         delete: {
//           method: `DELETE`,
//           url: `/customers/${id}`,
//         },
//       },
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// };

// const patchCustomerById = async (req, res, next) => {
//   const id = req.params.id;
//   const data = req.body;

//   const errorResult = validationResult(req);

//   try {
//     // Error Validation
//     if (!errorResult.isEmpty()) {
//       const error = errorFormatter(errorResult.errors);
//       return res
//         .status(400)
//         .json({ code: 400, error: "Bad Request", data: error });
//     }

//     const result = await customerUpdate(id, req.companyId, data);

//     if (result === false) {
//       return res.status(404).json({
//         code: 404,
//         error: "Not Found",
//         message: "Content not available",
//       });
//     }

//     const response = {
//       code: 200,
//       message: "Success",
//       data: result[0],
//       link: {
//         self: {
//           method: "PATCH",
//           url: `/customers/${id}`,
//         },
//         update: {
//           method: "PATCH",
//           url: `/customers/${id}`,
//         },
//         delete: {
//           method: "DELETE",
//           url: `/customers/${id}`,
//         },
//       },
//     };
//     return res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteCustomerById = async (req, res, next) => {
//   const user = {
//     userId: req.userId,
//     role: req.role,
//     companyId: req.companyId,
//   };
//   const customerId = req.params.id;

//   try {
//     const result = await customerDelete(customerId, req.companyId);
//     if (result === false) {
//       return res.status(404).json({
//         code: 404,
//         error: "Not Found",
//         message: "Content not available!",
//       });
//     }

//     if (result === true) {
//       return res.status(204).json();
//     }
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  postCustomer,
  // getAllCustomers,
  // getCustomersForDropdown,
  // getCustomerById,
  // patchCustomerById,
  // deleteCustomerById,
};
