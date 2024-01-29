const express = require("express");
const Company = require("../models/Company.js");

const router = express.Router();

// carrega todos os dados da empresa
router.get("/", async (req, res) => {
  try {
    const company = await Company.find().sort();
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//cadastro da Empresa
router.post("/", async (req, res) => {
  try {
    const {
      cnpj,
      razaoSocial,
      NomeFantasia,
      inscricaoEstadual,
      inscricaoMunicipal,
      cnae,
      phone,
      phone2,
      email,
      email2,
      cep,
      estado,
      cidade,
      bairro,
      address,
    } = req.body;

    const company = new Company({
      cnpj,
      razaoSocial,
      NomeFantasia,
      inscricaoEstadual,
      inscricaoMunicipal,
      cnae,
      phone,
      phone2,
      email,
      email2,
      cep,
      estado,
      cidade,
      bairro,
      address,
    });

    await company.save();

    return res.status(201).json({ message: "Empresa cadastrada!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cadastrar o empresa." });
  }
});

// rota para atualizar company
router.put("/:_id", async (req, res) => {
  try {
    const {
      _id,
      cnpj,
      razaoSocial,
      NomeFantasia,
      inscricaoEstadual,
      inscricaoMunicipal,
      cnae,
      phone,
      phone2,
      email,
      email2,
      cep,
      estado,
      cidade,
      bairro,
      address,
    } = req.body;

    const company = {
      cnpj,
      razaoSocial,
      NomeFantasia,
      inscricaoEstadual,
      inscricaoMunicipal,
      cnae,
      phone,
      phone2,
      email,
      email2,
      cep,
      estado,
      cidade,
      bairro,
      address,
    };

    const updateCompany = await Company.findByIdAndUpdate(_id, company);

    if (!updateCompany) {
      return res.status(404).json({ error: "Empresa não encontrado" });
    }

    return res.status(200).json({ message: "Empresa atualizado" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar o Empresa." });
  }
});

module.exports = router;
