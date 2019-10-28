const siege = require("siege");
siege()
  .on(3000)
  .concurrent(10)
  .for(40000).times
  .get('/')
  .attack()