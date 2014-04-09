#!/Users/thorsten/.nvm/v0.11.11/bin/node

// #!/usr/bin/env node
var mq = require('./rabbitconfix');
var rap = process.argv[2];
var randy = process.argv[3];
var voice = process.argv[4];
if(typeof randy == 'undefined') {
      console.log("loser! need a rap and a voice")
      process.exit(1);
}

if (typeof voice == 'undefined') {
	voice = "Zarvox";
	console.log("lazy coder gets " + voice)
}

var speech = {"rap": rap, "randy": randy, "voice": voice};
console.log("Sending txt -- " + JSON.stringify(speech));
mq.publish('voices',speech);
