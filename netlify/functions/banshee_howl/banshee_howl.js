
const { Telegraf } = require("telegraf");
const axios = require('axios');
const json2html = require('node-json2html');

const bot = new Telegraf(process.env.BOT_TOKEN);

// let html = json2html.transform(data,{"<>": "li", "html":[
//     {"<>": "span", "text": "${movie} ${summary}"}
// ]});

bot.start(ctx => {
  console.log("Received /start command")
  try {
    return ctx.reply("bot is started")
  } catch (e) {
    console.error("error in start action:", e)
    return ctx.reply("Error occured")
  }
});

bot.hears('howl', async function (ctx, next) {
    const res = await axios.get(
        `https://banshee.netlify.app/.netlify/functions/get_movies`
    );
    let movieTimes
    if (res.data.length > 1) {
        movieTimes = res.data.filter((d) => d.bot_text).join('\n');
    } else {
        movieTimes = 'No data yet';
    }
    await ctx.telegram.sendMessage(ctx.message.chat.id,
        `hi ${ctx.message.chat.first_name}! ${movieTimes}`,
        { parse_mode: 'HTML' }
    )
});

bot.on('message', async function (ctx, next) {
    await ctx.telegram.sendMessage(ctx.message.chat.id,
        "<b>Babylon A tale of outsized ambition and outrageous excess tracing the rise and fall of multiple characters in an era of unbridled decadence and depravity during Hollywood</b>",
      { parse_mode: 'HTML' }
    )
});

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
const handler = async event => {
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: "" }
  } catch (e) {
    console.error("error in handler:", e)
    return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" }
  }
};

module.exports = { handler };