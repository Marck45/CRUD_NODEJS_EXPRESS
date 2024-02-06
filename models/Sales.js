const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
      },
    cod: String,
    name: String,
    email: String,
    phone: Number,
    notification: Boolean,
    product: String,
    discount: Number,
    discountValue: Number,
    finalValue: Number
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;