const router = require("express").Router();

const authRouter = require("../src/modules/auth/authRoute");
const healthRoutes = require("../src/modules/health/healthRoute");
const { usersRoute } = require("../src/modules/users/usersRoute");
const productsRouter = require("../src/modules/products/productsRoutes");
const categoryRouter = require("../src/modules/categories/categoriesRoutes");
const taxRouters = require("../src/modules/tax/taxRoutes");
const customerRouters = require("../src/modules/customers/customersRoutes");
const measurementUnitRouters = require("../src/modules/measurementUnits/measurementUniteRoutes");

router.use("/api/v1/health", healthRoutes);
router.use("/api/v1/auth", authRouter);
router.use("/api/v1", usersRoute);
router.use("/api/v1/products", productsRouter);
router.use("/api/v1/categories", categoryRouter);
router.use("/api/v1/tax", taxRouters);
router.use("/api/v1/measurementunit", measurementUnitRouters);
router.use("/api/v1/customers", customerRouters);

module.exports = router;
