const mongoose = require('mongoose');

const Produto = mongoose.model('Produto', {
    nome: String,
    valor: Number,
    descricao: String,
    disponivel: Boolean,
});


module.exports = Produto;