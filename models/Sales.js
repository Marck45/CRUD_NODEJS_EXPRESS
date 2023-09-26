const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    notification: String,
    product: String,
    discount: Number,
    discountValue: Number,
    finalValue: Number
});

const Sales = mongoose.model('Customer', salesSchema);

module.exports = Sales;