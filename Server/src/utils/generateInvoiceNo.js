const prisma = require("../../db/prisma");

async function generateInvoiceNo({ table, symbol, start, field }) {
  try {
    const lastSale = await prisma[table].findFirst({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        [field]: true,
      },
    });

    if (!lastSale) {
      return `${symbol}-${start}`;
    }

    const lastInvoiceString = lastSale[field].split("-")[1];
    const lastNumber = parseInt(lastInvoiceString, 10);

    if (isNaN(lastNumber)) {
      return `${symbol}-${start}`;
    }

    const nextNumber = lastNumber + 1;
    return `${symbol}-${nextNumber}`;
  } catch (error) {
    console.error("Error generating invoice:", error);
    throw error;
  }
}

module.exports = generateInvoiceNo;
