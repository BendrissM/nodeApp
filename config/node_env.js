var env = process.env.NODE_ENV || "development";

if (env === "development") {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/nodeapp";
} else if (env === "test") {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = "mongodb://localhost:27017/nodeappTest";
} else if (env === "production") {
  process.env.MONGODB_URI =
    "mongodb://benoxy:moncefbdofus98@ds251284.mlab.com:51284/nodeapp";
}
