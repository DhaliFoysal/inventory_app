const { body } = require("express-validator");
const db = require("../../../db/db");
const postPaymentValidation = () => {
  let paymentMethod;
  return [
    body("date").isISO8601().withMessage("date must be toISOString"),

    body("customerId")
      .notEmpty()
      .withMessage("Customer id is Required")
      .custom(async (customerId) => {
        const customerQuery = `SELECT * FROM customers WHERE id = ${customerId}`;
        const isCustomer = await db.query(customerQuery);
        if (isCustomer[0].length <= 0) {
          throw new Error("Customer Not Found");
        }
      }),

    body("paymentFor").custom((value) => {
      if (value.length <= 0 || !value[0].invoiceNo) {
        throw new Error("PaymentFor must be array of Object With Object value");
      }
      return true;
    }),

    body("paymentFor").custom(async (values, { req }) => {
      let invoices = [];
      let invoiceObject = []
      let invoiceQuery = ``;
      values.map((value) => {
        invoices.push(value.invoiceNo);
        invoiceObject.push(value)
        invoiceQuery =
          invoiceQuery + "SELECT * FROM sales WHERE invoiceNo = ?;";
      });
      
      req.body.invoices = invoices;
      req.body.invoiceObject = invoiceObject

      const checkInvoice = await db.query(invoiceQuery, invoices);
      let isInvoice = true;
      if (invoices.length > 1) {
        checkInvoice[0]?.map((value) => {
          if (value.length <= 0) {
            isInvoice = false;
          }
        });
      }


      if (!isInvoice) {
        throw new Error("Invoice not Found");
      }
      return true;
    }),

    body("paymentMethod")
      .notEmpty()
      .withMessage("payment Method is Required")
      .custom((value) => {
        paymentMethod = value;
        if (
          value === "mobileBanking" ||
          value === "cash" ||
          value === "bank" ||
          value === "cheque"
        ) {
          return true;
        } else {
          throw new Error(
            "payment Method must be (mobile Banking, Cash, Bank OR Cheque)"
          );
        }
      }),

    body("methodName").custom(async (value, { req }) => {
      if (paymentMethod === "mobileBanking" && value === "") {
        throw new Error("method Name is Required");
      }

      if (
        req.body.paymentMethod === "mobileBanking" ||
        req.body.paymentMethod === "bank"
      ) {
        let paymentMethod = `SELECT * FROM accounts WHERE type = '${req.body.paymentMethod}' AND name = '${value}'`;
        const isPaymentMethod = await db.query(paymentMethod);
        if (isPaymentMethod[0].length <= 0) {
          throw new Error("Method Name not found");
        }
      }
      return true;
    }),

    body("account").custom((value) => {
      if (paymentMethod === "bank" && value === "") {
        throw new Error("account is Required");
      }
      return true;
    }),

    body("paymentAmount")
      .notEmpty()
      .withMessage("payment Amount is Required")
      .isInt()
      .withMessage("payment Amount must be a Number"),

    body("note")
      .isLength({ max: 20 })
      .withMessage("Note must be max 20 characters"),
  ];
};

module.exports = {
  postPaymentValidation,
};
