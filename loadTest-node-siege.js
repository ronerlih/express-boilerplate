const siege = require("node-siege");
siege()
  .args('-d0 -c6 -t4S http://localhost:3000/')
  .on('stdout',function(data){console.log(data.toString('utf8'))})
  .on('stderr',function(data){console.log(data.toString('utf8'))})
  .on('error',function(err){console.log(err.toString('utf8'))})
  .on('exit',function(){
    console.log('done');
  })
  .run();