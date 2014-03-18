#!/usr/bin/env node
var sys = require('sys')
var exec = require('child_process').exec;

var Bot = require('ezeebot');
var molly = new Bot('molly','low');

var mq = require('./rabbitconfix');

//console.log("Hullo - My name is " + molly.name + " and my intelligence level is " + molly.intelligence_level)

function puts(error, stdout, stderr) { sys.puts(stdout) };

mq.subscribe('voices', function(msg) {
  var blah = msg.txt;
  var voice = msg.voice;
  console.log("MSG:: " + blah);
  reply = molly.transform(blah)
  exec("say --voice "+ voice +" " + reply, puts);
  }

);
