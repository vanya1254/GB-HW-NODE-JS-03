const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

const counterPath = path.join(__dirname, "index.json");
let counterViews = JSON.parse(fs.readFileSync(counterPath, "utf-8")) || {};

const counterMiddleware = (req, res, next) => {
  const pagePath = req.path;

  // counterViews[pagePath] ||= 0;
  counterViews[pagePath]++;

  res.locals.counter = counterViews[pagePath];

  fs.writeFileSync(counterPath, JSON.stringify(counterViews));

  next();
};

app.get("/", counterMiddleware, (req, res) => {
  // res.sendFile(path.join(__dirname, "static/index.html"));
  res.send(`<h1>Main</h1>
  <p>Views: <span id="value">${res.locals.counter}</span></p>
  <a href="/about">About</a>`);
});
app.get("/about", counterMiddleware, (req, res) => {
  res.send(`<h1>About</h1>
  <p>Views: <span id="value">${res.locals.counter}</span></p>
  <a href="/">Main</a>`);
});

app.listen(port, () => {
  console.log("start listening on port", port);
});
