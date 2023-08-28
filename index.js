// configuração incial
const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require('body-parser'); // Importe o body-parser
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:4200",
  exposedHeaders: ["x-access-token"],
};

// Use o body-parser para aumentar o limite de tamanho da carga útil
app.use(bodyParser.json({ limit: '50mb' })); // Defina o limite como desejado (50 MB neste exemplo)

// forma de ler o JSON - middlewares

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();

  app.use(cors(corsOptions));

  express.urlencoded({
    extended: true,
  });
});


app.use(express.json());

// rotas da API

const personRoutes = require("./routes/pesonRoutes.js");

app.use("/produto", personRoutes);

// rota incial endpoint

app.get("/", (req, res) => {
  // mostrar req

  res.json({ message: "oi Express!" });
});

// porta para express
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster45.nw9hcqc.mongodb.net/bancodaapi?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("conectado com sucesso ao MongoDB");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
