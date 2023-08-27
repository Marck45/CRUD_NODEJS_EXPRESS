const express = require('express');
const multer = require('multer');
const Produto = require('../models/Produto.js');

const router = express.Router();

// Configuração do armazenamento de arquivos com o multer
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


// Read - leitura de dados
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.find().sort({ _id: 1 });
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// criando rotas dinâmicas
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const produto = await Produto.findOne({ _id: id });
    if (!produto) {
      res.status(422).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Update - atualizando dados (put, patch)
router.put('/:_id', upload.single('photo'), async (req, res) => {
  try {
    const { _id, nome, valor, descricao, custo, marca, medida, quantidade, validade, lote } = req.body;

    const produto = {
      nome,
      valor,
      descricao,
      custo,
      marca,
      medida,
      quantidade,
      validade,
      lote,
      photo: req.file ? req.file.buffer : undefined // Atualiza a imagem apenas se houver uma nova imagem na solicitação
    };

    const updatedProduto = await Produto.findByIdAndUpdate(_id, produto);

    if (!updatedProduto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    return res.status(200).json({ message: 'Produto atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error);
    return res.status(500).json({ error: 'Erro ao atualizar o produto.' });
  }
});

// Delete - deletar dados
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const produto = await Produto.findOne({ _id: id });
  if (!produto) {
    res.status(422).json({ message: 'Produto não encontrado' });
    return;
  }
  try {
    await Produto.deleteOne({ _id: id });
    res.status(200).json({ message: 'Produto removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
