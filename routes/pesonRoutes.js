const router = require('express').Router();
const Produto = require('../models/Produto.js')


router.post('/', async (req, res) => {

    // req.body
    console.log(req.body);
    const {nome, valor, descricao, disponivel } = req.body;

    if(!nome){

        res.status(422).json({ error: 'O nome é obrigatorio'});

    }

    const produto = {
        nome,
        valor,
        descricao,
        disponivel,

    }

    // created mongoose
 
    try{
        // criando dados
    await Produto.create(produto);

    res.status(201).json({message: 'Produto inserido com sucesso'})

    }

    catch(error){

        res.status(500).json({error: error});

    }

})


// Read - leitura de dados

router.get('/', async(req, res)=>{

    try{

        const produtos = await Produto.find().sort({valor: 1});

        res.status(200).json(produtos)

    } catch(error){

        res.status(500).json({ error: error });
    }

})

// criando rotas dinamicas

router.get('/:id', async (req, res) =>{
    // extrair o dado da requisição
    const id = req.params.id;

    try{

        const produto = await Produto.findOne({_id: id});

        if(!produto){
            res.status(422).json({message: 'Produto não encontrado'})
        }

        res.status(200).json(produto)

    } catch(error){
        res.status(500).json({ error: error });
    }
})


// update -atualizando dados (put, patch)
router.patch('/:id', async (req, res)=>{

    const id = req.params.id;

    const {nome, valor, descricao, disponivel } = req.body;

    const produto = {
        nome,
        valor,
        descricao,
        disponivel,

    }

    try{

        const updatedProduto = await Produto.updateOne({_id: id},produto);

        if(updatedProduto.matchedCount === 0){

            res.status(422).json({message: 'Produto não encontrado'});

        }

        res.status(200).json(produto);

    }
    catch(error){
        res.status(500).json({ error: error }); 
    }

})


// Delete - deletar dados

router.delete('/:id', async (req, res) =>{

    const id = req.params.id;

    const produto = await Produto.findOne({_id: id});

    if(!produto){

        res.status(422).json({message: 'Produto não encontrado'});

        return;
    }

    try{

        await Produto.deleteOne({_id: id});

        res.status(200).json({ message: 'Produto removido com sucesso!'});

    }

    catch(error){

        res.status(500).json({ error: error }); 
    }

})

module.exports = router;
