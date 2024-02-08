const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  
    name: String,
    email: String,
    phone: Number,
    description: String,
});

const Leads = mongoose.model('Leads', leadSchema);

module.exports = Leads;