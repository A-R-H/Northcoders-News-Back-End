const express = require("express");

const {
  sendTopics,
  sendArticlesByTopic,
  postArticle
} = require("../../controllers/topics");

const router = express.Router();

router.get("/", sendTopics);

router.get("/:topic_slug/articles", sendArticlesByTopic);

router.post("/:topic_slug/articles", postArticle);

module.exports = router;
