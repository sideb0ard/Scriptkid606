#!/Users/thorsten/.nvm/v0.11.11/bin/node

// #!/usr/bin/env node
var mq = require('./rabbitconfix');
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
mq.publish('voices',speech);
