process.env.NODE_ENV !== 'production' ? require("dotenv").config({ path: ".env" }) : null;
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.TELE_TOKEN)
require('mongoose').connect(process.env.MongoDB)

// Bot start
bot.start(msg => {

})

// Bot text
bot.on('text', msg => {

})

// Bot inlineQuery
bot.on('callback_query', msg => {

})

// Bot contact
bot.on("contact", msg => {

})

bot.launch()