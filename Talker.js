#!/usr/bin/env node
var sys = require('sys')
var exec = require('child_process').exec;

var codetraxx = require('./codetraxx_lib.js');

function puts(error, stdout, stderr) { sys.puts(stdout) };

codetraxx.subscribe( function(msg) {
  var blah = msg.txt;
  console.log("MSG:: " + blah);
  exec("say --voice Zarvox " + blah, puts);

  }

);
