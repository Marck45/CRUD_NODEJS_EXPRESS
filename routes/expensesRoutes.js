const express = require("express");
const Expenses = require("../models/Expenses.js");

const router = express.Router();

// carregar todos fornecedores
router.get("/", async (req, res) => {
  try {
    const expenses = await Expenses.find().sort();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nameExpense, value, maturity, description } = req.body;

    const expenses = new Expenses({
      nameExpense,
      value,
      maturity,
      description,
    });

    await expenses.save();

    return res.status(201).json({ message: "Despesa cadastrada!" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cadastrar o Despesa." });
  }
});

// rota para atualizar fornecedor

router.put("/:_id", async (req, res) => {
  try {
    const { _id, nameExpense, value, maturity, description } = req.body;

    const expenses = {
        _id,
        nameExpense,
        value,
        maturity,
        description,
    };

    const updateExpenses = await Expenses.findByIdAndUpdate(_id, expenses);

    if (!updateExpenses) {
      return res.status(404).json({ error: "Despesa não encontrada" });
    }

    return res.status(200).json({ message: "Despesa atualizada" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar o Despesa." });
  }
});

//   rota para deletar fornecedor

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const expenses = await Expenses.findOne({ _id: id });
  if (!expenses) {
    res.status(422).json({ message: "Despesa não encontrada" });
    return;
  }
  try {
    await Expenses.deleteOne({ _id: id });
    res.status(200).json({ message: "Despesa removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
