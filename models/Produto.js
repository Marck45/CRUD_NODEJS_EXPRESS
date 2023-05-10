const mongoose = require('mongoose');

const Produto = mongoose.model('Produto', {
    _id: String,
    nome: String,
    valor: Number,
    descricao: String,
    disponivel: Boolean,
});


module.exports = Produto;