const express = require('express');
const multer = require("multer");
const Produto = require('../models/Produto.js');

const router = express.Router();

// Configurar o armazenamento de arquivos com o multer
const storage = multer.memoryStorage(); // Armazena a imagem na memória antes de salvar
const upload = multer({ storage });

// Rota para fazer o upload da imagem
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
    }

    // Aqui, você pode salvar a imagem no seu modelo Produto ou onde preferir
    // Certifique-se de adaptar isso de acordo com a estrutura do seu modelo.

    // Exemplo de como salvar a imagem no seu modelo Produto
    const { _id } = req.body; // Certifique-se de ter o _id do produto associado

    const produto = await Produto.findById(_id);

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    produto.photo = req.file.buffer; // Armazena a imagem no modelo do produto
    await produto.save();

    return res.status(201).json({ message: 'Imagem salva com sucesso.' });
  } catch (error) {
    console.error('Erro ao salvar a imagem:', error);
    return res.status(500).json({ error: 'Erro ao salvar a imagem.' });
  }
});

// ... Outras rotas do seu código

module.exports = router;
