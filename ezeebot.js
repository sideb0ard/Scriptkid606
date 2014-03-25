'use strict';
var sys = require('sys');
var fs = require('fs');
var http = require('http');
var exec = require('child_process').exec;

var dict = {
  "hello": ["hi, hi", "hullp", "jimmy!", "hola", "whatup dude", "hullo yerself"],
  "shite": ["jobby", "bum", "pee pee", "cnut", "boaboe"]
}

var cn = "http://conceptnet5.media.mit.edu/data/5.2/search?text=";

function puts(error, stdout, stderr) { sys.puts(stdout) };

var voices = ["Agnes","Albert","Alex","Bad","Bahh","Bells","Boing","Bruce","Bubbles","Cellos","Deranged","Fred","Good","Hysterical","Junior","Kathy","Pipe","Princess","Ralph","Trinoids","Vicki","Victoria","Whisper","Zarvox"];

var speaker = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    var obj = JSON.parse(str);
    console.log(obj);
    var randyNum = Math.floor(Math.random() * obj.edges.length);
    if (typeof(obj.edges[randyNum].surfaceText) !== 'undefined') {
      var replyText = obj.edges[randyNum].surfaceText;
      //var reply = obj.edges[Math.floor(Math.random() * obj.edges.length)].surfaceText;
      replyText = replyText.replace(/[[\]]/g,'');
      replyText = replyText.replace(/[()]/g,'');
      //console.log(obj.edges[Math.floor(Math.random() * obj.edges.length)].startLemmas);
      var voice = voices[Math.floor((Math.random()*voices.length)+1)]
      console.log("REPLY:: " + replyText);
      exec("say --voice " + voice + " " + replyText, puts);
    } else {
      console.log("Nae surfaceText");
    }
  });
}

var Ezeebot = function (name, intelligence_level) {
  this.name = name;
  this.intelligence_level = intelligence_level;
  return this;
};

Ezeebot.prototype.transform = function(input) {

    var options = {
      host: 'conceptnet5.media.mit.edu',
      path: '/data/5.2/search?text=' + input
    };

    http.request(options, speaker).end();

    //if ( typeof dict[input] === 'undefined') {
    //  console.log("Huh?");
    //  return "huh?";
    //} else {
    //  console.log(dict[input][Math.floor(Math.random() * dict[input].length)]);
    //  return dict[input][Math.floor(Math.random() * dict[input].length)];
    //}
  return this
};

//  this.getInitial = function() {
//    console.log("innnnit");
//  }
//  this.getFinal = function() {
//    console.log("ffffinnnnit");
//  }

module.exports = Ezeebot
