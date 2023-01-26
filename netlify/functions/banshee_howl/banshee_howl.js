
const { Telegraf } = require("telegraf");
const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.ATLAS_URI);
const clientPromise = mongoClient.connect();
const json2html = require('node-json2html');

// create new bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// let html = json2html.transform(data,{"<>": "li", "html":[
//     {"<>": "span", "text": "${movie} ${summary}"}
// ]});
// console.log(html)

bot.start(ctx => {
  console.log("Received /start command")
  try {
    return ctx.reply("<li><span>Babylon A tale of outsized ambition and outrageous excess, tracing the rise and fall of multiple characters in an era of unbridled decadence and depravity during Hollywood&#39;s transition from silent films and to sound films in the late 1920s.</span></li>")
  } catch (e) {
    console.error("error in start action:", e)
    return ctx.reply("Error occured")
  }
});
bot.hears('howl', function (ctx, next) {
    ctx.telegram.sendMessage(ctx.message.chat.id,
        "<b>using the word howl will show a list of all movies today</b>",
        { parse_mode: 'HTML' }
    )
});
bot.on('message', function (ctx, next) {
    ctx.telegram.sendMessage(ctx.message.chat.id,
      "<b>this gets sent after user types in any message into the chat</b>",
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