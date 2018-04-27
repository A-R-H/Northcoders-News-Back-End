const express = require("express");

const {
  sendTopics,
  sendArticlesByTopic,
  postArticle
} = require("../../controllers/topics");

const router = express.Router();

router.get("/", sendTopics);

router.get("/:topic/articles", sendArticlesByTopic);

router.post("/:topic/articles", postArticle);

module.exports = router;
