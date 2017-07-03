var request = require("request");
var config = require("./config");

request("https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=NoCopyrightSounds&key="+config.youtube_api_key, function(error, response, body) {
  var upload_id = JSON.parse(body).items[0].contentDetails.relatedPlaylists.uploads;
  console.log("Upload_ID="+upload_id);
  request("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId="+upload_id+"&maxResults=50&key="+config.youtube_api_key, function(error, response, body) {
    console.log(body);
  });
});