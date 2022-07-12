const path = require("path");
const router = require("express").Router();

const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../_static", "index.html"));
});

module.exports = router;
