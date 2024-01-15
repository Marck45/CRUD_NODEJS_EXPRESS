const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    cnpj: String,
    razaoSocial: String,
    NomeFantasia: String,
    inscricaoEstadual: Number,
    inscricaoMunicipal: Number,
    cnae: Number,
    phone: Number,
    phone2: Number,
    email: String,
    email2: String,
    cep: Number,
    estado: String,
    cidade: Number,
    bairro: String,
    address: String,
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;