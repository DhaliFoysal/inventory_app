const db = require("../../../db/db");
const paymentSlipGenerator = require("../../utils/paymentSlipGenerator");

const createPayment = async (userId, companyId, data) => {
  try {
    // total Due Amount
    let totalDueAmount = await db.query(
      `SELECT balance FROM customers  WHERE id = ${data.customerId} AND companyId = ${companyId}`
    );
    totalDueAmount = totalDueAmount[0][0].balance;

    if (totalDueAmount < 0) {
      totalDueAmount = -totalDueAmount;
    } else if (totalDueAmount > 0) {
      totalDueAmount = -totalDueAmount;
    }

    const TotalCurrentDueBalance =
      totalDueAmount - parseInt(data.paymentAmount);

    // create & update data
    const newPaymentSlip = await paymentSlipGenerator(companyId);
    const date = data.date || new Date().toISOString();
    const createPaymentQuery = `INSERT INTO payments(companyId, customerId, userId, paymentSlip, account, method, amount, prevDueBalance, currentDueBalance, note, createdAt, updatedAt)
             VALUES ('${companyId}','${data.customerId}','${userId}','${newPaymentSlip}','${data.methodName}','${data.paymentMethod}','${data.paymentAmount}','${totalDueAmount}','${TotalCurrentDueBalance}','${data.note}','${date}','${date}')`;

    const createPayment = await db.query(createPaymentQuery);

    return { newPaymentId: createPayment[0].insertId, newPaymentSlip };
  } catch (error) {
    throw new Error(error);
  }
};

const customerBalanceUpdate = async (
  customerId,
  companyId,
  balance,
  newPaymentId
) => {
  const customerQuery = `UPDATE customers SET balance = balance + ${balance} WHERE id = ${customerId} AND companyId = ${companyId}`;
  const deletePaymentQuery = `DELETE FROM payments WHERE id = ${newPaymentId}`;

  try {
    const updateCustomer = await db.query(customerQuery);
    return updateCustomer[0].changedRows;
  } catch (error) {
    await db.query(deletePaymentQuery);
    throw new Error(error);
  }
};

const createPaymentFor = async (data) => {
  const {
    companyId,
    newPaymentSlip,
    invoiceObject,
    newPaymentId,
    customerId,
    paymentBalance,
  } = data;

  const deletePaymentQuery = `DELETE FROM payments WHERE id = ${newPaymentId}`;
  const reversAmountQuery = `UPDATE customers SET balance = balance - ${paymentBalance} WHERE id = ${customerId} AND companyId = ${companyId}`;

  try {
    let values = ``;
    invoiceObject.map((value) => {
      values =
        values +
        `('${companyId}', '${newPaymentSlip}', '${value.invoiceNo}', '${value.amount}')`;
    });

    values = values.split(")(").join("),(");
    const createQuery = `INSERT INTO paymentsfor (companyId, paymentSlip, invoiceNo, amount) 
                      VALUES ${values}`;

    const createResult = await db.query(createQuery);
    let newPaymentIdArray = [];

    for (let i = 0; i < createResult[0]?.affectedRows; i++) {
      newPaymentIdArray.push(createResult[0].insertId + i);
    }
    return newPaymentIdArray;
  } catch (error) {
    await db.query(deletePaymentQuery);
    await db.query(reversAmountQuery);
    throw new Error(error);
  }
};

const updateSales = async (data, companyId, newPaymentId, newPaymentForId) => {
  const { customerId, paymentAmount } = data;
  let updateQuery = ``;
  let selectQuery = ``;
  let invoices = [];

  const deletePaymentQuery = `DELETE FROM payments WHERE id = ${newPaymentId}`;
  const reversAmountQuery = `UPDATE customers SET balance = balance - ${paymentAmount} WHERE id = ${customerId} AND companyId = ${companyId}`;
  let newPaymentForQuery = `DELETE FROM paymentsfor WHERE id IN (${newPaymentForId.join(
    ","
  )})`;

  try {
    data.paymentFor.map((value) => {
      invoices.push(value.invoiceNo);
      selectQuery =
        selectQuery +
        "SELECT invoiceNo, dueAmount FROM sales WHERE invoiceNo = ?;";
    });

    const result = await db.query(selectQuery, invoices);

    let existAmount = [];

    if (result[0].length > 1) {
      result[0].map((value) => {
        existAmount.push(value[0]);
      });
    } else {
      existAmount = result[0];
    }

    let count = 0;
    data.paymentFor.map((value) => {
      let rightBalance;

      if (value.amount > existAmount[count].dueAmount) {
        rightBalance = existAmount[count].dueAmount;
      } else {
        rightBalance = value.amount;
      }
      count = count + 1;
      updateQuery =
        updateQuery +
        `UPDATE sales SET dueAmount = dueAmount - ${rightBalance} WHERE invoiceNo = ?;`;
    });

    const updateResult = await db.query(updateQuery, invoices);
    return updateResult[0];
  } catch (error) {
    await db.query(deletePaymentQuery);
    await db.query(reversAmountQuery);
    await db.query(newPaymentForQuery);
    throw new Error(error);
  }
};

module.exports = {
  createPayment,
  customerBalanceUpdate,
  updateSales,
  createPaymentFor,
};
