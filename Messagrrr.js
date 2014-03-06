#!/usr/bin/env node
var amqp = require('./codetraxx_lib.js');

var msg = process.argv[2]
if(typeof msg == 'undefined') {
      console.log("loser! need a msg")
      process.exit(1);
}

var txt = {"txt": msg};
console.log("Sending txt -- " + JSON.stringify(txt));
amqp.publish('bpm',txt);
