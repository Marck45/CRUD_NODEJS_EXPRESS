const express = require("express");
const Customer = require("../models/Customer.js");

const router = express.Router();


// carrega todos os usuarios cadastrados
router.get('/', async (req, res) => {
  try {
    const customer = await Customer.find().sort();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
