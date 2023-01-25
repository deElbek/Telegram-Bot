process.env.NODE_ENV !== 'production' ? require("dotenv").config({ path: ".env" }) : null;
const { Telegraf, Markup } = require('telegraf');
const productModel = require("./models/productModel");
const userModel = require("./models/userModel");
const { fnc } = require("./Others/cfg");
const bot = new Telegraf(process.env.TELE_TOKEN)
require('mongoose').connect(process.env.MongoDB)

// Bot start
bot.start(async msg => {
    const { id, first_name } = msg.from
    let user = await userModel.findOne({ id })
    // const message = user.lang=='ru'?require('./Others/cfg').message.ru:require('./Others/cfg').message.uz
    // const keyboard = user.lang=='ru'?require('./Others/cfg').keyboard.ru:require('./Others/cfg').keyboard.uz
    const messages = require('./Others/cfg').message.uz
    const keyboard = require('./Others/cfg').keyboard.uz
    function sm(text, keyboard) {
        msg.replyWithHTML(text, { ...keyboard })
    }
    if (!user) {
        new userModel({
            id, name: first_name.replaceAll("<", "").replaceAll(">", "").replaceAll("/", "").replaceAll("\\", "")
        }).save()
        sm(messages.main, keyboard.main)
    } else if (user.admin) {
        sm(messages.admin_main, keyboard.admin_main)
    }
    else {
        sm(messages.main, keyboard.main)
    }
})

// Bot text
bot.on('text', async msg => {
    const { id } = msg.from
    const tx = msg.message.text
    let user = await userModel.findOne({ id })
    // const message = user.lang=='ru'?require('./Others/cfg').message.ru:require('./Others/cfg').message.uz
    // const keyboard = user.lang=='ru'?require('./Others/cfg').keyboard.ru:require('./Others/cfg').keyboard.uz
    const messages = require('./Others/cfg').message.uz
    const keyboard = require('./Others/cfg').keyboard.uz
    function sm(text, keyboard) {
        msg.replyWithHTML(text, { ...keyboard })
    }
    if (user.phone === 'none') {
        sm(messages.contact, keyboard.contact)
    } else {
        if (user.ban) {
            sm(messages.ban, Markup.removeKeyboard())
        } else {
            if (tx === "🔙Ortga" || tx === "🔙Назад") {
                if (user.admin) {
                    fnc.setStep(id, { step: "none" })
                    sm(messages.home, keyboard.admin_main)
                }
                else {
                    fnc.setStep(id, { step: "none" })
                    sm(messages.home, keyboard.main)
                }
            } else if (tx === "📦Mahsulot joylash" || tx === "📦 Продакт-плейсмент") {
                fnc.setStep(id, { step: "product_title" })
                sm(messages.product_title, keyboard.back)
            } else if (tx === '📦Barcha mahsulotlar' || tx === '📦 Все товары') {

            } else if (tx === '📞Aloqa' || tx === '📞Контакты') {

            } else if (tx === '👤Profil' || tx === '👤Профиль') {

            } else if (tx === '📚Bot haqida' || tx === "📚О боте") {

            } else if (user.step === 'product_title') {
                fnc.setStep(id, { step: "product_about" })
                sm(messages.product_about, keyboard.back)
            } else if (user.step === 'product_about') {
                fnc.setStep(id, { step: "product_price" })
                sm(messages.product_price, keyboard.back)
            } else if (user.step === 'product_price') {
                fnc.setStep(id, { step: "product_image" })
                sm(messages.product_image, keyboard.back)
            }
        }
    }
})

// Bot inlineQuery
bot.on('callback_query', msg => {

})

// Bot Photo
bot.on("photo", async msg => {
    const { id } = msg.from
    const photo = msg.message.photo
    let user = await userModel.findOne({ id })
    if (user.step === 'product_image') {
        new productModel({
            image: photo
        }).save()
    }
})

// Bot contact
bot.on("contact", async msg => {
    const { id } = msg.from
    const { phone_number } = msg.message.contact
    let user = await userModel.findOne({ id })
    // const message = user.lang=='ru'?require('./Others/cfg').message.ru:require('./Others/cfg').message.uz
    // const keyboard = user.lang=='ru'?require('./Others/cfg').keyboard.ru:require('./Others/cfg').keyboard.uz
    const messages = require('./Others/cfg').message.uz
    const keyboard = require('./Others/cfg').keyboard.uz
    function sm(text, keyboard) {
        msg.replyWithHTML(text, { ...keyboard })
    }
    if (user.phone === 'none') {
        fnc.setStep(id, { phone: !phone_number.includes("+") ? "+" + phone_number : phone_number })
        sm(messages.upcont, keyboard.main)
    }
})

bot.launch()