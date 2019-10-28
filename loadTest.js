const [,,concorentUsers, nTimes] = process.argv;
const config = require('./port.json');
const siege = require("siege");
siege()
  .on(config.PORT)
  .concurrent(concorentUsers)
  .for(nTimes).times
  .get('/')
  .attack()