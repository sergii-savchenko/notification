const mqtt = require('mqtt')
const uuidv4 = require('uuid/v4')
const delay = require('delay')

var client  = mqtt.connect('mqtt://emq')

client.on('connect', function () {
    
  (function loop() {
      return delay(0).then(function() {
        client.publish('loadtest', JSON.stringify({
          uuid: uuidv4(),
          payload: {
            high: 1,
            low: 0,
            open: 0.4,
            close: 0.5,
            volume: 111111111
          }}))
      }).then(loop);
  })()
    
})
