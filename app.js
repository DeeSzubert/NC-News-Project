const express = require("express");
const app = express();
const { getAlltopics } = require("./controllers/topics-controllers");

app.get("/api/topics", getAlltopics);

app.all("*", (request, response) => {
  response.status(404).send({ message: "endpoint not found" });
});

module.exports = app;
