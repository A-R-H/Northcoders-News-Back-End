const { Topic, Article, Comment } = require("../models");

const {
  getIdFromSlugOrId,
  getRandomUserId,
  addCommentCountsToArticleDocs
} = require("../utils");

exports.sendTopics = (req, res, next) => {
  return Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(err => {
      next({ status: 502, message: "Internal database error" });
    });
};

exports.sendArticlesByTopic = (req, res, next) => {
  return getIdFromSlugOrId(req.params.topic)
    .then(topic_id => {
      return Article.find({ belongs_to: topic_id })
        .lean()
        .populate("belongs_to", "-__v")
        .populate("created_by", "-__v");
    })
    .then(articleDocs => {
      return addCommentCountsToArticleDocs(articleDocs);
    })
    .then(articles => {
      res.send({ articles });
    })
    .catch(err => {
      if (err === "Topic not found") {
        next({ status: 404, message: err });
      } else next({ status: 502, message: "Internal database error" });
    });
};

exports.postArticle = (req, res, next) => {
  return Promise.all([getIdFromSlugOrId(req.params.topic), getRandomUserId()])
    .then(([belongs_to, created_by]) => {
      const article = req.body;
      article.belongs_to = belongs_to;
      article.created_by = created_by;
      return new Article(article).save();
    })
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(err => {
      if (err === "Topic not found") {
        next({ status: 404, message: err + ", article was not posted" });
      } else if (err.name === "ValidationError")
        next({
          status: 400,
          message: "Invalid article format, article was not posted"
        });
      else next({ status: 502, message: "Internal database error" });
    });
};
