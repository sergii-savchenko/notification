var mqtt = require('mqtt')

// -- CONFIG
var clientQty = 50
var clients = []
var done = 0
var perSecond = 0
// ---

for (let i=0;i<clientQty; i++) {
  let client  = mqtt.connect('ws://emq:8083/mqtt')
  
  client.on('connect', function () {
    console.log(`Connected client ID${i} ${++done}`)
    client.subscribe('loadtest')
  
  })
   
  client.on('message', function (topic, message) {
    perSecond++
    // message is Buffer
    let data = JSON.parse(message.toString())
  })
  clients.push(client);
  
}

setInterval(()=>{
  console.log(`Received per second: ${perSecond}`)
  perSecond = 0;
}, 1000)
 

