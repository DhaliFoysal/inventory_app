const express = require("express");
const { notFoundError, errorHandler } = require("./error");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res, next) => {
  try {
    JSON.stringify(req.body);
    next();
  } catch (error) {
    console.log("json Error");
  }
});

app.use(require("./router"));

// Error handling middleware
app.use("/", notFoundError, errorHandler);

module.exports = app;
