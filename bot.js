const Telegraf = require('telegraf');
const {Extra, Markup} = Telegraf;
const config = require('./config'); // Holds Telegram API token plus YouTube API token

var youtube = require('./models/youtube');  // Provides easy access to YouTube API

const bot = new Telegraf(config.telegraf_token);

bot.telegram.getMe().then((bot_informations) => {
    bot.options.username = bot_informations.username;
    console.log("Server has initialized bot nickname. Nick: "+bot_informations.username);
});

// Command example, pretty easy. Each callback passes as parameter the context.
// Context data includes message info, timestamp, etc; check the official documentation or print ctx.
bot.command('start', (ctx) => {ctx.reply('Bot started.')});

// Hears, instead of command, check if the given word or regexp is CONTAINED in user input and not necessarly at beginning.
bot.hears('ymca', (ctx) => ctx.reply("*sing* It's fun to stay at the Y.M.C.A.!"));
bot.hears(/torino/i, (ctx) => ctx.reply("Someone said Torino!?"));

// Inline query support (@yourbot query). Can be used anywhere, even in groups. It works just like @gif bot.
bot.on('inline_query', ctx => {
    let nickname = ctx.update.inline_query.query;  // If you analyze the context structure, query field contains our query.
    if(nickname.length > 3){  // If user input is @yourbot /command
        youtube.fetch_channel_uploads(nickname).then(data => {
            console.log(data);
            youtube.parse_list_videos(data).then(data2 => {
                console.log(data2);
                    
                let new_arr = [];
                for(let k in data2){
                    new_arr[k] = {
                        type: 'video',
                        id: k,
                        title: data2[k].title,
                        description: data2[k].description,
                        video_url: data2[k].url,
                        mime_type: "video/mp4",
                        thumb_url: data2[k].thumb
                    }
                }
                console.log("new_arr="+new_arr);
                return ctx.answerInlineQuery(new_arr, {cache_time: 0});
            });
        }).catch(error => {console.log("Promise error: "+error)});
    }
})

// Start bot polling in order to not terminate Node.js application.
bot.startPolling();