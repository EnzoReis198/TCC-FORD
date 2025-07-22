const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http'); // Adiciona a biblioteca serverless-http
const rota = require('./src/rotas'); // Suas rotas externas (se necessário)

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(rota);

// Função serverless exportada
module.exports.handler = serverless(app); // Aqui estamos exportando a função serverless
module.exports.app = app; // Exporta o app para uso local ou testes