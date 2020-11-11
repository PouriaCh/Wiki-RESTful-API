const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs")
const app = express();

const portNumber = 3000;

//#######################################################################

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

//#######################################################################

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

//#######################################################################
// Requests targetting all articles

// Chained Route handlers
/* The chained route handlers look like this:
app.route("/articles").get().post().delete(); */

app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send("Successfully deleted all the documents!");
      } else {
        res.send(err);
      }
    });
  });

//#######################################################################
// Requests targetting a particular article

app.route("/articles/:newTitle")

  .get(function(req, res) {
    const newTitle = req.params.newTitle;
    Article.findOne({
      title: newTitle
    }, function(err, foundArticle) {
      if (!err) {
        res.send(foundArticle.content);
      } else {
        res.send(err);
      }
    });
  })
//#######################################################################

app.listen(portNumber, function() {
  console.log("Server started on port " + portNumber);
});

//#######################################################################
