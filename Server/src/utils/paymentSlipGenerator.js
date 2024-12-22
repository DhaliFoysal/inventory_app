const db = require("../../db/db");

const paymentSlipGenerate = async (companyId) => {
  let existSlip = await db.query(
    `SELECT paymentSlip FROM payments WHERE companyId = ${companyId} ORDER BY id DESC LIMIT 1;`
  );
  if(!existSlip[0][0]){
    return "REC-" + 100
  }
  existSlip = existSlip[0][0]?.paymentSlip;
  const newSlip = parseInt(existSlip?.split("-")[1]) + 1;
  return "REC-" + newSlip
};

module.exports = paymentSlipGenerate;
