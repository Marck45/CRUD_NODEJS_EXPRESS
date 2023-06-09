const mongoose = require('mongoose');

const Produto = mongoose.model('Produto', {
    _id: Number,
    nome: String,
    valor: Number,
    custo: Number,
    descricao: String,
    disponivel: Number,
});


module.exports = Produto;
