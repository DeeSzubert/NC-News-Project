const db = require("../db/connection");

function checkIfUserExists(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "username not found" });
      }
      return rows[0];
    });
}

function fetchAllUsers() {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
}

module.exports = { checkIfUserExists, fetchAllUsers };
