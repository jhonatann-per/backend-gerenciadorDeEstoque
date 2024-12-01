const express = require('express');
const app = express();
app.use(express.json()); // para receber informações do insominia no formato JSON

const Produto = require('./models/Produtos')

app.get("/", async (req, res)=> {
    res.send("Bem vindo! ao projeto")
});

app.post("/cadastrar", async (req, res)=> {
    console.log(req.body)
    res.send("Produto Cadastrado com Sucesso")
});

app.listen(8080, () =>{
    console.log("servidor iniciado na porta: http://localhost:8080")
});