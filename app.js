const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const authRouter = require("./routes/auth");

const petsRouter = require("./routes/pets");
const newsRouter = require("./routes/news");
const friendsRouter = require("./routes/friends");
const noticesRouter = require("./routes/notices");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/pets", petsRouter);
app.use("/api/v1/news", newsRouter);
app.use("/api/v1/friends", friendsRouter);
app.use("/api/v1/notices", noticesRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
