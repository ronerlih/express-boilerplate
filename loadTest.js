const config = require('./port.json');
const siege = require("siege");
siege()
  .on(config.PORT)
  .concurrent(10)
  .for(10).times
  .get('/')
  .attack()