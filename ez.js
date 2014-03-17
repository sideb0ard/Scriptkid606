#!/usr/bin/env node
var Bot = require('ezeebot');
var molly = new Bot('molly','low');
console.log("\n");
//console.log("Hullo - My name is " + molly.name + " and my intelligence level is " + molly.intelligence_level)

input = process.argv[2]

if(typeof input == 'undefined') {
      console.log("duh! speak to me")
      process.exit(1);
}

molly.transform(input)
