#!/usr/bin/env node
var cheerio = require('cheerio');
var jsdom = require('jsdom');
var request = require('request');
var pictureTube = require('picture-tube');
var mq = require('./rabbitconfix');
var exec = require('child_process').exec;
var sys = require('sys');
var http = require('http');
var async = require('async');

var playing = 0;
var speak = "say ";

////////////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function puts(error, stdout, stderr) { sys.puts(stdout); }

function rapperRob() {

  // Initial Values
  var lines = ["Talkin like you're ill.", "your shit is all game"];

  function getRhymey(wurd,callback){
    exec('rhyme ' + wurd + ' | head -2 | tail -1', function(error, stdout, stdin){ callback(stdout); });
  }
  function getSyllablz(wurd,callback){
    exec('./hyphy.rb ' + wurd, function(error, stdout, stdin){ callback(stdout); });
  }
  function sayWurdz(wurdz, voice, r){
    talkCommand = speak + " -v " + voice + " -r " + r + " \"" + wurdz + "\"";
    if (!/undefined/.test(talkCommand) ) {
      //var wmsg = {"talk": "yes"};
      //mq.publish('talk', wmsg);
      exec(talkCommand);
    }
  }

  mq.subscribe('bpm', function(msg) {
    line = lines[(mq.randyNum(2) - 1)];
    //line = lines[0];
    console.log("LINEEE" + line);
    var bpm = msg.bpm, microTick = msg.microTick, tickCounter = msg.tickCounter, beat = msg.beat;
    console.log("BPM: " + bpm + " MICROTICK: " + microTick + " TICK COUNTER: " + tickCounter + " and BEAT is: " + beat);

    if (/[1]/.test(beat) && /[1]/.test(microTick)) {
      oneWurdz = line.split(" ", 3).join(" ");
      if (!/undefined/.test(oneWurdz) ) {
        //sayWurdz(oneWurdz, "Bad", 190);
        //sayWurdz(oneWurdz, "Trinoids", 190);
      }
    }
    if (/[3]/.test(beat) && /[1]/.test(microTick)) {
      //randwurdcount = mq.randyNum(wurds.length);
      randwurdcount = mq.randyNum(10);
      randWurdz = line.split(" ", randwurdcount).join(" ");
      if (!/undefined/.test(randWurdz) ) {
        sayWurdz(randWurdz, "Moira", 160);
      }
    }

    if (/[5]/.test(beat) && /[1]/.test(microTick)) {
      ladywurdz = line.split(" ", 5).join(" ");
      if (!/undefined/.test(ladywurdz) ) {
        //sayWurdz(ladywurdz, "Zarvox", 170);
      }
    }
  });
}

// Entry point 
// Combine them all into one string array and create a Markov chain from there.

rapperRob();
