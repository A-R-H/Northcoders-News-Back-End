const express = require("express");

const { topicsRouter } = require("./apiRoutes");

const router = express.Router();

router.use("/topics", topicsRouter);

module.exports = router;
