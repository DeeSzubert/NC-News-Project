# Northcoders News API

General Information
Northcoders News (NCNews) is a project that serves as a platform for reading news articles and commenting on them. Users can access articles based on topics they are interested in and engage with the community through comments.

Technologies Used and Project Requiremnets:

devDependencies:
"jest": "^27.5.1",
"jest-extended": "^2.0.0",
"jest-sorted": "^1.0.15",
"supertest": "^6.3.4"

dependencies
"dotenv": "^16.4.5",
"pg": "^8.11.5",
"pg-format": "^1.0.4",
"express": "^4.19.2"

jest
"setupFilesAfterEnv":
"jest-extended/all",
"jest-sorted"

Installation:

1 - Clone the repository from GitHub: https://github.com/DeeSzubert/NC-News-Project

2 - Navigate to the project directory

3 - Install dependencies
npm install

4 - Set up the database
npm run setup-dbs

    In order to successfully connect to the two databases locally:
    - create .env.development file in root directory with variable PGDATABASE=nc_news
    - create .env.test file in root directory with variable PGDATABASE=nc_news_test

5 - Seed the database with initial data
npm run seed

Usage:
"GET /api"
serves up a json representation of all the available endpoints of the api

"GET /api/articles"
serves an array of all articles"

"GET api/articles/:article_id"
serves an article object with given article_id

"GET /api/articles/:article_id/comments"
serves an array of all comments for given article_id

"GET /api/users"
serves an array of all users

"POST/api/articles/:article_id/comments"
adds new comment for a given article_id

"PATCH /api/articles/:article_id"
updates article for a given article_id

"DELETE /api/comments/:comment_id"
deletes comment for a given comment_id

Project Status
Project is in progress
