const seedDb = require("./seed");
const mongoose = require("mongoose");
const { articleData, topicData, userData } = require("./devData");
const path = require("../config");

mongoose
  .connect(path)
  .then(() => seedDb(articleData, topicData, userData))
  .then(() => mongoose.disconnect());
