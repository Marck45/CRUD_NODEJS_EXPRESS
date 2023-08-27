const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
    _id: Number,
    nome: String,
    valor: Number,
    custo: Number,
    descricao: String,
    marca: String,
    medida: String,
    quantidade: Number,
    validade: Date,
    lote: Number,
    photo: Buffer, // Alterado para o tipo Buffer para armazenar dados binários da imagem
});

const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;
