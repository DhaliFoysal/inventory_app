const db = require("../../../db/db");

const checkProductByName = async (productName, companyId) => {
  try {
    const queryText = `SELECT * FROM products 
                     WHERE name="${productName}" AND companyId="${companyId}"`;

    const [rows] = await db.query(queryText);
    return rows;
  } catch (error) {
    throw new Error(error);
  }
};

const createProduct = async (value, companyId, userId) => {
  const inHandStock = value.stockInHandList;

  try {
    const insertText = `INSERT INTO products(companyId, categoryId, buyingTaxId, sellingTaxId, name, barcode, buyingPrice, sellingPrice, measurementUnitId,userId,isActive, warranty, warrantyType, img) 
    VALUES ('${companyId}','${value.categoryId}','${value.buyingTaxId}','${
      value.sellingTaxId
    }','${value.name}','${value.barcode}','${value.buyingPrice}','${
      value.sellingPrice
    }','${value.measurementUnitId}','${userId}','${value.isActive}','${
      value.warranty
    }','${value.warrantyType}','${value.img || null}')`;

    const [rows] = await db.query(insertText);

    if (!rows.insertId) {
      throw new Error();
    }

    const stockValue = inHandStock.map((item) => {
      return `('${item.itemSerials}','${item.wireHouseName}','${item.wireHouseId}','${item.quantity}','${rows.insertId}','${companyId}','${value.barcode}')`;
    });

    const stockInsertQuery = `INSERT INTO stocks (itemSerials, wireHouseName, wireHouseId, quantity, productId, companyId, barcode ) 
    VALUES ${stockValue}`;

    const result = await db.query(stockInsertQuery);

    if (!result[0].insertId) {
      await db.query(`DELETE FROM stocks WHERE id=${rows.insertId}`);
      throw new Error("Product Create Fail!");
    }

    const productQuery = `SELECT * FROM products WHERE id=${rows.insertId}`;
    const stockQuery = `SELECT * FROM stocks WHERE productId=${rows.insertId}`;

    let product = await db.query(productQuery);
    let stock = await db.query(stockQuery);
    product = product[0][0];
    stock = stock[0];

    return { error: false, data: { product, stock } };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createProduct,
  checkProductByName,
};
