var mqtt = require('mqtt')
//---Tracer

const uuidv4 = require('uuid/v4');
var jaeger = require('jaeger-client');

// -- CONFIG
var clientQty = 10
var clients = []
var done = 0
var perSecond = 0
// ---




// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37

const host = 'jaeger';
// The agent exposes the following ports: 5775/udp 6831/udp 6832/udp 5778.
const port = 6832;
const flushInterval = 5;
const config = {
  serviceName: 'Subscriber',
  sampler: {
    type: 'const',
    param: 1,
    host,
    port,
    refreshIntervalMs: flushInterval,
  },
  reporter: {
    flushIntervalMs: flushInterval,
    agentHost: host,
    agentPort: port,
  },
};

var options = {
  tags: {
    'publisher.version': '0.0.1',
  }
};

const printSpanDetails = (span) => {
  console.log(span.context().toString());
  console.log(JSON.stringify(span._logs));
  console.log(span._tags);
};

var tracer = jaeger.initTracer(config, options);

//----






for (let i=0;i<clientQty; i++) {
  let client  = mqtt.connect('ws://emq:8083/mqtt')
  //let client  = mqtt.connect('mqtt://emq')
  client.on('connect', function () {
    console.log(`Connected client ID${i} ${++done}`)
    client.subscribe('presence')
  
  })
   
  client.on('message', function (topic, message) {
    perSecond++
    // message is Buffer
    let data = JSON.parse(message.toString())
    
    if (data.trace) {
      let parentSpan = tracer.extract(jaeger.opentracing.FORMAT_TEXT_MAP, data)
      let childSpan = tracer.startSpan('message', {childOf: parentSpan});
      childSpan.addTags({ uuid: data.uuid });
      childSpan.finish()
    }
    
  })
}

setInterval(()=>{
  console.log(`Received per second: ${perSecond}`)
  perSecond = 0;
}, 1000)
 

