# Northcoders News Back-End

A back-end server built to interface with a mongoDB database - providing useful api endpoints to perform CREATE, READ, UPDATE and DELETE operations on the four collections within.

Check it out --> https://northcoders-news-back.herokuapp.com/api/

### List of endpoints available

```http
GET /api
```

Serves a JSON object with information about the following endpoints

```http
GET /api/topics
```

Get all the topics

```http
GET /api/topics/:topic_id/articles
```

Return all the articles for a certain topic

```http
POST /api/topics/:topic_id/articles
```

Add a new article to a topic. This route requires a JSON body with title and body key value pairs
e.g: {
"title": "this is my new article title"
"body": "This is my new article content"
}

```http
GET /api/articles
```

Returns all the articles

```http
GET /api/articles/:article_id
```

Get an individual article

```http
GET /api/articles/:article_id/comments
```

Get all the comments for a individual article

```http
POST /api/articles/:article_id/comments
```

Add a new comment to an article. This route requires a JSON body with a comment key and value pair
e.g: {"comment": "This is my new comment"}

```http
PUT /api/articles/:article_id
```

Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: /api/articles/:article_id?vote=up

```http
PUT /api/comments/:comment_id
```

Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: /api/comments/:comment_id?vote=down

```http
DELETE /api/comments/:comment_id
```

Deletes a comment

```http
GET /api/users/:username
```

Returns a JSON object with the profile data for the specified user.

## Built With

* [express](https://www.npmjs.com/package/express) - Fast, unopinionated, minimalist web framework for node.
* [mongoose](https://www.npmjs.com/package/mongoose) - Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
* [random-words](https://www.npmjs.com/package/random-words) - random-words generates random words for use as sample text.
