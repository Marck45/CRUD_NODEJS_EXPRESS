const express = require('express');
const multer = require('multer');
const Produto = require('../models/Produto.js');
const uploadImage = require('../service/firebase.js');

const router = express.Router();

// Configuração do armazenamento de arquivos com o multer
const upload = multer({
   storage: multer.memoryStorage(),
   limits: 1024 * 1024,
});

// Rota para fazer o upload da imagem
router.post('/', upload.single('photo'), uploadImage, async (req, res) => {
  try {
    const tenantId = req.tenantId; // Obtém o ID do tenant do middleware
    const { _id, nome, valor, descricao, custo, marca, medida, quantidade, validade, lote } = req.body;

    // Verifique se req.file contém a imagem
    if (!req.file) {
      console.log('Nenhuma imagem foi enviada.');
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
    } 

    const imageUrl = req.produtoFirebaseUrl; 

    // Use o construtor do modelo Produto para criar uma nova instância
    const produto = new Produto({
      _id,
      nome,
      valor,
      descricao,
      custo,
      marca,
      medida,
      quantidade,
      validade,
      lote,
      photo: req.file ? req.file.buffer : undefined, // Armazena a imagem apenas se houver uma nova imagem na solicitação
      firebaseUrl: imageUrl,
      tenantId,
    });

    // Salve o produto no banco de dados
    await produto.save();

    return res.status(201).json({ message: 'Produto criado com sucesso.' });
  } catch (error) {
    console.error('Erro ao criar o produto:', error);
    return res.status(500).json({ error: 'Erro ao criar o produto.' });
  }
});

// Read - leitura de dados
router.get('/', async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const produtos = await Produto.find({ tenantId }).sort({ _id: 1 });
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para filtrar produtos com base em critérios
router.get('/filter', async (req, res) => {
  try {
    const tenantId = req.tenantId;
    // Recupere o parâmetro de consulta "nome" da URL
    const nomeFiltrado = req.query.nome;

    // Verifique se o nome foi fornecido como parâmetro de consulta
    if (!nomeFiltrado) {
      throw new Error('Você deve fornecer um parâmetro de consulta "nome".');
    }

    // Filtrar os dados com base no nome e tenantId
    const produtosFiltrados = await Produto.find({ nome: { $regex: new RegExp(nomeFiltrado, 'i') }, tenantId });

    // Verifique se algum produto foi encontrado
    if (produtosFiltrados.length === 0) {
      throw new Error('Nenhum produto encontrado com o nome fornecido.');
    }

    // Retorne os produtos filtrados como resposta
    res.json(produtosFiltrados);
  } catch (error) {
    // Captura e trata erros
    res.status(400).json({ erro: error.message });
  }
});

// Criando rotas dinâmicas
router.get('/:id', async (req, res) => {
  const tenantId = req.tenantId;
  const id = req.params.id;
  try {
    const produto = await Produto.findOne({ _id: id, tenantId });
    if (!produto) {
      res.status(422).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Update - atualizando dados (put, patch)
router.put('/:_id', upload.single('photo'), uploadImage, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { _id, nome, valor, descricao, custo, marca, medida, quantidade, validade, lote } = req.body;

    const imageUrl = req.produtoFirebaseUrl; 

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
      photo: req.file ? req.file.buffer : undefined, // Atualiza a imagem apenas se houver uma nova imagem na solicitação
      firebaseUrl: imageUrl,
      tenantId,
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
  const tenantId = req.tenantId;
  const id = req.params.id;
  const produto = await Produto.findOne({ _id: id, tenantId });
  
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
