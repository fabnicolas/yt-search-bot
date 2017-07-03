var request = require("request");
var config = require("./config");

request("https://www.googleapis.com/youtube/v3/channels?part=snippet&forUsername=NoCopyrightSounds&key="+config.youtube_api_key+"&part=contentDetails", function(error, response, body) {
  console.log(body);
});