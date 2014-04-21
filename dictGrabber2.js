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

//var speak = "/Users/thorsten/Downloads/espeak-1.45.04-OSX/espeak-1.45.04/speak -k10 -s 150   --path=/Users/thorsten/Downloads/espeak-1.45.04-OSX/espeak-1.45.04/ ";
//var speak = "/usr/local/bin/speak -k10 -s 150 -ven-us ";
//var speak = "/usr/local/bin/speak -k20 -p 10 -ven-us+m2 ";
var speak = "speak -ven-pt ";
//var speak = "speak -ven-wi-sbd -g10 ";

if (typeof process.argv[2] == 'undefined') {
  console.log("OI! gimme a search term..");
  process.exit(1);
}

var srchTerm = process.argv[2];
srchTerm = encodeURIComponent(srchTerm);

var rapLyricsURL = 'http://research.blackyouthproject.com/raplyrics/';
var lyricsLinks = [];
var lyricsCounter = 0;
var lyrics = [];
var rhymingWords = [];

////////////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

function puts(error, stdout, stderr) { sys.puts(stdout); }

function rapperRob() {

  // Initial Values
  var line = lyrics[mq.randyNum(lyrics.length - 1)];
  //var line = "Talkin like you're ill, but the shit is all game";
  var wurds = line.split(" ");
  var wurdCounter = 0;


  console.log("RAP YO! NEW LYRICS: " + lyrics);
  mq.subscribe('bpm', function(msg) {
    var bpm = msg.bpm, microTick = msg.microTick, tickCounter = msg.tickCounter, beat = msg.beat;
    console.log("BPM: " + bpm + " MICROTICK: " + microTick + " TICK COUNTER: " + tickCounter + " and BEAT is: " + beat);
    if (/[2468]/.test(beat) && /[3]/.test(microTick)) {

      wurdCounter++;

      console.log("COUNTER: " + wurdCounter + " WURDSLENGTH:" + wurds.length);
      if (wurdCounter > (wurds.length * 2) ) {
        console.log("WURDCOUNTER RESET!");
        line = lyrics[mq.randyNum(lyrics.length - 1)];
        wurds = line.split(" ");
        wurdCounter = 0;
      }

      //talkCommand = speak + "\"" + wurds[beat - 1] + " " + wurds[beat];
      talkCommand = speak + "\"" + wurds[beat - 1];
      //talkCommand = speak + " -s" + bpm + " \"" + wurds[wurdCounter] + " " + wurds[wurdCounter + 1];
      //if ( Math.round(Math.random()*1) ) {
      //  talkCommand = speak + "\"" + wurds[beat - 1] + " " + wurds[beat];
      //}
      //console.log("TALKC " + talkCommand);
      if ( /5/.test(beat) ) {
        talkCommand = talkCommand + "\" -p " + ( (tickCounter % 29) + 40);
      } else {
        talkCommand = talkCommand + "\"";
      }

      //talkCommand = speak + " \"" + line + "\"";
      console.log(talkCommand);

      if (!/undefined/.test(talkCommand) ) {
        exec(talkCommand);
      }
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
    cleanline = $(line).text();
    if ( cleanline && !cleanline.match(/^\s+$/g) && !cleanline.match(/(Artist|Album|Song|Title):/i) && !cleanline.match(/(chorus|verse|])/gi) && !cleanline.match(/repeat\s+\d+X/gi) && !cleanline.match(/http/gi)) {
      //cleanline = cleanline.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\W/g, ' ');
      cleanline = cleanline.replace(/^\s+/, '').replace(/\s+$/, '');
      lyrics.push(cleanline);
    }
  });
  if (lyricsCounter == lyricsLinks.length) {
    //console.log(lyrics);
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
//rapperRob();
