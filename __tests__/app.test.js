const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");
const request = require("supertest");
const endpoints = require("../endpoints.json");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("/api", () => {
  test("GET200: Responds with all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ endpoints });
      });
  });
});

describe("/api/topics", () => {
  test("GET200: Responds with an array of topic objects, each of which should have properties: slug and description.", () => {
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

describe("/api/articles", () => {
  test("GET 200: Respond with an articles array of article of objects containing 8 values", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.forEach((article) => {
          expect(Object.keys(article).length).toBe(8);
        });
      });
  });

  test("GET 200: Respond with an articles array of article objects with following properties: author, title, article_id, topic, created_at,votes, article_img_url, comment_count in correct format", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.forEach((article, index) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });

  test("GET 200: Respond with an articles array of article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const ifDescendingOrder = body.every((article, index) => {
          if (index < body.length - 1) {
            return article.created_at >= body[index + 1].created_at;
          }
          return true;
        });

        expect(ifDescendingOrder).toBe(true);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: Respond with the correct article for the given article_id.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test("GET 400: Respond with an error when passed an article_id with an incorrect forma", () => {
    return request(app)
      .get("/api/articles/invalid_id_format")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid id type");
      });
  });

  test("GET 404: Respond with an error when passed an article_id that is not presented in the database.", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("id not found");
      });
  });
});

describe("Undeclared endpoints", () => {
  test("ALL 404: Responds with an error when the endpoint has not been found", () => {
    return request(app)
      .get("/api/undeclared-endpoint")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("endpoint not found");
      });
  });
});
