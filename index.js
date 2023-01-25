process.env.NODE_ENV !== 'production' ? require("dotenv").config({ path: ".env" }) : null;
const { Telegraf, Markup } = require('telegraf');
const productModel = require("./models/productModel");
const savatModel = require("./models/savatModel");
const userModel = require("./models/userModel");
const { fnc } = require("./Others/cfg");
const cfg = require("./Others/cfg");
const bot = new Telegraf(process.env.TELE_TOKEN)
require('mongoose').connect(process.env.MongoDB)

const setStep = fnc.setStep

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

                    if(tx === "👥Foydalanuvchilar" || tx === "👥Пользователи"|| user.step === "users"){
                        setStep(id, { step: "users" });
                        let btns = [];
                        let all = await userModel.find();
                        for (let k of all) {
                          btns.push([{ text: k.name, callback_data: "users__" + k.id }]);
                        }
                        sm(
                          "Barcha foydalanuvchilar :",
                          Markup.inlineKeyboard(btns),
                          keyboard.back
                        );
                    }
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

            }else if (tx === '📊Statistika' || tx === '📊Statistika') {
                let products = await savatModel.find()
                let productBtns =[]
                for(var product of products){
                    productBtns.push({text: product.name, callback_data:"product__"+product.to})
                }

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
bot.on("callback_query", (msg) => {
    const { data } = msg.callbackQuery;
    const {id} = msg.callbackQuery.from
     // const message = user.lang=='ru'?require('./Others/cfg').message.ru:require('./Others/cfg').message.uz
    // const keyboard = user.lang=='ru'?require('./Others/cfg').keyboard.ru:require('./Others/cfg').keyboard.uz
    const messages = require('./Others/cfg').message.uz
    const keyboard = require('./Others/cfg').keyboard.uz
    const sm = (text, keyb) => {
      msg.replyWithHTML(text, { ...keyb });
    };
    msg.deleteMessage();
    if (data.includes("users__")) {
      const userID = data.split("__")[1];
      userModel.findOne({ id: userID }).then((data) => {
        sm(
          data.name,
          Markup.inlineKeyboard([
            [
              { text: "Ma'lumotlari", callback_data: "info__" + data.id }
            ],
            [
              { text: "Balansni ko'rish", callback_data: "balance__" + data.id }
            ],
            [
              {
                text: !data.ban ? "Bloklash" : "Blokdan olish",
                callback_data: !data.ban
                  ? "block__" + data.id
                  : "free__" + data.id,
              }
            ],
          ])
        );
      });
    }
    if (data.includes("block__")) {
      const userID = data.split("__")[1];
      setStep(userID, { ban: "true" });
      sm("Blocklandi", keyboard.back);
      sendM(
        userID,
        messages.freedom
      );
    }
    if (data.includes("free__")) {
      const userID = data.split("__")[1];
      setStep(userID, { ban: "false" });
      sm("Blockdan olindi", keyboard.back);
      sendM(
        userID,
        messages.blocked
      );
    }
    if (data.includes("info__")) {
      const userID = data.split("__")[1];
      userModel.findOne({ id: userID }).then((data) => {
        sm(
          `👤Ismi: ${data.name}\n📞Asosiy Tel: ${data.phone}\n📞Qo'shimcha Tel: ${data.phone2}\n`,
          Markup.inlineKeyboard(x
              [{text: "Qaytish", callback_data: "back"}]
          )
        );
      });
    }if(data === "back"){
      setStep(id, {step: "users"})
    }
    if (data.includes("balance__")) {
      const userID = data.split("__")[1];
      userModel.findOne({ id: userID }).then((data) => {
        sm(
          `💰Hisob raqamidagi pullar:\n${data.balance} UZS`,
          Markup.inlineKeyboard([
            [{ text: "Hisobni to'ldirish", callback_data: "pay__" + data.id }, { text: "Hisobdan olish", callback_data: "get__" + data.id }],
            [{text: "Qaytish", callback_data: "back"}]
          ]),
          keyboard.back
        );
      });
    } if(data.includes("product__")){
        const toID = data.split("__")[1];
        savatModel.findOne({id:toID}).then(res => {
            sm(`Mahsulot nomi: ${res.name}\nMahsulot narxi: ${res.price}sum\nSotib olingan soni: ${res.number}\nUmumiy summa: ${res.number}*${res.price}sum`,keyboard.back)
        })
    }
  });

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