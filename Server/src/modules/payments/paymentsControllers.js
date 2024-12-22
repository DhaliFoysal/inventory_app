const { validationResult } = require("express-validator");
const errorFormatter = require("../../utils/errorFormatter");
const {
  createPayment,
  customerBalanceUpdate,
  updateSales,
  createPaymentFor,
} = require("./paymentsServices");

const postPayment = async (req, res, next) => {
  const result = validationResult(req);
  const userId = req.userId;
  const companyId = req.companyId;
  const customerId = req.body.customerId;
  const paymentBalance = req.body.paymentAmount;
  const data = req.body;

  try {
    // Error Validation
    if (!result.isEmpty()) {
      const error = errorFormatter(result.errors);
      return res
        .status(400)
        .json({ code: 400, error: "Bad Request", data: error });
    }

    const { newPaymentId, newPaymentSlip } = await createPayment(
      userId,
      companyId,
      data
    );

    const changedRows = await customerBalanceUpdate(
      customerId,
      companyId,
      paymentBalance,
      newPaymentId
    );

    const newPaymentForId = await createPaymentFor({
      companyId,
      newPaymentSlip,
      newPaymentId,
      customerId,
      paymentBalance,
      invoices: req.body.invoices,
      invoiceObject: req.body.invoiceObject,
    });

    const updateSalesResult = await updateSales(
      data,
      companyId,
      newPaymentId,
      newPaymentForId
    );

    const response = {
      id: newPaymentId,
      customerId,
      paymentSlip: newPaymentSlip,
      slipNo: req.body.invoices,
      paymentMethod: data.paymentMethod,
      accountName: data.methodName,
      paymentAmount: data.paymentAmount,
      note: data.note,
      createdAt: data.date || new Date().toISOString(),
      updatedAt: data.date || new Date().toISOString(),
    };

    return res
      .status(201)
      .json({ code: 201, message: "Success", data: response });
  } catch (error) {
    next(error);
  }
};

const getAllPayment = async (req, res, next) => {
  try {
    console.log("getAllPayments");
  } catch (error) {}
};

const deletePayment = async (req, res, next) => {
  try {
    console.log("deletePayments");
  } catch (error) {}
};

module.exports = {
  postPayment,
  getAllPayment,
  deletePayment,
};
