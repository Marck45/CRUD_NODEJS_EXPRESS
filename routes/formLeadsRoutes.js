const express = require("express");
const Leads = require("../models/Leads.js");

const router = express.Router();

// carrega todos os dados da empresa
router.get("/", async (req, res) => {
    try {
  
      const lead = await Leads.find().sort();
  
      res.status(200).json(lead);
  
    } catch (error) {
      res.status(500).json({ error: error });
    }
  });

  //cadastro da Empresa
router.post("/", async (req, res) => {

    try {
  
      const {
        name,
        email,
        phone,
        description,
      } = req.body;
  
      const lead = new Leads({
        name,
        email,
        phone,
        description,
      });
  
      await lead.save();
  
      return res.status(201).json({ message: "Mensagem enviada!" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao enviar mensagem" });
    }
  });

  
module.exports = router;