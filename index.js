const express = require("express");
const jwt = require('express-jwt');
const jwksRsa = require("jwks-rsa");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:4200",
  exposedHeaders: ["x-access-token"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração do Middleware de Autenticação do Auth0
const authConfig = {
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
};

const checkJwt = jwt({
  // Faz a verificação do token de acesso usando o JWKS da sua aplicação no Auth0
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  // Valida o token de acesso
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"]
});

// Extrair Informações do Token
app.use((req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    // Aqui você pode extrair informações relevantes do token, como o ID do usuário ou ID do tenant
    req.userId = decodedToken.sub; // Exemplo de extração do ID do usuário
    req.tenantId = decodedToken.tenantId; // Exemplo de extração do ID do tenant
  }
  next();
});

// Rotas da API
const personRoutes = require("./routes/personRoutes.js");
const customerRoutes = require("./routes/customersRoutes.js");
const supplierRoutes = require("./routes/supplierRoutes.js");
const expensesRoutes = require("./routes/expensesRoutes.js");
const salesRoutes = require("./routes/salesRoutes.js");
const companyRoutes = require("./routes/companyRoutes.js");

app.use("/:tenantId/produto", checkJwt, personRoutes); // Protegido com autenticação do Auth0
app.use("/:tenantId/users", checkJwt, customerRoutes); // Protegido com autenticação do Auth0
app.use("/:tenantId/supplier", checkJwt, supplierRoutes); // Protegido com autenticação do Auth0
app.use("/:tenantId/expenses", checkJwt, expensesRoutes); // Protegido com autenticação do Auth0
app.use("/:tenantId/sales", checkJwt, salesRoutes); // Protegido com autenticação do Auth0
app.use("/:tenantId/company", checkJwt, companyRoutes); // Protegido com autenticação do Auth0

// Rota inicial
app.get("/", (req, res) => {
  res.json({ message: "Oi Express!" });
});

// Conectar ao MongoDB e iniciar o servidor
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);

mongoose
  .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster45.nw9hcqc.mongodb.net/bancodaapi?retryWrites=true&w=majority`)
  .then(() => {
    console.log("Conectado com sucesso ao MongoDB");
    app.listen(port, () => {
      console.log(`Servidor está rodando em http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));
