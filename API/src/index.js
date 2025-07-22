const express = require("express");
const app = express()
const cors = require("cors");
const rota = require("./rotas");



app.use(cors())
// app.use(bodyParser.json());
app.use(express.json()); 
app.use(rota);


app.listen(3000, () =>{
    console.log("Api rodando em: http:localhost:3000/")
})