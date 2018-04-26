const randomWords = require("random-words");
const { Topic, User, Comment } = require("../models");

exports.formatArticleData = (articleData, topicDocs, userDocs) => {
  const refObj = createTopicRefObj(topicDocs);
  return articleData.reduce((acc, article) => {
    acc.push({
      title: article.title,
      body: article.body,
      belongs_to: refObj[article.topic],
      votes: 0,
      created_by: randomForDevFirstForTest(userDocs)
    });
    return acc;
  }, []);
};

function createTopicRefObj(topicDocs) {
  return topicDocs.reduce((acc, topic) => {
    acc[topic.slug] = topic._id;
    return acc;
  }, {});
}

exports.createComments = (articleDocs, userDocs) => {
  const amount = process.env.NODE_ENV === "test" ? 3 : 50;
  const commentBodies = randomWords({
    exactly: amount,
    wordsPerString: 15,
    formatter: (word, index) => {
      return index === 0
        ? word
            .slice(0, 1)
            .toUpperCase()
            .concat(word.slice(1))
        : index === 14
          ? word.concat("!!!")
          : word;
    }
  });
  return commentBodies.map(body => {
    return {
      body,
      belongs_to: randomForDevFirstForTest(articleDocs),
      created_at: new Date().getTime(),
      votes: 0,
      created_by: randomForDevFirstForTest(userDocs)
    };
  });
};

function randomForDevFirstForTest(docs) {
  return process.env.NODE_ENV === "development"
    ? docs[Math.floor(Math.random() * docs.length)]._id
    : docs[0]._id;
}

exports.getTopicBySlug = slug => {
  return Topic.find({ slug }).then(topic => {
    return topic[0]._id;
  });
};

exports.getRandomUserId = () => {
  return User.find().then(users => {
    return users[Math.floor(Math.random() * users.length)]._id;
  });
};

exports.addCommentCountsToArticleDocs = docs => {
  return Promise.all(
    docs.map(article => {
      return Comment.count({ belongs_to: article._id });
    })
  ).then(commentCounts => {
    return docs.map((article, i) => {
      article.comments = commentCounts[i];
      return article;
    });
  });
};

exports.createFormattedComment = (body, article_id, user_id) => {
  return {
    body,
    belongs_to: article_id,
    created_by: user_id
  };
};
