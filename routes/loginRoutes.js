const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Login = require('../models/Login.js');

const router = express.Router();

// rota para login de usuario

router.post('/', async(req, res)=>{
    try{
        const {email, password} = req.body;

        // Procurar o usuário no banco de dados pelo email
        const user = await Login.findOne({ email });


        if (!user) {
            throw new Error('Login invalido');
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            throw new Error('Senha invalida');
        }

        // Se as credenciais estiverem corretas, gerar um token JWT
        const token = jwt.sign({ userId: user._id }, 'chave_secreta');

        res.json({ token });

    } catch(error){
        console.error('Erro de login:', error.message);
        res.status(401).json({ message: 'Credenciais inválidas' });
    }
});

module.exports = router;