const express = require("express");
const Customer = require("../models/Customer.js");

const router = express.Router();

// carrega todos os usuarios cadastrados
router.get("/", async (req, res) => {
  try {
    const customer = await Customer.find().sort();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//cadastro de usuario
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address, notification } = req.body;

    const customer = new Customer({
      name,
      email,
      phone,
      address,
      notification,
    });

    await customer.save();

    return res.status(201).json({ message: "Cliente cadastrado!" });
  } catch (error) {}
});

// rota para atualizar customer
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
    return res.status(500).json({ error: "Erro ao atualizar o cliente." });
  }
});

// rota para deletar usuario
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const customer = await Customer.findOne({ _id: id });
  if (!customer) {
    res.status(422).json({ message: "Cliente não encontrado" });
    return;
  }
  try {
    await Customer.deleteOne({ _id: id });
    res.status(200).json({ message: "Cliente removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//   rota para filtrar usuario
router.get('/filter', async (req, res) => {
  try {

    const usersFilter = req.query.name;

    // Verifique se o nome foi fornecido como parâmetro de consulta
    if (!usersFilter) {
        throw new Error('Você deve fornecer um parâmetro de consulta.');
      }

    // Filtrar os dados com base no nome
    const customersFiltrados = await Customer.find({
      name: { $regex: new RegExp(usersFilter, "i") },
    });

    // Verifique se algum produto foi encontrado
    if (customersFiltrados.length === 0) {
      throw new Error("Nenhum cliente encontrado com o nome fornecido.");
    }

    res.json(customersFiltrados);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

module.exports = router;
