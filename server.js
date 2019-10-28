// exprews with clusters: https://rowanmanning.com/posts/node-cluster-and-express/
// https://jasonmccreary.me/articles/installing-siege-mac-os-x-lion/
// https://stackoverflow.com/questions/42367606/siege-https-error-https-requires-libssl
/* eslint-disable prettier/prettier */
require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var fs = require("fs");
var cluster = require("cluster");

// Count the machine's CPUs
var cpuCount = require("os").cpus().length;

var db = require("./models");
var CLUSTER = true;

if (cluster.isMaster && CLUSTER) {

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

// Code to run if we're in a worker process
} else {

  var app = express();
  var PORT = process.env.PORT || 3000;
  fs.writeFile("port.json", JSON.stringify({PORT: PORT}),function() {return;});

  // Middleware
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(express.static("public"));

  // Handlebars
  app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");
  app.clusterWorker = cluster.worker;

  // Routes
  require("./routes/apiRoutes")(app);
  require("./routes/htmlRoutes")(app);

  var syncOptions = { force: false };

  // If running a test, set syncOptions.force to true
  // clearing the `testdb`
  if (process.env.NODE_ENV === "test") {
    syncOptions.force = true;
  }

  // Starting the server, syncing our models ------------------------------------/
  db.sequelize.sync(syncOptions).then(function() {
    app.listen(PORT, function() {
      console.log(
        "==> 🌎  Listening with worker no. %s on port %s. Visit http://localhost:%s/ in your browser.",
        cluster.worker ? cluster.worker.id : 0,
        PORT,
        PORT
      );
    });
  });

  module.exports = app;
}

cluster.on("exit", function (worker) {

  // Replace the dead worker,
  // we're not sentimental
  console.log("\n\n\nWorker %d died :(", worker.id);
  cluster.fork();

});
