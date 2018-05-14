const { Comment } = require("../models");

exports.adjustCommentVotes = (req, res, next) => {
  const { vote } = req.query;
  const { comment_id } = req.params;
  let upOrDown = vote === "up" ? 1 : vote === "down" ? -1 : null;
  if (typeof upOrDown === "number") {
    return Comment.findByIdAndUpdate(
      comment_id,
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
    return Comment.findById(comment_id)
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
  const { comment_id } = req.params;
  return Comment.remove({ _id: comment_id })
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
