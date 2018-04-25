const app = require("express")();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const DB_URL = require("./config");

const apiRouter = require("./routes/api");

mongoose.connect(DB_URL, () => {
  console.log(`Connected to ${DB_URL}`);
});

app.use(bodyParser.json());

app.use("/api", apiRouter);

module.exports = app;
