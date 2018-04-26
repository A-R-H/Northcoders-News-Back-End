const { Topic, Article, Comment } = require("../models");

const { getTopicBySlug, getRandomUserId } = require("../utils");

exports.sendTopics = (req, res, next) => {
  return Topic.find().then(topics => {
    res.send({ topics });
  });
};

exports.sendArticlesByTopic = (req, res, next) => {
  let articlesWithoutCommentCounts;
  return getTopicBySlug(req.params.topic_slug)
    .then(topic_id => {
      return Article.find({ belongs_to: topic_id })
        .lean()
        .populate("belongs_to")
        .populate("created_by");
    })
    .then(articleDocs => {
      articlesWithoutCommentCounts = articleDocs.map(articleDoc => {
        articleDoc.created_by = articleDoc.created_by.username;
        articleDoc.belongs_to = articleDoc.belongs_to.slug;
        return articleDoc;
      });
      return Promise.all(
        articleDocs.map(article => {
          return Comment.find({ belongs_to: article._id }).then(comments => {
            return comments.length;
          });
        })
      );
    })
    .then(commentCounts => {
      const articles = articlesWithoutCommentCounts.map((article, i) => {
        article.comments = commentCounts[i];
        return article;
      });
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
