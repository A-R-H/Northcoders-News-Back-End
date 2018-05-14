const { Article, Comment } = require("../models");

const { addCommentCountsToArticleDocs, getRandomUserId } = require("../utils");

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
      next({ status: 502, message: "Internal database error" });
    });
};

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return Article.find({ _id: article_id })
    .lean()
    .populate("belongs_to", "-__v")
    .populate("created_by", "-__v")
    .then(articleDoc => {
      if (articleDoc.length === 0) throw "Article not found";
      return addCommentCountsToArticleDocs(articleDoc);
    })
    .then(article => {
      article = article[0];
      res.send({ article });
    })
    .catch(err => {
      if (err === "Article not found") {
        next({ status: 404, message: err });
      } else if (err.name === "CastError")
        next({ status: 400, message: "Bad request, search must use ID" });
      else next({ status: 502, message: "Internal database error" });
    });
};

exports.sendCommentsOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  return Article.findById(article_id)
    .then(article => {
      if (article === null) throw "Article not found";
      return Comment.find(
        { belongs_to: article_id },
        { belongs_to: false }
      ).populate("created_by", "-__v");
    })
    .then(comments => {
      res.send({ comments });
    })
    .catch(err => {
      if (err === "Article not found") next({ status: 404, message: err });
      else if (err.name === "CastError")
        next({ status: 400, message: "Bad request, search must use ID" });
      else next({ status: 502, message: "Internal database error" });
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req.body;
  return Promise.all([Article.findById(article_id), getRandomUserId()])
    .then(([article, user]) => {
      if (article === null) throw "Article not found";
      return new Comment({
        body,
        belongs_to: article_id,
        created_by: user
      }).save();
    })
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      if (err === "Article not found") next({ status: 404, message: err });
      else {
        err.name === "ValidationError"
          ? err.errors.belongs_to !== undefined
            ? next({
                status: 404,
                message: "Invalid article ID, comment was not posted"
              })
            : next({
                status: 400,
                message: "Invalid comment format, comment was not posted"
              })
          : next({ status: 502, message: "Internal database error" });
      }
    });
};

exports.adjustArticleVotes = (req, res, next) => {
  const { vote } = req.query;
  const { article_id } = req.params;
  let upOrDown = vote === "up" ? 1 : vote === "down" ? -1 : null;
  if (typeof upOrDown === "number") {
    return Article.findByIdAndUpdate(
      article_id,
      {
        $inc: { votes: upOrDown }
      },
      { new: true, select: { votes: true, _id: false } }
    )
      .then(article => {
        if (article === null)
          next({ status: 404, message: "Article ID not found" });
        else res.send({ article });
      })
      .catch(err => {
        if (err.name === "CastError")
          next({ status: 404, message: "Invalid article ID format" });
        else next({ status: 502, message: "Internal database error" });
      });
  } else {
    return Article.findById(article_id)
      .then(article => {
        if (article === null)
          next({ status: 404, message: "Article ID not found" });
        else
          res.send({
            article: {
              votes: article.votes
            }
          });
      })
      .catch(err => {
        if (err.name === "CastError")
          next({ status: 404, message: "Invalid article ID format" });
        else next({ status: 502, message: "Internal database error" });
      });
  }
};
