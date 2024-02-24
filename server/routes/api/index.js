const router = require("express").Router();
const projectRoutes = require("./projectRoutes");
const tagRoutes = require("./tagRoutes");

router.use("/projects", projectRoutes);
router.use("/tags", tagRoutes);

module.exports = router;
