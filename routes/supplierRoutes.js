const express = require("express");
const Supplier = require("../models/Supplier.js");

const router = express.Router();

// carregar todos fornecedores
router.get("/", async (req, res) => {
  try {
    const supplier = await Supplier.find().sort();
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  const { sales, work, email, phone1, phone2, address } = req.body;
    // checar se usuario existe

    const userExists = await Supplier.findOne({ email: email });

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
    });

    await supplier.save();

    return res.status(201).json({ message: "Fornecedor cadastrado!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cadastrar o Fornecedor." });
  }
});

// rota para atualizar fornecedor

router.put("/:_id", async (req, res) => {
  try {
    const { _id, sales, work, email, phone1, phone2, address } = req.body;

    const supplier = {
      sales,
      work,
      email,
      phone1,
      phone2,
      address,
    };

    const updateSupplier = await Supplier.findByIdAndUpdate(_id, supplier);

    if (!updateSupplier) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    return res.status(200).json({ message: "Fornecedor atualizado" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar o Fornecedor." });
  }
});

//   rota para deletar fornecedor

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const supplier = await Supplier.findOne({ _id: id });
  if (!supplier) {
    res.status(422).json({ message: "Fornecedor não encontrado" });
    return;
  }
  try {
    await Supplier.deleteOne({ _id: id });
    res.status(200).json({ message: "Fornecedor removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
