const express = require("express");
const { notFoundError, errorHandler } = require("./error");
const { body, validationResult } = require("express-validator");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.post(
  "/api/v1/validator",
  body("userName").isLength({ min: 5 }),
  (req, res, next) => {
    try {
      const result = validationResult(req);
      console.log(result);
      
    } catch (error) {
      console.log(error);
    }
    
  }
);

app.use(require("./router"));

// Error handling middleware
app.use("/", notFoundError, errorHandler);

module.exports = app;
