const { request, response } = require("express");
const { fetchAllUsers } = require("../models/users-models");
const { checkIfUserExists } = require("../models/users-models");

function getAllUsers(request, response, next) {
  fetchAllUsers().then((users) => {
    response.status(200).send({ users });
  });
}

function getUserByUsername(request, response, next) {
  const { username } = request.params;
  checkIfUserExists(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((error) => next(error));
}

module.exports = { getAllUsers, getUserByUsername };
