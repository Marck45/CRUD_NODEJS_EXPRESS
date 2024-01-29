const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Login = require("../models/Login.js");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const router = express.Router();

// Configurar a estratégia do Google para autenticação social
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function authenticateWithSocialMedia(accessToken, refreshToken, profile, done) {
      try {
        // Verificar se o usuário já existe no banco de dados com base no e-mail
        const existingUser = await User.findOne({ email: profile.emails[0].value });
    
        if (existingUser) {
          // Usuário já existe, retornar o usuário existente
          return done(null, existingUser);
        }
    
        // Se o usuário não existe, criar um novo usuário no banco de dados
        const newUser = new User({
          name: profile.displayName || profile.username,
          email: profile.emails[0].value,
          // Outros campos que você deseja armazenar no modelo de usuário
        });
    
        // Salvar o novo usuário no banco de dados
        await newUser.save();
    
        // Retornar o novo usuário
        return done(null, newUser);
      } catch (error) {
        // Lidar com erros, log ou passar para o middleware de erro
        return done(error, null);
      }
    }
  )
);
// Configurar a estratégia do Facebook para autenticação social
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      // Lógica para criar ou recuperar usuário no banco de dados
      // ...

      return done(null, user);
    }
  )
);

// Rota para iniciar o processo de autenticação com o Google

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback para autenticação com o Google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Redirecionar ou enviar resposta JSON de sucesso
    res.redirect("/dashboard");
  }
);

// Rota para iniciar o processo de autenticação com o Facebook
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);

// Callback para autenticação com o Facebook
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  function (req, res) {
    // Redirecionar ou enviar resposta JSON de sucesso
    res.redirect("/dashboard");
  }
);

// Rota para criar usuário local

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

  const checkPassword = bcrypt.compare(password, user.password);

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
