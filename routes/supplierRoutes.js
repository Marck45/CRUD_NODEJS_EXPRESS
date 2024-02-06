const express = require("express");
const Supplier = require("../models/Supplier.js");

const router = express.Router();

// Carrega todos os fornecedores do tenant
router.get("/", async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const supplier = await Supplier.find({ tenantId }).sort();
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const tenantId = req.tenantId;
  const { sales, work, email, phone1, phone2, address } = req.body;

  // Checar se usuário existe
  const userExists = await Supplier.findOne({ email: email, tenantId });

  if (userExists) {
    return res.status(422).json({ msg: "E-mail já cadastrado" });
  }

  try {
    const supplier = new Supplier({
      sales,
      work,
      email,
      phone1,
      phone2,
      address,
      tenantId,
    });

    await supplier.save();

    return res.status(201).json({ message: "Fornecedor cadastrado!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar fornecedor
router.put("/:_id", async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { _id, sales, work, email, phone1, phone2, address } = req.body;

    const supplier = {
      sales,
      work,
      email,
      phone1,
      phone2,
      address,
      tenantId,
    };

    const updateSupplier = await Supplier.findByIdAndUpdate(_id, supplier);

    if (!updateSupplier) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    return res.status(200).json({ message: "Fornecedor atualizado" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Rota para deletar fornecedor
router.delete("/:id", async (req, res) => {
  const tenantId = req.tenantId;
  const id = req.params.id;
  const supplier = await Supplier.findOne({ _id: id, tenantId });

  if (!supplier) {
    res.status(422).json({ message: "Fornecedor não encontrado" });
    return;
  }

  try {
    await Supplier.deleteOne({ _id: id });
    res.status(200).json({ message: "Fornecedor removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
