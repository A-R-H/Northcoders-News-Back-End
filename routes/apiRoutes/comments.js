const express = require("express");

const {
  adjustCommentVotes,
  deleteComment
} = require("../../controllers/comments");

const router = express.Router();

router.put("/:comment_id", adjustCommentVotes);

router.delete("/:comment_id", deleteComment);

module.exports = router;
