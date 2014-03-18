var amqp = require('amqp');

var config = {
  //rabbitUrl:'amqp://guest:@172.16.10.74',
  rabbitUrl:'amqp://guest:@10.0.1.20',
  // queueName:'bpm'
};

function createConnection(qname) {
  return amqp.createConnection(qname);
}

function safeEndConnection(connection) {
    // `connection.end` doesn't flush outgoing buffers, run a
    // synchronous command to comprehend
    connection.queue('tmp-' + Math.random(), {exclusive: true}, function(){
        connection.end();
        // `connection.end` in 0.1.3 raises a ECONNRESET error, silence it:
        connection.once('error', function(e){
            if (e.code !== 'ECONNRESET' || e.syscall !== 'write')
                throw e;
        });
    });
};


function publish(qname, msg, conn) {
  console.log("starting  mq - " + qname);
  if (conn === undefined) {
    conn = createConnection(qname);
  }
  conn.on('ready', function () {
    // console.log("Sending message..." + JSON.stringify(msg));
    conn.exchange(qname, {type: 'fanout', autoDelete: true},
      function(exchange){
        exchange.publish('',msg);
        safeEndConnection(conn);
    });
  });
}

function subscribe(qname, musicalFunction, conn) {
  console.log("Subbbbing...");
  if (conn === undefined) {
    conn = createConnection(qname);
  }
  conn.on('ready', function() {
    conn.exchange(qname, {type: 'fanout', autoDelete: true}, function(exch) {
      conn.queue('tmp-' + Math.random(), {exclusive: true},function(queue){
        queue.bind(qname, '');
        queue.subscribe(musicalFunction);
      });
    });
  });
}

//  module.exports.init = init;
module.exports.publish = publish;
module.exports.subscribe = subscribe;
module.exports.createConnection = createConnection;
