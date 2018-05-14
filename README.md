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
* [body-parser](https://www.npmjs.com/package/body-parser) - Node.js body parsing middleware.

## Downloading For External Use

The 4 production dependencies are listed above however there are also 4 recommended development dependencies that will help with the testing included and further development.

* [chai](https://www.npmjs.com/package/chai) - Chai is a BDD / TDD assertion library for node and the browser.
* [mocha](https://www.npmjs.com/package/mocha) - Simple, flexible, fun JavaScript test framework for Node.js & The Browser.
* [nodemon](https://www.npmjs.com/package/nodemon) - nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.
* [supertest](https://www.npmjs.com/package/supertest) - HTTP assertions made easy via superagent.

Not included in this repository are the development/test/production files in the config folder that export (through an index file) a string that is a link to the mongo database e.g. "mongodb://\<user\>:\<password\>@\<mlab:port\>/\<database-name\>".

The seed file provided should create an appropriate local mongo database. This can be ran using 'npm seed:dev'.

## Testing Code Additions

The provided tests (ran through the 'npm test' script) are set up to test all of the existing server endpoints and correct/incorrect usage of them by users. Any tests written for additional endpoints created should follow the same structure.

## Hosting

The app is hosted on [heroku](https://www.heroku.com/) and can easily be re-hosted if this repo is cloned and modified. The 2 config variables that will need to be added are the 'NODE_ENV' (production) and the 'DB_URL' (the link to the hosted mongo database e.g. "mongodb://\<user\>:\<password\>@\<mlab:port\>/\<database-name\>")

Mongo databases can be hosted on [mlab](https://mlab.com/).
