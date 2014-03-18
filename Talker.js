#!/usr/bin/env node
var sys = require('sys')
var exec = require('child_process').exec;

var mq = require('./rabbitconfix');

function puts(error, stdout, stderr) { sys.puts(stdout) };

mq.subscribe('voices', function(msg) {
  var blah = msg.txt;
  var voice = msg.voice;
  console.log("MSG:: " + blah);
  exec("say --voice "+ voice +" " + blah, puts);

  }

);
