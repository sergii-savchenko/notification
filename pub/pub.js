const mqtt = require('mqtt')
const uuidv4 = require('uuid/v4')
const delay = require('delay')

var client  = mqtt.connect('mqtt://emq')
var stats = 0;

client.on('connect', function () {
  let loop = ()=>{
      return delay(0).then(function() {
        client.publish('loadtest', JSON.stringify({
          uuid: uuidv4(),
          payload: {
            high: 1,
            low: 0,
            open: 0.4,
            close: 0.5,
            volume: 111111111
          }}));
          stats++;
      }).then(loop);
  }
  loop()
})

const loop1000 = ()=> {
  return delay(1000).then(function() {
    console.log(stats)
    stats = 0;
  }).then(loop1000);
}

loop1000()
