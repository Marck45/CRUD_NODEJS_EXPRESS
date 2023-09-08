const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    address: String,
    notification: Boolean
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;