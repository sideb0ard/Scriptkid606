#!/usr/bin/env node

var query = process.argv[2];
var http = require('http');

var options = {
	host: 'conceptnet5.media.mit.edu',
	path: '/data/5.2/c/en/' + query
};

fetchObj = function(response) {
	var str = '';
	
	response.on('data', function(chunk) {
		str += chunk;
	});
	
	response.on('end', function() {
		obj = JSON.parse(str);
		console.log(obj.numFound);
		return obj
	});
}

http.request(options, fetchObj).end();
