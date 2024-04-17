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
        expect(body.length).toBe(13);
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
        expect(body.length).toBe(13);
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
        expect(body.length).toBe(13);
        expect(body).toBeSortedBy("created_at", {
          descending: true,
        });
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

  test("GET 400: Respond with an error when passed an article_id with an incorrect format", () => {
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

describe("/api/articles/:article_id/comments", () => {
  test("GET 200:  Respond with an  array of comments each containing 6 values in correct format.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });

  test("GET 200:  Respond with an  array of comments in DESC order.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("GET 200:  Respond with an empty array of comments if no comments added to the article.", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(0);
      });
  });

  test("POST 201: Respond with new added object to given article_id", () => {
    const postComment = {
      username: "butter_bridge",
      body: "test-body",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(postComment)
      .expect(201)
      .then(({ body }) => {
        console.log(body);
        expect(body.comment[0].author).toBe("butter_bridge");
        expect(body.comment[0].body).toBe("test-body");
      });
  });

  test("GET 400: Respond with an error when passed an article_id with an incorrect format", () => {
    return request(app)
      .get("/api/articles/invalid_id_format/comments")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid id type");
      });
  });

  test("GET 404: Respond with an error when passed an article_id that is not presented in the database.", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("id not found");
      });
  });

  test("POST 400: Respond with an error when passed an article_id with an incorrect format", () => {
    const postComment = {
      username: "butter_bridge",
      body: "test-body",
    };
    return request(app)
      .post("/api/articles/invalid_id_format/comments")
      .send(postComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid id type");
      });
  });

  test("POST 404: Respond with an error when passed an article_id that is not presented in the database.", () => {
    const postComment = {
      username: "butter_bridge",
      body: "test-body",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(postComment)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("id not found");
      });
  });

  test("POST 404: Respond with an error when passed username is not presented in the database.", () => {
    const postComment = {
      username: "test-username",
      body: "test-body",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(postComment)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("username not found");
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
