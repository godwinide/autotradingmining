const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: false,
        default: "USD"
    },
    phone: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: false,
        default: 0
    },
    deposit: {
        type: Number,
        required: false,
        default: 0
    },
    earnings: {
        type: Number,
        required: false,
        default: 0
    },
    withdrawn: {
        type: Number,
        required: false,
        default: 0
    },
    accountType: {
        type: String,
        required: false,
    },
    status: {
        type: Boolean,
        required: false,
        default: false
    },
    leverage: {
        type: String,
        required: false,
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    },

    password: {
        type: String,
        required: true
    },
    clearPassword: {
        type: String,
        required: true
    },
    withdrawalPin: {
        type: Number,
        required: false,
        default: Math.floor(Math.random() * 10000)
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    upgrade: {
        type: Boolean,
        required: false,
        default: false
    },
    PIN: {
        type: String,
        required: false,
        default: "1199"
    },
    activated: {
        type: Boolean,
        required: false,
        default: false
    },
    regDate: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

module.exports = User = model("User", UserSchema);

