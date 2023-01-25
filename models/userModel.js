module.exports = require('mongoose').model("User", {
    id: String,
    name: String,
    phone: {
        type: String,
        default: "none"
    },
    phone2: {
        type: String,
        default: "none"
    },
    step: {
        type: String,
        default: "none"
    },
    balance: {
        type: Number,
        default: "0"
    },
    admin: {
        type: Boolean,
        default: false
    },
    ban: {
        type: Boolean,
        default: false
    }
})