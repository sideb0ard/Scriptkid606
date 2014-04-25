#!/usr/bin/env node
var exec = require('child_process').exec;

var runMe = function(cmd, callback){
  exec(cmd, function(error, stdout, stderr){ callback(stdout); });
};

var updateWurd = function(data) {
  console.log("WOOP " + data);
};

var name = runMe("uname", updateWurd);

console.log("NAME!" + name);
