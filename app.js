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

app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status !== undefined)
    res.status(err.status).send({ message: err.message });
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
