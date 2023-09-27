const express = require("express");
const Sales = require("../models/Sales.js");

const router = express.Router();

// carregar todos fornecedores
router.get("/", async (req, res) => {
  try {
    const sales = await Sales.find().sort();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, notification, product, discount, discountValue, finalValue  } = req.body;

    const sales = new Sales({
      name,
      email,
      phone,
      notification,
      product,
      discount,
      discountValue,
      finalValue
    });

    await sales.save();

    return res.status(201).json({ message: "Venda cadastrada!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cadastrar o Venda." });
  }
});

// rota para atualizar fornecedor

router.put("/:_id", async (req, res) => {
  try {
    const { _id, name, email, phone, notification, product, discount, discountValue, finalValue } = req.body;

    const sales = {
        _id,
        name,
        email,
        phone,
        notification,
        product,
        discount,
        discountValue,
        finalValue
    };

    const updateSales = await Sales.findByIdAndUpdate(_id, sales);

    if (!updateSales) {
      return res.status(404).json({ error: "Venda não encontrada" });
    }

    return res.status(200).json({ message: "Venda atualizada" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar o Venda." });
  }
});

//   rota para deletar fornecedor

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const sales = await Sales.findOne({ _id: id });
  if (!sales) {
    res.status(422).json({ message: "Venda não encontrada" });
    return;
  }
  try {
    await Sales.deleteOne({ _id: id });
    res.status(200).json({ message: "Venda removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
