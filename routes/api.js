const express = require("express");

const { topicsRouter, articlesRouter } = require("./apiRoutes");

const router = express.Router();

router.use("/topics", topicsRouter);

router.use("/articles", articlesRouter);

module.exports = router;
