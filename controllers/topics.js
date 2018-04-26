const { Topic, Article, Comment } = require("../models");

const {
  getTopicBySlug,
  getRandomUserId,
  addCommentCountsToArticleDocs
} = require("../utils");

exports.sendTopics = (req, res, next) => {
  return Topic.find().then(topics => {
    res.send({ topics });
  });
};

exports.sendArticlesByTopic = (req, res, next) => {
  return getTopicBySlug(req.params.topic_slug)
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
    });
};

exports.postArticle = (req, res, next) => {
  return Promise.all([getTopicBySlug(req.params.topic_slug), getRandomUserId()])
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
      console.log(err);
      next(err);
    });
};
