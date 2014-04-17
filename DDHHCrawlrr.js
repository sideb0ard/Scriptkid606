#!/usr/bin/env node
var cheerio = require('cheerio');
var jsdom = require('jsdom');
var request = require('request');
var pictureTube = require('picture-tube');
var mq = require('./rabbitconfix');
var exec = require('child_process').exec;
var sys = require('sys');
var http = require('http');
var markov = require('markov');
var m = markov(2);

var playing = 0;
var voices = ["Agnes","Albert","Alex","Bad","Bahh","Bells","Boing","Bruce","Bubbles","Cellos","Deranged","Fred","Good","Hysterical","Junior","Kathy","Pipe","Princess","Ralph","Trinoids","Vicki","Victoria","Whisper","Zarvox"];
var voice;

//var speak = "/Users/thorsten/Downloads/espeak-1.45.04-OSX/espeak-1.45.04/speak -k10 -s 150   --path=/Users/thorsten/Downloads/espeak-1.45.04-OSX/espeak-1.45.04/ ";
//var speak = "/usr/local/bin/speak -k10 -s 150 -ven-us ";
var speak = "/usr/local/bin/speak -k20 -p 10 -ven-us+m2 ";

var lyricsUrl = [];

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
var rapLyricsURL = 'http://research.blackyouthproject.com/raplyrics/';
var lyricsLinks = [];
var lyricsCounter = 0;
var lyrics = [];
var rhymingWords = [];

////////////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function puts(error, stdout, stderr) { sys.puts(stdout); }

function rapperRobMarkov() {
  var counter = 0;
  var lyricz = lyrics.toString();
  console.log("LYRICS IN RAPPER ROB: " + lyrics + " and munged: " + lyricz);

  m.seed(lyricz, function() {
    //var response = m.respond(lyrics[0]).toString();
    console.log("RAP YO!" + lyrics);
    var response = m.respond(lyrics[mq.randyNum(lyrics.length -1)]).toString();
    //var lyriczwordarray = lyricz.split(" ");
    //var lyriczLength = lyriczwordarray.length;
    var resSplit = response.split(",");
    var resLength = resSplit.length;

    mq.subscribe('bpm', function(msg) {
      var bpm = msg.bpm, microTick = msg.microTick, tickCounter = msg.tickCounter, beat = msg.beat;
      console.log("BPM: " + bpm + " MICROTICK: " + microTick + " TICK COUNTER: " + tickCounter + " and BEAT is: " + beat);
      if (/[15]/.test(beat) && microTick == 1 && playing == 0) {
        var r1 = mq.randyNum(resLength - 1);
        var r2 = mq.randyNum(resLength - 1);
        var r3 = mq.randyNum(resLength - 1);
        playing = 1;
        console.log("RESPOND: " + resSplit[r1] + " " + resSplit[r2]);
        //exec("say -r " + (bpm * 2) + " -v "+ voice +" " + lyriczwordarray[counter] + " " + lyriczwordarray[counter+1] + " " + lyriczwordarray[counter+2], puts);
        //exec("say -r " + (bpm * 5) + " -v "+ voice +" " + resSplit[r1] + " " + resSplit[r2], puts);
        //exec("say -r 100 -v "+ voice +" " + resSplit[r1] + " " + resSplit[r2], puts);
        //exec("say -v "+ voice +" " + resSplit[r1] + ". " + resSplit[r2] + ", " + resSplit[r3], puts);
        exec(speak  +" \"" + resSplit[r1] + ". " + resSplit[r2] + ", " + resSplit[r3] + "\"", puts);
        //exec("say -v "+ voice +" " + resSplit[r1], puts);
        //console.log("YO! " + lyrics[counter]);
        //if (counter >= lyriczLength) {
        if (counter >= resLength) {
          counter = 0;
        } else {
          counter += 2;
          // counter++;
        }
        playing = 0;
      }
    });
  }); // m.SEED START
}
function rapperRob() {
  var counter = 0;
  //sanelyrics = lyrics.filter(function(n){ return n != undefined });
  var len = lyrics.length, i;
  for(i = 0; i < len; i++ )
      lyrics[i] && lyrics.push(lyrics[i]);
  lyrics.splice(0,len);

  console.log("RAP YO! NEW LYRICS: " + lyrics);
  mq.subscribe('bpm', function(msg) {
    var bpm = msg.bpm, microTick = msg.microTick, tickCounter = msg.tickCounter, beat = msg.beat;
    console.log("BPM: " + bpm + " MICROTICK: " + microTick + " TICK COUNTER: " + tickCounter + " and BEAT is: " + beat);
    if (/[15]/.test(beat) && microTick == 1) {
      var r1 = mq.randyNum(lyrics.length - 1);
      var r2 = mq.randyNum(lyrics.length - 1);
      var r3 = mq.randyNum(lyrics.length - 1);
      console.log(lyrics[r1]);
      //exec("say -r " + (bpm * 2) + " -v "+ voice +" " + lyriczwordarray[counter] + " " + lyriczwordarray[counter+1] + " " + lyriczwordarray[counter+2], puts);
      //exec("say -r " + (bpm * 5) + " -v "+ voice +" " + resSplit[r1] + " " + resSplit[r2], puts);
      //exec("say -r 100 -v "+ voice +" " + resSplit[r1] + " " + resSplit[r2], puts);
      //exec("say -v "+ voice +" " + resSplit[r1] + ". " + resSplit[r2] + ", " + resSplit[r3], puts);
      //exec(speak  +" \"" + lyrics[r1] + ". " + lyrics[r2] + ", " + lyrics[r3] + "\"", puts);
      exec(speak  +" \"" + lyrics[r1] + "\"", puts);
      //exec("say -v "+ voice +" " + resSplit[r1], puts);
      //console.log("YO! " + lyrics[counter]);
      //if (counter >= lyriczLength) {
    }
  });
}

function getSongs(err, resp, html) {
  if (err) return console.error(err);
  var $ = cheerio.load(html);
  songLinkz = [];
  $('div[class=song_result] a').map(function(i, line) {
    lyriclink = $(line).attr("href");
    lurl = rapLyricsURL + lyriclink.replace(/^\.\.\//i, "");
    songLinkz.push(lurl);
  });
  lyricsLinks = songLinkz.slice(0,5);
  lyricsLinks.forEach (function (url, index) {
    request(url, getLyrics);
  });
}

function getLyrics(err, resp, html) {
  lyricsCounter++;
  console.log("LYRICCOUNTER = " + lyricsCounter);
  if (err) return console.error(err);
  var $ = cheerio.load(html);
  $('div[class=lyrics]').first().contents().filter(function(i, line) {
    cleanline = $(line).text().replace(/\r?\n|\r/, '').replace(/.*:.*/, '').replace(/^\[|\(.*/,'').replace(/.*\[.*\].*/,'').replace(/^(LYRICS|CHORUS)/i, '');
    lyrics.push(cleanline);
  });
  if (lyricsCounter == lyricsLinks.length) {
    console.log("LYRICS DONE! " + lyrics);
    rapperRob();
  }
}

function getRhymingWords(toRhyme, score, syllables){
  if(syllables){
  }
  options = {
    host: 'rhymebrain.com',
    path: '/talk?function=getRhymes&word=' + toRhyme
  };

  fetchObj = function(response) {
    var str = '';
    response.on('data', function(chunk) {
      str += chunk;
    });
    response.on('end', function() {
      obj = JSON.parse(str);
      obj.forEach(function (item, index) {
        if (item.score > 200) {
          rhymingWords.push(item.word);
        }
      });
      if (rhymingWords.length >= 2) {
        var url = rapLyricsURL + 'results/?all/1989-2009/' + srchTerm + '/'  + rhymingWords[0] + '/' + rhymingWords[1] + '/';
      } else {
        var url = rapLyricsURL;
      }
      console.log(url);
      // MONEY SHOT RIGHT HERE :
      request(url, getSongs);
    });
  };
  http.request(options, fetchObj).end();
}


// Entry point - get rhyming words for srch term, then call rap lyrics dictionary with srch term and top two rhyming words 
// Combine them all into one string array and create a Markov chain from there.

getRhymingWords(srchTerm);
