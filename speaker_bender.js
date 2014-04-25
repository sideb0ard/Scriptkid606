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

//function hyphy(line

function rapperRob() {

  // Initial Values
  var line = lyrics[mq.randyNum(lyrics.length - 1)];
  //var line = "Talkin like you're ill, but the shit is all game";
  var wurds = line.split(" +");
  var wurdCounter = 0;

  function getRhymey(wurd,callback){
    exec('rhyme ' + wurd + ' | head -2 | tail -1', function(error, stdout, stdin){ callback(stdout); });
  }
  function getSyllablz(wurd,callback){
    exec('./hyphy.rb ' + wurd, function(error, stdout, stdin){ callback(stdout); });
  }
  function sayWurd(wurd){
    console.log("SAYWURD " + wurd);
    wurd = wurd.replace(/^1:/,'');
    wurdz = wurd.split(/[\s,]+/);
    console.log("SAYWURD ZZZZ * " + wurdz);
    console.log(wurdz[mq.randyNum(wurdz.length - 1)]);
    wurd2say = wurdz[mq.randyNum(wurdz.length - 1)];
    talkCommand = speak + " -v Daniel \"" + wurd2say + "\"";
    if (!/undefined/.test(talkCommand) ) {
      exec(talkCommand);
    }
  }

  console.log("RAP YO! NEW LYRICS: " + lyrics);
  mq.subscribe('bpm', function(msg) {
    var bpm = msg.bpm, microTick = msg.microTick, tickCounter = msg.tickCounter, beat = msg.beat;
    console.log("BPM: " + bpm + " MICROTICK: " + microTick + " TICK COUNTER: " + tickCounter + " and BEAT is: " + beat);
    wurdCounter++;
    console.log("COUNTER: " + wurdCounter + " WURDSLENGTH:" + wurds.length);

    if (wurdCounter > (wurds.length) ) {
      console.log("WURDCOUNTER RESET!");
      line = lyrics[mq.randyNum(lyrics.length - 1)];
      wurds = line.split(" ");
      wurdCounter = 0;
    }

    if (/[1]/.test(beat) && /[1]/.test(microTick)) {
      oneWurdz = line.split(" ", 3).join(" ");
      talkCommand = speak + " -r 190 -v Bad \"" + oneWurdz + "\"";
      console.log(talkCommand);
      if (!/undefined/.test(talkCommand) ) {
        exec(talkCommand);
      }
    }
    //if (/[4]/.test(beat) && /[1]/.test(microTick)) {
    //  getRhymey(wurds[beat-1], function(rhmz) { 
    //    rhymrrr = rhmz;
    //    console.log("IN RHYMEY CALLBACK! : SETTING RHYMRRR TO RHYMZ " + rhymrrr + " - " + rhmz);
    //  })
    //}

    if (/[3]/.test(beat) && /[1]/.test(microTick)) {
      twoWurdz = line.split(" ", 2).join(" ");
      talkCommand = speak + " -v Xander \"" + twoWurdz + "\"";
      console.log(talkCommand);
      console.log("NUM:" + beat + " // WURD: " + wurds[beat - 1]); 
      if (!/undefined/.test(talkCommand) ) {
        //exec(talkCommand);
      }
    }

    if (/[5]/.test(beat) && /[1]/.test(microTick)) {
      //talkCommand = speak + " -v Karen \"" + wurds[beat] + "\" -r " + ( (tickCounter % 29) + 40);
      ladywurdz = line.split(" ", 5).join(" ");
      talkCommand = speak + " -r 170 -v Zarvox \"" + ladywurdz  + "\"";
      console.log(talkCommand);
      if (!/undefined/.test(talkCommand) ) {
        exec(talkCommand);
      }
    }
    if (/[8]/.test(beat) && /[1]/.test(microTick)) {
      if (!/undefined/.test(wurds[3]) ) {
        //getRhymey(wurds[3], sayWurd);
      }
    }
    //if (/[8]/.test(beat) && /[1]/.test(microTick) && Math.round(Math.random()*1) && Math.round(Math.random()*1) ) {
    //  talkCommand = speak + " -r 170 -v Karen \"Teach me how to duggie. how to duggie\"";
    //  exec(talkCommand);
    //}
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
    if ( cleanline && !cleanline.match(/^\s+$/g) && !cleanline.match(/(Artist|Album|Song|Title):/i) && !cleanline.match(/(chorus|verse|])/gi) && !cleanline.match(/repeat\s+\d+X/gi) && !cleanline.match(/http/gi) && !cleanline.match(/@/)) {
      //cleanline = cleanline.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\W/g, ' ');
      cleanline = cleanline.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\(\d+\)/,'');
      lyrics.push(cleanline);
    }
  });
  if (lyricsCounter == lyricsLinks.length) {
    rapperRob();
  }
}

function sylly() {
  console.log("SYLLY!");
}


// Entry point 
// Combine them all into one string array and create a Markov chain from there.

var url = rapLyricsURL + 'results/?all/1989-2009/' + srchTerm + '/';
request(url, getSongs);
//rapperRob();
