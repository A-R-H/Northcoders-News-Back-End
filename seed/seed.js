const mongoose = require("mongoose");
const { User, Article, Comment, Topic } = require("../models");
const { formatArticleData, createComments } = require("../utils");

const seedDB = (articleData, topicData, userData) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      console.log("Database dropped");
      return Promise.all([
        User.insertMany(userData),
        Topic.insertMany(topicData)
      ]);
    })
    .then(([userDocs, topicDocs]) => {
      console.log(`Inserted ${userDocs.length} users!`);
      console.log(`Inserted ${topicDocs.length} topics!`);
      const formattedArticleData = formatArticleData(
        articleData,
        topicDocs,
        userDocs
      );
      return Promise.all([
        userDocs,
        topicDocs,
        Article.insertMany(formattedArticleData)
      ]);
    })
    .then(([userDocs, topicDocs, articleDocs]) => {
      console.log(`Inserted ${articleDocs.length} articles!`);
      const randomComments = createComments(articleDocs, userDocs);
      return Promise.all([
        userDocs,
        topicDocs,
        articleDocs,
        Comment.insertMany(randomComments)
      ]);
    })
    .then(([userDocs, topicDocs, articleDocs, commentDocs]) => {
      console.log(`Inserted ${commentDocs.length} comments!`);
      return [userDocs, topicDocs, articleDocs, commentDocs];
    });
};

module.exports = seedDB;
