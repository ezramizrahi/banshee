
const { Telegraf } = require("telegraf");
const { MongoClient } = require("mongodb");
const axios = require('axios');

const mongoClient = new MongoClient(process.env.ATLAS_URI);
const clientPromise = mongoClient.connect();
const json2html = require('node-json2html');

// create new bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// let html = json2html.transform(data,{"<>": "li", "html":[
//     {"<>": "span", "text": "${movie} ${summary}"}
// ]});
// console.log(html)
// let mymsg;
// async function getMyData() {
//     try {
//         const res = await axios.get(
//             `https://banshee.netlify.app/.netlify/functions/get_movies`
//         );
//         console.log('data', res);
//     } catch (err) {
//         console.log(err);
//     }

//     // testing if i can get data
//     if (res) {
//         return mymsg = 'ive got data';
//     } else {
//         return mymsg = 'no data';
//     }
// };
// getMyData();

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
    try {
        const res = await axios.get(
            `https://banshee.netlify.app/.netlify/functions/get_movies`
        );
        console.log('data', res);
    } catch (err) {
        console.log(err);
    }
    let mymsg;
    if (res) {
        mymsg = 'i have data'
    } else {
        mymsg = 'no data'
    }

    await ctx.telegram.sendMessage(ctx.message.chat.id,
        `hi ${ctx.message.chat.first_name}! ${mymsg}`,
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
    // const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    // const collection = database.collection(process.env.MONGODB_COLLECTION);
    // const results = await collection.find({}).limit(30).toArray();
    return { statusCode: 200, body: "" }
  } catch (e) {
    console.error("error in handler:", e)
    return { statusCode: 400, body: "This endpoint is meant for bot and telegram communication" }
  }
};

module.exports = { handler };