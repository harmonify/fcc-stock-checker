"use strict";

const path = require("path");

const dotenv = require("dotenv");
dotenv.config();
if (process.env.NODE_ENV === "test") {
  dotenv.config({
    path: path.join(__dirname, "test.env"),
    override: true,
  });
}

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

const runner = require("./test-runner");
const database = require("./database");
const { apiRoutes, fccTestingRoutes } = require("./routes");
const { errorHandler, loggerDev, notFoundHandler } = require("./middlewares");

const app = express();

app.use(loggerDev);
app.use(helmet());
app.use("/public", express.static(process.cwd() + "/public"));
app.use(cors({ origin: "*" })); //For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

database(process.env.MONGO_URI)
  .then(async (db) => {
    console.log("Database connected");
    //For FCC testing purposes
    fccTestingRoutes(app);

    //Routing for API
    apiRoutes(app);

    // Error Handler Middleware
    app.use(errorHandler);

    //404 Not Found Middleware
    app.use(notFoundHandler);
  })
  .catch((err) => {
    console.error(err);
  });

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (e) {
        console.log("Tests are not valid:");
        console.error(e);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
