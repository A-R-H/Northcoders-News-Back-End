const { Comment } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;

exports.adjustCommentVotes = (req, res, next) => {
  let upOrDown;
  req.query.vote === "up"
    ? (upOrDown = 1)
    : req.query.vote === "down"
      ? (upOrDown = -1)
      : next({ status: 400, message: "Invalid vote passed" });
  return Comment.findByIdAndUpdate(
    ObjectId(req.params.comment_id),
    {
      $inc: { votes: upOrDown }
    },
    { new: true, select: { votes: true, _id: false } }
  )
    .then(comment => {
      res.send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  return Comment.remove({ _id: ObjectId(req.params.comment_id) })
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      next(err);
    });
};
