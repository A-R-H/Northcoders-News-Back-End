process.env.NODE_ENV = "test";

const app = require("../app");
const seedDB = require("../seed/seed");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const { articleData, topicData, userData } = require("../seed/testData");

const request = require("supertest")(app);
const { expect } = require("chai");

describe("/api", () => {
  let articles, topics, users, comments;
  beforeEach(() => {
    return seedDB(articleData, topicData, userData).then(docs => {
      [articles, topics, users, comments] = docs;
    });
  });
  after(() => mongoose.disconnect());
  // describe("/", () => {
  //   it("", () => {});
  // });
  describe("/topics", () => {
    it("GET / -> returns all topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(ObjectId(body.topics[0]._id)).to.be.an.instanceOf(ObjectId);
          expect(body.topics.length).to.equal(2);
          expect(body.topics[1].title).to.equal("Cats");
        });
    });
    it("GET /:topic_slug/articles -> returns all articles for a topic", () => {
      return request
        .get(`/api/topics/${topics[0].slug}/articles`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(2);
          expect(body.articles[1].title).to.equal(
            "7 inspirational thought leaders from Manchester UK"
          );
          expect(body.articles[1].created_by).to.equal("butter_bridge");
          expect(body.articles[0].comments).to.equal(3);
          expect(body.articles[1].comments).to.equal(0);
        });
    });
    it("POST /:topic_slug/articles -> posts an article that belongs to the given topic and returns it", () => {
      const newArticle = {
        title: "A blog about Mitch",
        body: "You go Mitch!"
      };
      return request
        .post(`/api/topics/${topics[0].slug}/articles`)
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(ObjectId(body.article._id)).to.be.an.instanceOf(ObjectId);
          expect(body.article.title).to.equal("A blog about Mitch");
          expect(body.article.body).to.equal("You go Mitch!");
        });
    });
  });
});
