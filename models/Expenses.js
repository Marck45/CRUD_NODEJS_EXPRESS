const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
    nameExpense: String,
    value: String,
    maturity: Date,
    description: String,
});

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = Expenses;