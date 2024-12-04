const express = require('express');
const app = express();
const cors = require('cors')
const Produto = require('./models/Produtos')

app.use(express.json());
app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE" );
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization" );
    app.use(cors());
    next();
});


app.get("/", async (req, res)=> {
    res.send("Bem vindo! ao projeto")
});

app.post("/cadastrar", async (req, res) => {
    try {
        const { nome, preco_venda, quantidade } = req.body;
        const novoProduto = await Produto.create({
            nome, preco_venda, quantidade
        });
        res.status(200).json({
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
            attributes: ['id', 'nome', 'preco_venda', 'quantidade'],
            order: [
                ['id', 'ASC']
            ]
        });
        res.status(201).json(produtos);
    } catch (error) {
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
            res.status(400).json({ mensagem: "Produto não encontrado" });
        }
    } catch (error) {
        res.status(405).json({ mensagem: "Erro: Não foi possível visualizar o produto" });
    }
});

app.put("/editar-produto", async (req, res) => {
    const { id } = req.body;

    const [updated] = await Produto.update(req.body, { where: { id } });
    if (updated) {
        return res.status(200).json({ erro: false, mensagem: "Produto editado com sucesso!" });
    } else {
        return res.status(404).json({ erro: true, mensagem: "Erro: Produto não encontrado ou não editado" });
    }
});


app.delete("/deletar-produto/:id", async (req, res) => {
    const { id } = req.params;

    const resultado = await Produto.destroy({ where: { id } });

    if (resultado) {
        return res.status(200).json({ erro: false, mensagem: "Produto apagado com sucesso!" });
    } else {
        return res.status(404).json({ erro: true, mensagem: "Erro: Produto não encontrado ou não apagado" });
    }
});



app.listen(8080, () =>{
    console.log("servidor iniciado na porta: http://localhost:8080")
});