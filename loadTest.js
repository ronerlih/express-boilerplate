const siege = require("siege");
siege()
  .on(80)
  .concurrent(10)
  .for(10).times
  .get('/')
  .attack()