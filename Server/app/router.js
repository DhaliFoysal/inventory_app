const router = require("express").Router();

const authRouter = require("../src/modules/auth/authRoute");
const healthRoutes = require("../src/modules/health/healthRoute");
const { usersRoute } = require("../src/modules/users/usersRoute");
const productsRouter = require("../src/modules/products/productsRoutes");

router.use("/api/v1/health", healthRoutes);
router.use("/api/v1/auth", authRouter);
router.use("/api/v1", usersRoute);
router.use("/api/v1/products", productsRouter);

module.exports = router;
