const express = require("express")
const rota = express()
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const login = require("./controllers/login");
const validarLogin = require("./intermediarios/validarLogin");
const { listarVeiculos, listarVeiculoID } = require("./controllers/veicles");



rota.use(express.json()); 

rota.use(cors())
// rota.use(bodyParser.json());

rota.post('/login', login);
rota.get('/veicles', listarVeiculos);
rota.get('/veicles/:id', listarVeiculoID);


module.exports = rota
