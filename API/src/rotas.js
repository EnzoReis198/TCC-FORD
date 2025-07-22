const express = require("express");
const serverless = require("serverless-http"); // Adicione isso
const rota = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const login = require("./controllers/login");
const validarLogin = require("./intermediarios/validarLogin");
const { listarVeiculos, listarVeiculoID } = require("./controllers/veicles");

rota.use(express.json());
rota.use(cors());

rota.post('/login', login);
rota.get('/vehicles', listarVeiculos);  // Corrigido para "vehicles"
rota.get('/vehicles/:id', listarVeiculoID);  // Corrigido para "vehicles"

// Exporte a função serverless
module.exports.handler = serverless(rota);  // Isso vai exportar a função Express para ser executada na Vercel
module.exports.app = rota;  // Exporta o app para uso local ou testes