const express = require("express");
const Sales = require("../models/Sales.js");

const router = express.Router();

// Carrega todas as vendas do tenant
router.get("/", async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const sales = await Sales.find({ tenantId }).sort();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { cod, name, email, product, discount, discountValue, finalValue, originalValue } = req.body;

    const sales = new Sales({
      cod,
      name,
      email,
      product,
      discount,
      discountValue,
      finalValue,
      originalValue,
      tenantId,
    });

    await sales.save();

    return res.status(201).json({ message: "Venda cadastrada!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar venda
router.put("/:_id", async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { _id, cod, name, email, product, discount, discountValue, finalValue, originalValue } = req.body;

    const sales = {
      _id,
      cod,
      name,
      email,
      product,
      discount,
      discountValue,
      finalValue,
      originalValue,
      tenantId,
    };

    const updateSales = await Sales.findByIdAndUpdate(_id, sales);

    if (!updateSales) {
      return res.status(404).json({ error: "Venda não encontrada" });
    }

    return res.status(200).json({ message: "Venda atualizada" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Rota para deletar venda
router.delete("/:id", async (req, res) => {
  const tenantId = req.tenantId;
  const id = req.params.id;
  const sales = await Sales.findOne({ _id: id, tenantId });

  if (!sales) {
    res.status(422).json({ message: "Venda não encontrada" });
    return;
  }

  try {
    await Sales.deleteOne({ _id: id });
    res.status(200).json({ message: "Venda removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
