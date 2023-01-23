process.env.NODE_ENV!=='production'?require("dotenv").config({path: ".env"}):null;
const {Telegraf} = require('telegraf')
const bot = new Telegraf(process.env.TELE_TOKEN)

bot.launch()