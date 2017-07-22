const Telegraf = require('telegraf');
const {Extra, Markup} = Telegraf;
const config = require('./config'); // Holds Telegram API token plus YouTube API token

var youtube = require('./models/youtube');  // Provides easy access to YouTube API

const bot = new Telegraf(config.telegraf_token);

bot.telegram.getMe().then((bot_informations) => {
    bot.options.username = bot_informations.username;
    console.log("Server has initialized bot nickname. Nick: "+bot_informations.username);
});

// Usage: @yourbot channel. Retrieves: a list of last videos of 'channel' query input.
bot.on('inline_query', ctx => {
    let nickname = ctx.update.inline_query.query;  // Take the nickname out of Telegraf context structure.
    if(nickname.length > 3){  // If user input is longer than 3 characters
        // Let's get last uploaded videos as data structure through YouTube API (thanks to our written model).
        youtube.fetch_channel_uploads(nickname).then(structured_data => {
            // Let's parse those structured data to get only essential informations for video listing.
            youtube.parse_list_videos(structured_data).then(video_info => {
                // Let's encapsulate those informations in a list that Telegraf API can digest.
                let new_arr = [];
                for(let k in video_info){
                    new_arr[k] = {
                        type: 'video',
                        id: k,
                        title: video_info[k].title,
                        description: video_info[k].description,
                        video_url: video_info[k].url,
                        mime_type: "video/mp4",
                        thumb_url: video_info[k].thumb
                    }
                }
                // Let's show this list to the user. Cache time is set to zero for development purposes.
                return ctx.answerInlineQuery(new_arr, {cache_time: 0});
            });
        }).catch(error => {console.log("Promise error: "+error)});
    }
})

bot.startPolling();