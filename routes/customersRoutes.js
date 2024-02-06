const express = require("express");
const Customer = require("../models/Customer.js");

const router = express.Router();

// Carrega todos os usuários cadastrados do tenant
router.get("/", async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const customers = await Customer.find({ tenantId }).sort();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cadastro de usuário
router.post("/", async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { name, email, phone, address, notification } = req.body;

    const customer = new Customer({
      name,
      email,
      phone,
      address,
      notification,
      tenantId,
    });

    const emailCheck = await Customer.findOne({ email, tenantId });

    if (emailCheck) {
      return res.status(422).json({ msg: "E-mail já cadastrado" });
    }

    await customer.save();

    return res.status(201).json({ message: "Cliente cadastrado!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar cliente
router.put("/:_id", async (req, res) => {
  try {
    const { _id, name, email, phone, address, notification } = req.body;

    const customer = {
      name,
      email,
      phone,
      address,
      notification,
    };

    const updateCustomer = await Customer.findByIdAndUpdate(_id, customer);

    if (!updateCustomer) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    return res.status(200).json({ message: "Cliente atualizado" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Rota para deletar usuário
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const customer = await Customer.findOne({ _id: id, tenantId: req.tenantId });

  if (!customer) {
    res.status(422).json({ message: "Cliente não encontrado" });
    return;
  }

  try {
    await Customer.deleteOne({ _id: id });
    res.status(200).json({ message: "Cliente removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para filtrar usuário
router.get("/filter", async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const usersFilter = req.query.name;

    // Verifique se o nome foi fornecido como parâmetro de consulta
    if (!usersFilter) {
      throw new Error("Você deve fornecer um parâmetro de consulta.");
    }

    // Filtrar os dados com base no nome e tenantId
    const customersFiltrados = await Customer.find({
      name: { $regex: new RegExp(usersFilter, "i") },
      tenantId,
    });

    // Verifique se algum cliente foi encontrado
    if (customersFiltrados.length === 0) {
      throw new Error("Nenhum cliente encontrado com o nome fornecido.");
    }

    res.json(customersFiltrados);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

module.exports = router;
