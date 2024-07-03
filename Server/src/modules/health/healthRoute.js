const router = require("express").Router();
const { checkHealth } = require("./healthController");

router.get("/", checkHealth);

module.exports = router;
