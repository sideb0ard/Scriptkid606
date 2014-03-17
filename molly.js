var fs = require('fs')
var exec = require('child_process').exec;

var voices = ["Agnes","Albert","Alex","Bad","Bahh","Bells","Boing","Bruce","Bubbles","Cellos","Deranged","Fred","Good","Hysterical","Junior","Kathy","Pipe","Princess","Ralph","Trinoids","Vicki","Victoria","Whisper","Zarvox"]

function talk(words, voice)
{
  exec("./Messagrrr.js "+ "\"" + words + "\"" + voice);
}

fs.readFile('neurotext.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
  data.replace(/\s/gm, ' ');
  var words = data.split(" ");
  words_len = words.length;
  console.log("words is " + words_len + " long");
  for (var i=0; i < words_len; i+=2)
    {
        var voice = voices[ i % voices.length]
        //console.log("VOICE! " + voice)
        //console.log("TWO WORDS - " + words[i] + ", " + words[i+1]);
        var tw2words = words[i] + " " + words[i+1];
        tw2words.replace(/\s/gm, ' ');
        console.log("./Messagrrr.js "+ "\"" + tw2words + "\""  + " " + voice);
        setTimeout(talk(tw2words,voice), 10000)
  //words.map( function(w) { console.log(w) } );
    }
});
