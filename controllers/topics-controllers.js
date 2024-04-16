const { fetchAllTopics } = require("../models/topics-models.js");

function getAlltopics(request, response, next) {
  fetchAllTopics().then((topics) => {
    response.status(200).send(topics);
  });
}

module.exports = { getAlltopics };
