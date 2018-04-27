const { Comment } = require("../models");

exports.adjustCommentVotes = (req, res, next) => {
  let upOrDown;
  req.query.vote === "up"
    ? (upOrDown = 1)
    : req.query.vote === "down"
      ? (upOrDown = -1)
      : req.query.vote === undefined
        ? (upOrDown = "No change made, user must give an up or down vote query")
        : (upOrDown = "No change made, invalid vote passed");
  if (typeof upOrDown === "string") next({ status: 400, message: upOrDown });
  else
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
