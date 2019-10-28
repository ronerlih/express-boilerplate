var db = require("../models");
// Count the machine's CPUs
var cpuCount = require("os").cpus().length;

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      let workerId;
      app.clusterWorker ? workerId = app.clusterWorker.id : workerId = 0;
      console.log('\n\n\nrunning on a machinecpu:', workerId);
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples,
        clusterStats: "\n Running worker: " + workerId + " on a machine with " + cpuCount + "CPUs."
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
