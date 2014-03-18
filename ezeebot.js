'use strict';
var fs = require('fs');

var dict = {
  "hello": ["hi, hi", "hullp", "jimmy!", "hola", "whatup dude", "hullo yerself"],
  "shite": ["jobby", "bum", "pee pee", "cnut", "boaboe"]
}

var Ezeebot = module.exports = function (name, intelligence_level) {
  this.name = name;
  this.intelligence_level = intelligence_level;

  this.transform = function(input) {
    if ( typeof dict[input] === 'undefined') {
      console.log("Huh?");
      return "huh?";
    } else {
      console.log(dict[input][Math.floor(Math.random() * dict[input].length)]);
      return dict[input][Math.floor(Math.random() * dict[input].length)];
    }
  }
  this.getInitial = function() {
    console.log("innnnit");
  }
  this.getFinal = function() {
    console.log("ffffinnnnit");
  }

}

