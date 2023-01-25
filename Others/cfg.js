const { Markup } = require("telegraf");
const userModel = require("../models/userModel");
const logo = "<b>APN Magazin</b>"
module.exports = {
    keyboard: {
        uz: {
            main: Markup.keyboard([
                ["📦Barcha mahsulotlar", "📞Aloqa"], ["👤Profil", "📊Statistika"],["📚Bot haqida"]
            ]).resize(true),
            back: Markup.keyboard([
                ["🔙Ortga"]
            ]).resize(true),
            admin_main: Markup.keyboard([
                ["📦Mahsulot joylash", '👥Foydalanuvchilar']
            ]).resize(true),
            contact: Markup.keyboard([
                [Markup.button.contactRequest("☎️Raqamni yuborish")]
            ]).resize(true)
        },
        ru: {

        }
    },
    message: {
        uz: {
            main: `👋Salom! ${logo} botiga xush kelibsiz!\n📥Bu botda o'zingizga yoqqan mahsulotlarni ko'rishingiz va sotib olishingiz mumkin`,
            home: "🏘Bosh sahifa",
            contact: "📨Bo'tdan to'liq foydalanish uchun ☎️Raqamni yuborish tugmasini bosing!",
            upcont: "✅Raqamingiz qalub qilindi!",
            ban: "💥 Siz admin tomonidan qora ro'yxatga tushirildingiz 🤕",
            admin_main: "👨‍⚖️Admin Panelga hush kelibsiz❗",
            
            err_admin: "❌Siz admin emassiz!",
            product_title: "📦Mahsulot sarlavhasini kiriting\n📋Masalan: <b>Iphone XS Max</b>",
            product_about: "📦Mahsulot haqida kiriting\n📋Masalan: <b>Iphone XS Max gray. Ozu 8gb, xotirasi 224gb...</b>",
            product_price: "📦Mahsulot narxini kiriting\n📋Masalan: <b>5 000 000</b>\n\n<b>⭕️Eslatma:</b><i> Narx faqat so'mda kiritiladi!</i>",
            product_image: "📦Mahsulot rasmni kiriting\n<b>⭕️Eslatma:</b><i>Faqat bir dona rasm yuklash mumkin!</i>",
            blocked:"<b>Siz admin tomonidan blockdan olindingiz!</b>\nEndi botdan foydalanishingiz mumkin!",
            freedom: "<b>Siz admin tomonidan blocklandingiz!</b>\nEndi botdan foydalana olmaysiz!"
        },
        ru: {

        }
    },
    fnc: {
        setStep: function (id, editObj) {
            try {
                userModel.findOneAndUpdate({ id }, editObj, { upsert: true, new: true, runValidators: true }, () => { })
            } catch (error) {
                return false
            }
        }
    }
}