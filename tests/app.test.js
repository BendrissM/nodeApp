const expect = require("expect");
const request = require("supertest");

const Article = require("../models/article");
const app = require("../app").app;

beforeEach(done => {
  Article.deleteMany({}).then(() => done());
});

describe("POST /articles/create", () => {
  it("should create an article", done => {
    let title = "article test";
    let author = "moncef";
    let body = "this is the tes article";

    request(app)
      .post("/articles/create")
      .send({ title, author, body })
      .expect(200)
      .expect(res => {
        expect(res.body.title).toBe(title);
        expect(res.body.author).toBe(author);
        expect(res.body.body).toBe(body);
      })
      .end(err => {
        if (err) {
          return done(err);
        }

        Article.find({})
          .then(articles => {
            expect(articles.length).toBe(1);
            done();
          })
          .catch(err => done(err));
      });
  });
});
