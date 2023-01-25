module.exports = require('mongoose').model("Product", {
    from: String,
    title: String,
    about: String,
    price: String,
    image: String
})