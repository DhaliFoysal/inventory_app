const mysql = require("mysql2/promise");
// Database connection configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  database: "store_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
};

// Create the connection pool. The pool-specific settings are the defaults
const db = mysql.createPool(dbConfig);

// For pool initialization, see
(async () => {
  try {
    const [rows, fields] = await db.query("SELECT * FROM `user` WHERE 1");
    // Connection is automatically released when query resolves
    if (rows) {
      console.log("Data Base Connect Success");
    }
  } catch (err) {
    console.log(err);
  }
})();

module.exports = db;
