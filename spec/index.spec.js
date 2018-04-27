process.env.NODE_ENV = "test";

const app = require("../app");
const seedDB = require("../seed/seed");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { Comment } = require("../models");

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
  describe("/", () => {
    it("GET / -> returns an object containing links to all of the endpoints", () => {
      return request
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.keys(["topics", "articles", "users", "comments"]);
        });
    });
  });
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
    it("GET /:topic_slug/articles -> returns all articles for a topic slug", () => {
      return request
        .get(`/api/topics/${topics[0].slug}/articles`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(2);
          expect(body.articles[1].title).to.equal(
            "7 inspirational thought leaders from Manchester UK"
          );
          expect(body.articles[1].created_by.username).to.equal(
            "butter_bridge"
          );
          expect(body.articles[0].comments).to.equal(3);
          expect(body.articles[1].comments).to.equal(0);
        });
    });
    it("GET /:topic_slug/articles -> returns a 404 error for non-existent topic slug", () => {
      return request.get(`/api/topics/sam/articles`).expect(404);
    });
    it("GET /:topic_id/articles -> returns all articles for a topic ID", () => {
      return request
        .get(`/api/topics/${topics[0]._id}/articles`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(2);
          expect(body.articles[1].title).to.equal(
            "7 inspirational thought leaders from Manchester UK"
          );
          expect(body.articles[1].created_by.username).to.equal(
            "butter_bridge"
          );
          expect(body.articles[0].comments).to.equal(3);
          expect(body.articles[1].comments).to.equal(0);
        });
    });
    it("GET /:topic_slug/articles -> returns a 404 error for non-existent topic ID", () => {
      return request
        .get(`/api/topics/5ae1ec6a5dd4b77149a4b655/articles`)
        .expect(404);
    });
    it("POST /:topic_slug/articles -> posts an article that belongs to the given topic slug and returns it", () => {
      const newArticle = {
        title: "A blog about Mitch",
        body: "You go Mitch!"
      };
      return request
        .post(`/api/topics/${topics[0].slug}/articles`)
        .send({
          title: "A blog about Mitch",
          body: "You go Mitch!"
        })
        .expect(201)
        .then(({ body }) => {
          expect(ObjectId(body.article._id)).to.be.an.instanceOf(ObjectId);
          expect(body.article.title).to.equal("A blog about Mitch");
          expect(body.article.body).to.equal("You go Mitch!");
        });
    });
    it("POST /:topic_slug/articles -> returns a 404 error for non-existant topic slug", () => {
      const newArticle = {
        title:
          "An exhaustive treatise concerning all research showing any potential merits of lectures at 8:30am",
        body: "-"
      };
      return request
        .post(`/api/topics/morning_lectures/articles`)
        .send(newArticle)
        .expect(404);
    });
    it("POST /:topic_slug/articles -> returns a 400 error when posting an incorrectly formatted article", () => {
      const newArticle = {
        body: "mitch"
      };
      return request
        .post(`/api/topics/mitch/articles`)
        .send(newArticle)
        .expect(400);
    });
    it("POST /:topic_id/articles -> posts an article that belongs to the given topic ID and returns it", () => {
      const newArticle = {
        title: "A blog about Mitch",
        body: "You go Mitch!"
      };
      return request
        .post(`/api/topics/${topics[0]._id}/articles`)
        .send({
          title: "A blog about Mitch",
          body: "You go Mitch!"
        })
        .expect(201)
        .then(({ body }) => {
          expect(ObjectId(body.article._id)).to.be.an.instanceOf(ObjectId);
          expect(body.article.title).to.equal("A blog about Mitch");
          expect(body.article.body).to.equal("You go Mitch!");
        });
    });
    it("POST /:topic_id/articles -> returns a 404 error for non-existant topic ID", () => {
      const newArticle = {
        title:
          "An exhaustive treatise concerning all research showing any potential merits of lectures at 8:30am",
        body: "-"
      };
      return request
        .post(`/api/topics/5ae1ec6a5dd4b77149a4b674/articles`)
        .send(newArticle)
        .expect(404);
    });
    it("POST /:topic_id/articles -> returns a 400 error when posting an incorrectly formatted article", () => {
      const newArticle = {
        body: "mitch"
      };
      return request
        .post(`/api/topics/${topics[0]._id}/articles`)
        .send(newArticle)
        .expect(400);
    });
  });
  describe("/articles", () => {
    it("GET / -> returns all articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(ObjectId(body.articles[0]._id)).to.be.an.instanceOf(ObjectId);
          expect(body.articles.length).to.equal(4);
          expect(body.articles[3].title).to.equal(
            "UNCOVERED: catspiracy to bring down democracy"
          );
          expect(body.articles[0].created_by.username).to.equal(
            "butter_bridge"
          );
          expect(body.articles[3].created_by.username).to.equal(
            "butter_bridge"
          );
        });
    });
    it("GET /:article_id -> returns single article by id", () => {
      return request
        .get(`/api/articles/${articles[0]._id}`)
        .expect(200)
        .then(({ body }) => {
          expect(ObjectId(body.article._id)).to.be.an.instanceOf(ObjectId);
          expect(body.article.title).to.equal(
            "Living in the shadow of a great man"
          );
          expect(body.article.created_by.username).to.equal("butter_bridge");
        });
    });
    it("GET /:article_id -> returns a 404 error for non-existent article", () => {
      return request.get(`/api/articles/5ae2f2e0b1f96232cf183660`).expect(404);
    });
    it("GET /:article_id -> returns a 400 error when passed a non-valid ID", () => {
      return request.get(`/api/articles/fakeID`).expect(400);
    });
    it("GET /:article_id/comments -> returns comments for an article", () => {
      return request
        .get(`/api/articles/${articles[0]._id}/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body.comments[0].body).to.be.a("string");
          expect(body.comments[0].created_by.username).to.equal(
            "butter_bridge"
          );
          expect(body.comments[1].created_by.username).to.equal(
            "butter_bridge"
          );
        });
    });
    it("GET /:article_id/comments -> returns a 404 error for non-existent article", () => {
      return request
        .get(`/api/articles/5ae2f2e0b1f96232cf183660/comments`)
        .expect(404);
    });
    it("GET /:article_id/comments -> returns a 400 error when passed a non-valid ID", () => {
      return request.get(`/api/articles/fakeID/comments`).expect(400);
    });
    it("POST /:article_id/comments -> posts a comment on a specific article", () => {
      const newComment = {
        body: "This is a comment!!!"
      };
      return request
        .post(`/api/articles/${articles[0]._id}/comments`)
        .send({
          body: "This is a comment!!!"
        })
        .expect(201)
        .then(({ body }) => {
          expect(ObjectId(body.comment._id)).to.be.an.instanceOf(ObjectId);
          expect(body.comment.body).to.equal("This is a comment!!!");
          expect(body.comment.created_by.toString()).to.equal(
            users[0]._id.toString()
          );
        });
    });
    it("POST /:article_id/comments -> returns a 404 error for non-existant article", () => {
      const newComment = {
        body: "This is a comment!!!"
      };
      return request
        .post(`/api/articles/5ae2f2dcb1f96232cf18365f/comments`)
        .send(newComment)
        .expect(404);
    });
    it("POST /:article_id/comments -> returns a 400 error when posting an incorrectly formatted comment", () => {
      const newComment = {
        votes: "loads"
      };
      return request
        .post(`/api/articles/${articles[0]._id}/comments`)
        .send(newComment)
        .expect(400);
    });
    it("PUT /:article_id?vote=up -> Increments vote count on article", () => {
      return request
        .put(`/api/articles/${articles[0]._id}?vote=up`)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(1);
        });
    });
    it("PUT /:article_id?vote=down -> Decrements vote count on article", () => {
      return request
        .put(`/api/articles/${articles[0]._id}?vote=down`)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(-1);
        });
    });
    it("PUT /:article_id?vote=notUpOrDown -> returns a 400 error when passed an invalid vote query", () => {
      return request
        .put(`/api/articles/${articles[0]._id}?vote=biggerPlease`)
        .expect(400);
    });
    it("PUT /:article_id?vote=notUpOrDown -> returns a 400 error when passed no vote query", () => {
      return request.put(`/api/articles/${articles[0]._id}`).expect(400);
    });
  });
  describe("/comments", () => {
    it("PUT /:comment_id?vote=up -> Increments vote count on comment", () => {
      return request
        .put(`/api/comments/${comments[0]._id}?vote=up`)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(1);
        });
    });
    it("PUT /:comment_id?vote=down -> Decrements vote count on comment", () => {
      return request
        .put(`/api/comments/${comments[0]._id}?vote=down`)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment.votes).to.equal(-1);
        });
    });
    it("PUT /:comment_id?vote=notUpOrDown -> returns a 400 error when passed an invalid vote query", () => {
      return request
        .put(`/api/comments/${comments[0]._id}?vote=biggerPlease`)
        .expect(400);
    });
    it("PUT /:comment_id?vote=notUpOrDown -> returns a 400 error when passed no vote query", () => {
      return request.put(`/api/comments/${comments[0]._id}`).expect(400);
    });
    it("DELETE /:comment_id -> Deletes a comment", () => {
      return request
        .delete(`/api/comments/${comments[0]._id}`)
        .expect(204)
        .then(() => {
          return Comment.count({ belongs_to: articles[0]._id });
        })
        .then(commentCount => {
          expect(commentCount).to.equal(2);
        });
    });
    it("DELETE /:comment_id -> returns a 404 error when trying to delete a non-existent comment", () => {
      return request
        .delete(`/api/comments/5ae2f2e0b1f96232cf183660`)
        .expect(404);
    });
  });
  describe("/users", () => {
    it("GET /:username -> returns user information", () => {
      return request
        .get(`/api/users/${users[0].username}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.user.username).to.equal("butter_bridge");
          expect(body.user.name).to.equal("jonny");
        });
    });
    it("GET /:user_id -> returns a 404 error for non-existent user", () => {
      return request.get(`/api/users/5ae2f2e0b1f96232cf183660`).expect(404);
    });
  });
});
