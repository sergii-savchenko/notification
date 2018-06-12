var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://emq')

const uuidv4 = require('uuid/v4');

client.on('connect', function () {
    while (true) {
      client.publish('loadtest', JSON.stringify({
        uuid: uuidv4(),
        payload: {
          high: 1,
          low: 0,
          open: 0.4,
          close: 0.5,
          volume: 111111111
        }}) )
    }
})
