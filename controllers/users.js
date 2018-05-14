const { User } = require("../models");

exports.sendUsers = (req, res, next) => {
  const { username } = req.params;
  return User.findOne({ username })
    .then(user => {
      if (user === null) throw "User not found";
      res.send({ user });
    })
    .catch(err => {
      if (err === "User not found") {
        next({ status: 404, message: err });
      } else next({ status: 502, message: "Internal database error" });
    });
};
