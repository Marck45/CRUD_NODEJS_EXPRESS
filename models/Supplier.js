const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
      },
    sales: String,
    work: String,
    email: String,
    phone1: Number,
    phone2: Number,
    address: String,
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;