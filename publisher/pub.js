var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://emq')
// const Tracer = require('@risingstack/jaeger')
// const tracer = new Tracer({
//   serviceName: 'publisher'
// })

const uuidv4 = require('uuid/v4');
var jaeger = require('jaeger-client');

// See schema https://github.com/jaegertracing/jaeger-client-node/blob/master/src/configuration.js#L37

const host = 'jaeger';
// The agent exposes the following ports: 5775/udp 6831/udp 6832/udp 5778.
const port = 6832;
const flushInterval = 5;
const config = {
  serviceName: 'Publish',
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

console.log(tracer)

var perSecond = 0
var lastQty = 0

client.on('connect', function () {
  //client.subscribe('presence')
  
  // setInterval(()=>{
  //   client.publish('presence', 'Hello mqtt')
  //   perSecond++
  // }, 1)
  setInterval(()=>{
    let data = {
      uuid: uuidv4(),
      payload: {
        high: 1,
        low: 0,
        open: 0.4,
        close: 0.5,
        volume: 111111111
      },
      lastQty: lastQty,
      trace: perSecond === 0 ? true: false
    }
    if (data.trace) {
      console.log(`Traceble UUID: ${data.uuid}`)
      let parentSpan = tracer.startSpan('publish');
    
      parentSpan.addTags({ uuid: data.uuid, lastQty: lastQty });
      tracer.inject(parentSpan, jaeger.opentracing.FORMAT_TEXT_MAP, data)
      client.publish('presence', JSON.stringify(data) )
      parentSpan.finish()
    } else {
      client.publish('presence', JSON.stringify(data) )
    }
  
    perSecond++
  }, 100)
})

setInterval(()=>{
  console.log(`Published per second: ${perSecond}`);
  lastQty = perSecond;
  perSecond = 0;
}, 1000)
 
// client.on('message', function (topic, message) {
//   // message is Buffer
//   console.log(message.toString())
  
// })
