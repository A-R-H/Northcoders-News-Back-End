const { Article, Comment } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;

const {
  addCommentCountsToArticleDocs,
  createFormattedComment,
  getRandomUserId
} = require("../utils");

exports.sendArticles = (req, res, next) => {
  return Article.find()
    .lean()
    .populate("belongs_to", "-__v")
    .populate("created_by", "-__v")
    .then(articleDocs => {
      return addCommentCountsToArticleDocs(articleDocs);
    })
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => {
      next(err);
    });
};

exports.sendArticleById = (req, res, next) => {
  return Article.find({ _id: ObjectId(req.params.article_id) })
    .lean()
    .populate("belongs_to", "-__v")
    .populate("created_by", "-__v")
    .then(articleDoc => {
      return addCommentCountsToArticleDocs(articleDoc);
    })
    .then(article => {
      article = article[0];
      res.send({ article });
    })
    .catch(err => {
      next(err);
    });
};

exports.sendCommentsOnArticle = (req, res, next) => {
  return Comment.find(
    { belongs_to: ObjectId(req.params.article_id) },
    { belongs_to: false }
  )
    .populate("created_by", "-__v")
    .then(comments => {
      res.send({ comments });
    });
};

exports.postComment = (req, res, next) => {
  return getRandomUserId()
    .then(user => {
      return new Comment(
        createFormattedComment(req.body.body, req.params.article_id, user)
      ).save();
    })
    .then(comment => {
      res.status(201).send({ comment });
    });
};
