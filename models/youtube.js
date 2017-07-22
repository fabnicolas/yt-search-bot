const request = require("request");
const config = require('../config');

function YouTube(){
    let yt_api_auth = function(url){return "https://www.googleapis.com/youtube/v3/"+url+"&key="+config.youtube_api_key;}

    this.search = function(query, maxResults=1, type='channel', part='snippet'){
        return new Promise((resolve, reject) => {
            request(yt_api_auth("search?maxResults="+maxResults+"&part="+part+"&q="+query+"&type="+type), function(error, response, body){
                let parsed_body = JSON.parse(body);
                if(parsed_body.pageInfo.totalResults > 0)   resolve(parsed_body);
                else                                        reject("Error: no results from the search.");
            });
        });
    }

    this.get_id_from_nickname = function(nickname){
        return new Promise((resolve, reject) => {
            this.search(nickname,1,'channel','snippet').then(parsed_body => {
                let nickname_found = parsed_body.items[0].snippet.title;
                if(nickname.toUpperCase() == nickname_found.toUpperCase()){
                    resolve(parsed_body.items[0].snippet.channelId);
                }else{
                    reject("Error: not matching nicknames.");
                }
            }).catch(err => reject(err));
        });
    }

    this.fetch_channel_uploads = function(channel_id, number_results = 5){
        return new Promise((resolve, reject) => {
            request(yt_api_auth("channels?part=contentDetails&id="+channel_id), function(error, response, body) {
                if(error)  reject("ERROR: "+error);
                else{
                    let parsed_body = JSON.parse(body);
                    if(parsed_body.pageInfo.totalResults > 0){
                        var upload_id = JSON.parse(body).items[0].contentDetails.relatedPlaylists.uploads;
                        request(yt_api_auth("playlistItems?part=snippet&playlistId="+upload_id+"&maxResults="+number_results), function(error, response, body) {
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