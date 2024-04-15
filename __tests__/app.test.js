const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");
const request = require("supertest");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("/api/topics", () => {
  test("GET200: Responds with an array of topic objects, each of which should have properties slug and descritpion", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
        body.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("Undeclared endpoints", () => {
  test("ALL 404: Responds with an error when the endpoint has not been found", () => {
    return request(app)
      .get("/api/undeclared-endpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("endpoint not found");
      });
  });
});
