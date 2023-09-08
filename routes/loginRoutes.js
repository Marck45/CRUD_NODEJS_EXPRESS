const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Login = require("../models/Login.js");

const router = express.Router();

// rota para criação de usuario

router.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // validações de dados

  if (!name) {
    return res.status(422).json({ msg: "Nome Obrigatorio" });
  }
  if (!email) {
    return res.status(422).json({ msg: "E-mail Obrigatorio" });
  }
  if (!password) {
    return res.status(422).json({ msg: "Senha é Obrigatoria" });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ msg: "Senhas diferentes" });
  }

  // checar se usuario existe

  const userExists = await Login.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "E-mail já cadastrado" });
  }

  // criar Senha

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  // criar usuario

  const login = new Login({
    name,
    email,
    password: passwordHash,
  });

  try {
    await login.save();

    res.status(200).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error no servidor, tente novamente mais tarde" });
  }
});

// rota para login de usuario

router.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  // validações
  if (!email) {
    return res.status(422).json({ msg: "E-mail Obrigatorio" });
  }
  if (!password) {
    return res.status(422).json({ msg: "Senha é Obrigatoria" });
  }

  // checar se usuario existe

  const user = await Login.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado" });
  }

  // checar se a senha é igual

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha invalida" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ msg: "Autenticação realizada com sucesso", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Error no servidor, tente novamente mais tarde" });
  }
});

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);

    next();
  } catch (error) {
    return res.status(400).json({ msg: "Token invalido" });
  }
}

module.exports = router;
