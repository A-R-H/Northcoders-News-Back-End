const { Comment } = require("../models");

exports.adjustCommentVotes = (req, res, next) => {
  let upOrDown =
    req.query.vote === "up" ? 1 : req.query.vote === "down" ? -1 : null;
  if (typeof upOrDown === "number") {
    return Comment.findByIdAndUpdate(
      req.params.comment_id,
      {
        $inc: { votes: upOrDown }
      },
      { new: true, select: { votes: true, _id: false } }
    )
      .then(comment => {
        if (comment === null)
          next({ status: 404, message: "Comment ID not found" });
        else res.send({ comment });
      })
      .catch(err => {
        if (err.name === "CastError")
          next({ status: 400, message: "Invalid comment ID format" });
        else next({ status: 502, message: "Internal database error" });
      });
  } else {
    return Comment.findById(req.params.comment_id)
      .then(comment => {
        if (comment === null)
          next({ status: 404, message: "Comment ID not found" });
        else
          res.send({
            comment: {
              votes: comment.votes
            }
          });
      })
      .catch(err => {
        if (err.name === "CastError")
          next({ status: 404, message: "Invalid comment ID format" });
        else next({ status: 502, message: "Internal database error" });
      });
  }
};

exports.deleteComment = (req, res, next) => {
  return Comment.remove({ _id: req.params.comment_id })
    .then(deleteMessage => {
      if (deleteMessage.n === 0)
        next({ status: 404, message: "Comment not found" });
      else res.status(204).send();
    })
    .catch(err => {
      if (err.name === "CastError")
        next({ status: 400, message: "Invalid comment ID format" });
      else next({ status: 502, message: "Internal database error" });
    });
};
