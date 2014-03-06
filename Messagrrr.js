#!/usr/bin/env node
var amqp = require('./codetraxx_lib.js');

var msg = process.argv[2];
var voice = process.argv[3];
if(typeof msg == 'undefined') {
      console.log("loser! need a msg")
      process.exit(1);
}

if (typeof voice == 'undefined') {
	voice = "Zarvox";
	console.log("lazy coder gets " + voice)
}

var speech = {"txt": msg, "voice": voice};
console.log("Sending txt -- " + JSON.stringify(speech));
amqp.publish('bpm',speech);
