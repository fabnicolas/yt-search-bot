# yt-search-bot, a Node.js Telegraf (Telegram) bot to share YouTube channel videos

This is the code powering @ytsearchbot.

## How it works?
People says "images are worth thousands of words". Let's make that sentence true:
```
@ytsearchbot Faze Clan
```
Results:

![image](http://i.imgur.com/I50nqyL.png)

Press on any video, for example the third.

Result:

![image](http://i.imgur.com/Jpf9oi1.png)

This Telegram Bot basically reacts to inline queries: input a YouTube channel nickname and just wait. Last results will appear with thumbnail, title and description... Press on them and you can share its link to every people you're talking it, fast and easy, without even open your YouTube app!

## About this repo
This repository is based on my repository about Telegram bots based on Telegraf. For more details about how to quickstart a Telegraf bot for Telegram app and how to configure additional features, check: https://github.com/Finalgalaxy/telegram-telegraf-bot

## tl;dr?
Once you cloned the repository: `git clone https://github.com/Finalgalaxy/yt-search-bot`,
you need to enter into project dir: `cd yt-search-bot`
and type `npm install` to install all dependencies.

Create a `config.js` file in the root of this project with the following info:
```javascript
module.exports = {
    // API key for YouTube
    youtube_api_key:'YOUR_YOUTUBE_API_KEY',

    // API key for Telegram
    telegraf_token:'YOUR_TELEGRAM_API_KEY'
};
```
For YouTube API key, check: https://developers.google.com/youtube/registering_an_application#Create_API_Keys

For Telegram API key, check https://github.com/Finalgalaxy/telegram-telegraf-bot and follow README instructions about how to create a Telegram Bot.