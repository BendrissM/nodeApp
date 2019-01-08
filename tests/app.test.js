const expect = require("expect");
const request = require("supertest");

const Article = require("../models/article");
const app = require("../app").app;

const articles = [
  {
    title: "article One",
    author: "moncef",
    body: "this is article One"
  },
  {
    title: "article Two",
    author: "moncef",
    body: "this is article Two"
  }
];

beforeEach(done => {
  Article.deleteMany({}).then(() => {
    Article.insertMany(articles).then(() => {
      done();
    });
  });
});

describe("GET /articles", () => {
  it("should list all articles", done => {
    request(app)
      .get("/articles")
      .expect(200)
      .end(err => {
        if (err) {
          done(err);
        }
        done();
      });
  });
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
            expect(articles.length).toBe(3);
            done();
          })
          .catch(err => done(err));
      });
  });
});
