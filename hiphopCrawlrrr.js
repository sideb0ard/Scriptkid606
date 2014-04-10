#!/usr/bin/env node
var $ = require('cheerio')
var request = require('request')
var pictureTube = require('picture-tube')
var mq = require('./rabbitconfix');
var exec = require('child_process').exec;
var sys = require('sys');
var playing = 0;

var voices = ["Agnes","Albert","Alex","Bad","Bahh","Bells","Boing","Bruce","Bubbles","Cellos","Deranged","Fred","Good","Hysterical","Junior","Kathy","Pipe","Princess","Ralph","Trinoids","Vicki","Victoria","Whisper","Zarvox"];

var voice;

if (typeof process.argv[2] == 'undefined') {
  console.log("OI! gimme a search term..");
  process.exit(1);
}
var srchTerm = process.argv[2];
srchTerm = encodeURIComponent(srchTerm);

if (process.argv[3]) {
  voice=voices[process.argv[3]];
} else {
  voice=voices[0];
}
var rapLyricsURL = 'http://research.blackyouthproject.com/raplyrics/results/?all/1989-2009/' + srchTerm + '/';
var lyrics = [];

function rapperRob() {
  var counter = 0;
  var lyricz = lyrics.toString();
  var lyriczwordarray = lyricz.split(" ");
  var lyriczLength = lyriczwordarray.length;
  //console.log(lyriczwordarray);

  mq.subscribe('bpm', function(msg) {
    var bpm = msg.bpm, microTick = msg.microTick, tickCounter = msg.tickCounter, beat = msg.beat;
    console.log("BPM: " + bpm + " MICROTICK: " + microTick + " TICK COUNTER: " + tickCounter + " and BEAT is: " + beat);
    if (/[15]/.test(beat) && microTick == 3 && playing == 0) {
      playing = 1;
      exec("say -r " + (bpm * 2) + " -v "+ voice +" " + lyriczwordarray[counter] + " " + lyriczwordarray[counter+1] + " " + lyriczwordarray[counter+2], puts);
      //console.log("YO! " + lyrics[counter]);
      if (counter >= lyriczLength) {
        counter = 0;
      } else {
        counter += 2;
      }
      playing = 0;
    }
  });
    //reply = molly.transform(blah)
  //lyrics.forEach(function(lyric) {
  //  console.log(lyric);
  //});
}

function getLyrics(err, resp, html) {
  if (err) return console.error(err)
  var parsedHTML = $.load(html)
  // get all img tags and loop over them
  parsedHTML('div[class=song_result]').map(function(i, line) {
    //console.log("TEXT: " + $(line).text());
    //console.log("VAL: " + $(line).val());
    //rawline = $(line).text();
    var rawline = $(line).text().split("\r\n");
    //console.log(rawline);
    if (rawline[3]) {
      var lyric = rawline[3].replace(/[^a-z\d ]+/ig," ");
      lyric = lyric.replace(/^\s+/,'');
      lyrics.push(lyric)
      //console.log("LYRIC YO:! " + lyric);
    }
    //var href = $(link).attr('href')
    //if (!href.match('.png')) return
  });
  rapperRob();
}

function puts(error, stdout, stderr) { sys.puts(stdout) };

request(rapLyricsURL, getLyrics);

