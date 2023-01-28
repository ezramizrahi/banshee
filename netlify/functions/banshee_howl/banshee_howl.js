
const { Telegraf } = require("telegraf");
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(ctx => {
  console.log("Received /start command")
  try {
    return ctx.reply("Bot started. Type howl to get a list of the movies showing today.")
  } catch (e) {
    console.error("error in start action:", e)
    return ctx.reply("Error occured")
  }
});

bot.hears('howl', async function (ctx, next) {
    const res = await axios.get(
        `https://banshee.netlify.app/.netlify/functions/get_movies`
    );
    let movieTimes;
    if (res.data.length > 1) {
        movieTimes = res.data.map((d) => d.bot_text).join('\n\n');
    } else {
        movieTimes = 'No data yet';
    }
    await ctx.telegram.sendMessage(ctx.message.chat.id,
        `Hi ${ctx.message.chat.first_name}. Here are today's movies playing at The Ritz https://www.ritzcinemas.com.au. Enjoy.\n\n${movieTimes}`,
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