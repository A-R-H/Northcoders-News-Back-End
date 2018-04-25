const seedDb = require("./seed");
const mongoose = require("mongoose");
const { articleData, topicData, userData } = require("./devData");

mongoose
  .connect("mongodb://localhost:27017/northcoders_news")
  .then(() => seedDb(articleData, topicData, userData))
  .then(() => mongoose.disconnect());
