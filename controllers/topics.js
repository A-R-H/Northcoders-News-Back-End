const { Topic, Article, Comment } = require("../models");

const { getTopicBySlug, getRandomUserId } = require("../utils");

exports.sendTopics = (req, res, next) => {
  return Topic.find().then(topics => {
    res.send({ topics });
  });
};

exports.sendArticlesByTopic = (req, res, next) => {
  let articlesWithoutCommentCounts;
  return Article.find()
    .lean()
    .populate("belongs_to")
    .populate("created_by")
    .then(articles => {
      articlesWithoutCommentCounts = articles.reduce((acc, article) => {
        if (article.belongs_to.slug === req.params.topic_slug) {
          article.created_by = article.created_by.username;
          article.belongs_to = article.belongs_to.slug;
          acc.push(article);
        }
        return acc;
      }, []);
      return Promise.all(
        articles.map(article => {
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
  const newArticle = req.body;
  newArticle.belongs_to = getTopicBySlug(req.params.topic_slug);
  newArticle.created_by = getRandomUserId();
  return Article.create(newArticle).then(article => {
    res.send({ article });
  });
};
