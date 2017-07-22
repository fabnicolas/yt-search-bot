const request = require("request");
const config = require('../config');

function YouTube(){
    let api_base_url = "https://www.googleapis.com/youtube/v3/";

    this.fetch_channel_uploads = function (youtube_nickname, number_results = 5) {
        return new Promise((resolve, reject) => {
            request(api_base_url+"channels?part=contentDetails&forUsername="+youtube_nickname
                    +"&key="+config.youtube_api_key, function(error, response, body) {
                if(error)  reject("ERROR: "+error);
                else{
                    let parsed_body = JSON.parse(body);
                    if(parsed_body.pageInfo.totalResults > 0){
                        var upload_id = JSON.parse(body).items[0].contentDetails.relatedPlaylists.uploads;
                        request(api_base_url+"playlistItems?part=snippet&playlistId="+upload_id+"&maxResults="+number_results+"&key="+config.youtube_api_key, function(error, response, body) {
                            if(error)   reject("ERROR: "+error);
                            else        resolve(JSON.parse(body));
                        });
                    }else reject("ERROR: no such channel.");
                }
            });
        });
    }

    this.parse_list_videos = function(data){
        return new Promise((resolve, reject) => {
            let list_videos = data.items;
            let list_videos_parsed = [];
            for(let k in list_videos){
                let video_info = list_videos[k].snippet;
                console.log("thumb="+video_info.thumbnails)
                list_videos_parsed[k] =
                {
                    title: video_info.title,
                    description: video_info.description,
                    url: 'https://youtube.com/watch?v='+video_info.resourceId.videoId,
                    thumb: video_info.thumbnails.medium.url
                }
            }
            if(list_videos_parsed.length > 0)   resolve(list_videos_parsed);
            else                                reject('Error: no videos found');
        });
    }
}

module.exports = new YouTube();