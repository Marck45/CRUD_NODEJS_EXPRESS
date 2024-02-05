const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const passport = require("passport");

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


// Rotas da API
const personRoutes = require("./routes/pesonRoutes.js");
app.use("/produto", personRoutes);

const customerRoutes = require("./routes/customersRoutes.js");
app.use("/users", customerRoutes);

const supplierRoutes = require("./routes/supplierRoutes.js");
app.use("/supplier", supplierRoutes);

const expensesRoutes = require("./routes/expensesRoutes.js");
app.use("/expenses", expensesRoutes);

const salesRoutes = require("./routes/salesRoutes.js");
app.use("/sales", salesRoutes);

const companyRoutes = require("./routes/companyRoutes.js");
app.use("/company", companyRoutes);

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
