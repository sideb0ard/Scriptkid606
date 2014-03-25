#!/usr/bin/env node
var sys = require('sys');
var exec = require('child_process').exec;

var Bot = require('ezeebot');
var molly = new Bot('molly','low');

var mq = require('./rabbitconfix');

//console.log("Hullo - My name is " + molly.name + " and my intelligence level is " + molly.intelligence_level)

function puts(error, stdout, stderr) { sys.puts(stdout) };

mq.subscribe('voices', function(vmsg) {
  var blah = vmsg.txt;
  var voice = vmsg.voice;
  console.log("MSG:: " + blah);
  mq.subscribe('bpm', function(msg) {
    var bpm = msg.bpm, microTick = msg.microTick, tickCounter = msg.tickCounter, beat = msg.beat;
        console.log("BPM: " + bpm + " MICROTICK: " + microTick + " TICK COUNTER: " + tickCounter + " and BEAT is: " + beat);
         if (/[1]/.test(beat) && microTick == 3) {
           molly.transform(blah)
         }
  });
  //reply = molly.transform(blah)
  //exec("say --voice "+ voice +" " + reply, puts);

});
