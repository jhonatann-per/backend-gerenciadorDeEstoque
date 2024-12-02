const express = require('express');
const app = express();
app.use(express.json()); // para receber informações do insominia no formato JSON

const Produto = require('./models/Produtos')

app.get("/", async (req, res)=> {
    res.send("Bem vindo! ao projeto")
});

app.post("/cadastrar", async (req, res) => {
    try {
        const { nome, preco_venda, quantidade } = req.body;
        const novoProduto = await Produto.create({
            nome, preco_venda, quantidade
        });
        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
            produto: novoProduto
        });
    } catch {
        res.status(400).json({ mensagem: 'Erro: Produto Não Cadastrar!' });
    }
});

app.get("/listar", async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            attributes: ['nome', 'preco_venda', 'quantidade' ],
            order: [ ['nome', 'ASC'], ['preco_venda', 'ASC'], ['quantidade', 'ASC'] ]
        });
        res.status(201).json(produtos);
    } catch {
        res.status(400).json({ mensagem: "Erro: Lista não encontrada" });
    }
});

app.get("/visualizar/:id", async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id, {
            attributes: ['nome', 'preco_venda', 'quantidade']
        });
        if (produto) {
            res.status(200).json(produto);
        } else {
            res.status(404).json({ mensagem: "Produto não encontrado" });
        }
    } catch (error) {
        res.status(400).json({ mensagem: "Erro: Não foi possível visualizar o produto" });
    }
});


app.listen(8080, () =>{
    console.log("servidor iniciado na porta: http://localhost:8080")
});