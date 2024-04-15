const express = require("express");
const app = express();
const { getAlltopics } = require("./controllers/topics-controllers");
const endpoints = require("./endpoints.json");

app.get("/api", (request, response, next) => {
  response.status(200).send({ endpoints });
});

app.get("/api/topics", getAlltopics);

app.all("*", (request, response) => {
  response.status(404).send({ message: "endpoint not found" });
});

module.exports = app;
