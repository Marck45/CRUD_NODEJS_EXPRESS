const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
    tenantId: {
        type: String,
        required: true,
      },
    nameExpense: String,
    value: Number,
    maturity: Date,
    description: String,
});

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = Expenses;