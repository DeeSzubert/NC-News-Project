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
  test("GET 200: Respond with an articles array of article objects with following properties: author, title, article_id, topic, created_at,votes, article_img_url, comment_count in correct format", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
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
        const { articles } = body;
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("POST 200: Respond with an added article", () => {
    const newArticle = {
      title: "New Article",
      topic: "cats",
      author: "butter_bridge",
      body: "new body for article",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const { newArticle } = body;
        console.log(body);
        expect(newArticle.title).toBe("New Article");
        expect(newArticle.topic).toBe("cats");
        expect(newArticle.author).toBe("butter_bridge");
        expect(newArticle.body).toBe("new body for article");
        expect(newArticle.votes).toBe(0);
        expect(newArticle.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
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

    test("GET 200: Respond with the correct article with comment count.", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.comment_count).toBe(11);
        });
    });

    test("GET 200: Respond with the correct article with comment count = 0 if no comments exist.", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.comment_count).toBe(0);
        });
    });

    test("PATCH 200: Respond with updated article with votes more than 0", () => {
      const newArticleVote = {
        inc_votes: 20,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(newArticleVote)
        .expect(200)
        .then(({ body }) => {
          const { patchedArticle } = body;
          expect(patchedArticle).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 120,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });

    test("PATCH 200: Respond with updated article with votes = 0", () => {
      const newArticleVote = {
        inc_votes: 20,
      };
      return request(app)
        .patch("/api/articles/3")
        .send(newArticleVote)
        .expect(200)
        .then(({ body }) => {
          const { patchedArticle } = body;
          expect(patchedArticle.votes).toBe(20);
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

    test("PATCH 400: Respond with an error when passed an article_id with an incorrect format", () => {
      const newArticleVote = {
        inc_votes: 20,
      };
      return request(app)
        .patch("/api/articles/invalid_id_format")
        .send(newArticleVote)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("invalid id type");
        });
    });

    test("PATCH 400: Respond with an error when passed a body with an incorrect value format", () => {
      const newArticleVote = {
        inc_votes: "twenty",
      };
      return request(app)
        .patch("/api/articles/1")
        .send(newArticleVote)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("invalid id type");
        });
    });

    test("PATCH 404: Respond with an error when passed an article_id that is not presented in the database.", () => {
      const newArticleVote = {
        inc_votes: 20,
      };

      return request(app)
        .patch("/api/articles/9999")
        .send()
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
          expect(Array.isArray(comments)).toBe(true);
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
          const { comment } = body;
          expect(comment.author).toBe("butter_bridge");
          expect(comment.body).toBe("test-body");
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

    test("POST 400: Respond with an error when passed an article_id with an body of incorrect format", () => {
      const postComment = {
        userblame: "butter_bridge",
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
          expect(message).toBe("doesn't exists in database");
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
          expect(message).toBe("doesn't exists in database");
        });
    });
  });

  describe("/api/comments/:comment_id", () => {
    test("DELETE 204: Respond with status code 204 and 'No Content' message", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ res }) => {
          expect(res.statusMessage).toBe("No Content");
        });
    });

    test("DELETE 400: Respond with an error when passes a comment_id with incorrect format", () => {
      return request(app)
        .delete("/api/comments/invalid_id_format")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("invalid id type");
        });
    });

    test("DELETE 404: Respond with an error when passes a comment which is not presented in the database.", () => {
      return request(app)
        .delete("/api/comments/99")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("comment not found");
        });
    });
  });

  describe("/api/users", () => {
    test("GET 200: Responds with an array of user objects, each of which should have 3 properties: username, name and avatar_url. ", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(Object.keys(user).length).toBe(3);
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
        });
    });
  });

  describe("api/articles?query", () => {
    test("GET 200: Respond with the correct articles for the given topic.", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;

          expect(articles.length).toBe(12);
        });
    });

    test("GET 200: Respond with an articles array of article objects sorted by given column in default DESC order.", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("author", {
            descending: true,
          });
          expect(articles.length).toBe(13);
        });
    });

    test("GET 200: Respond with an articles array of article objects sorted by articles by given column and given order", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(13);
          expect(articles).toBeSortedBy("topic");
        });
    });

    test("GET 404: Respond with an error when passes a query which is not presented in the database.", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid&order=asc")
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("invalid query value");
        });
    });

    test("GET 404: Respond with an error when passes a query which is not presented in the database.", () => {
      return request(app)
        .get("/api/articles?topic=incorrect_query")
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("topic not found");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  test("PATCH 200: Respond with updated comment with positive vote", () => {
    const newCommentVote = {
      inc_votes: 1,
    };

    return request(app)
      .patch("/api/comments/1")
      .send(newCommentVote)
      .expect(200)
      .then(({ body }) => {
        const { patchedComment } = body;
        expect(patchedComment.votes).toBe(17);
      });
  });

  test("PATCH 200: Respond with updated comment with negative vote", () => {
    const newCommentVote = {
      inc_votes: -1,
    };

    return request(app)
      .patch("/api/comments/2")
      .send(newCommentVote)
      .expect(200)
      .then(({ body }) => {
        const { patchedComment } = body;
        expect(patchedComment.votes).toBe(13);
      });
  });
  test("PATCH 200: Respond with updated comment with negative vote in votes are 0", () => {
    const newCommentVote = {
      inc_votes: -1,
    };

    return request(app)
      .patch("/api/comments/5")
      .send(newCommentVote)
      .expect(200)
      .then(({ body }) => {
        const { patchedComment } = body;
        expect(patchedComment.votes).toBe(-1);
      });
  });

  test("PATCH 404: Respond with an error when comment doesn't exists", () => {
    const newCommentVote = {
      inc_votes: -1,
    };

    return request(app)
      .patch("/api/comments/999")
      .send(newCommentVote)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("comment not found");
      });
  });
});

describe("/api/users/:username", () => {
  test("GET 200: Respond with an user object with following properties username, name and avatar_url", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;

        expect(user.username).toBe("butter_bridge");
        expect(user.name).toBe("jonny");
        expect(user.avatar_url).toBe(
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
      });
  });

  test("GET 404: Respond with an error if passed invalid username", () => {
    return request(app)
      .get("/api/users/unknown-user")
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
