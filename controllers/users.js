const { User } = require("../models");

exports.sendUsers = (req, res, next) => {
  return User.findOne({ username: req.params.username }).then(user => {
    res.send({ user });
  });
};
