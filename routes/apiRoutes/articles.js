const express = require("express");

const {
  sendArticles,
  sendArticleById,
  sendCommentsOnArticle,
  postComment,
  adjustArticleVotes
} = require("../../controllers/articles");

const router = express.Router();

router.get("/", sendArticles);

router.get("/:article_id", sendArticleById);

router.get("/:article_id/comments", sendCommentsOnArticle);

router.post("/:article_id/comments", postComment);

router.put("/:article_id", adjustArticleVotes);

module.exports = router;
