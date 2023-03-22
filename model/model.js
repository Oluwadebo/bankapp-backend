const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const BankSchema = new mongoose.Schema(
    {
        Name: String,
        email: String,
        password: String,
        pin: String,
        DateCreated: String,
        balance: Number,
        phoneno: {
            type: String,
            unique: true,
        },
        accountNumber: String,
        bvn: {
            type: String,
            unique: true,
        },
    }
)
BankSchema.pre("save", async function (next) {
    let { password, email, pin } = this;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    this.password = hashed;
    const hased = await bcrypt.hash(pin, salt);
    this.pin = hased;
    this.email = email.toLowerCase();
    next();
})

const historySchema = new mongoose.Schema(
    {
        customerId: String,
        Name: String,
        receiverId: String,
        Bbalance: Number,
        Tbalance: Number,
        added: String,
        transfer: String,
        received: String,
        accountNumber: String,
        transactiontime: String
    }
)

const BankModel = mongoose.model('Customers', BankSchema)
const historyModel = mongoose.model('historys', historySchema)

module.exports = { historyModel, BankModel };