const express = require("express");

const endPoints = require("../utils/endpoints");

const {
  topicsRouter,
  articlesRouter,
  commentsRouter,
  usersRouter
} = require("./apiRoutes");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send(endPoints);
});

router.use("/topics", topicsRouter);

router.use("/articles", articlesRouter);

router.use("/comments", commentsRouter);

router.use("/users", usersRouter);

module.exports = router;
