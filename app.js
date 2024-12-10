const express = require('express');
const app = express();
const cors = require('cors')
const Produto = require('./models/Produtos')
const Usuario = require('./models/usuario')

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


// CRUD DE PRODUTOS

app.post("/cadastrar", async (req, res) => {
    try {
        const { nome, preco_venda, quantidade, preco_compra, } = req.body;
        const novoProduto = await Produto.create({
            nome, preco_venda, preco_compra, quantidade
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
            attributes: ['id', 'nome', 'preco_compra', 'preco_venda', 'quantidade'],
            order: [
                ['id', 'ASC']
            ]
        });
        res.status(201).json(produtos);
    } catch (error) {
        res.status(400).json({
             mensagem: "Erro: Lista não encontrada" 
        });
    }
});

app.get("/visualizar/:id", async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id, {
            attributes: ['nome', 'preco_venda', 'preco_compra', 'quantidade']
        });
        if (produto) {
            res.status(200).json(produto);
        } else {
            res.status(400).json({ 
            mensagem: "Produto não encontrado" });
        }
    } catch (error) {
        res.status(405).json({ 
            mensagem: "Erro: Não foi possível visualizar o produto" });
    }
});

app.put("/editar-produto", async (req, res) => {
    const { id } = req.body;

    const [updated] = await Produto.update(req.body, { where: { id } });
    if (updated) {
        return res.status(200).json({ 
            erro: false, 
            mensagem: "Produto editado com sucesso!" });
    } else {
        return res.status(404).json({ 
            erro: true, 
            mensagem: "Erro: Produto não encontrado ou não editado" });
    }
});

app.delete("/deletar-produto/:id", async (req, res) => {
    const { id } = req.params;

    const resultado = await Produto.destroy({ where: { id } });

    if (resultado) {
        return res.status(200).json({ 
            erro: false, 
            mensagem: "Produto apagado com sucesso!" });
    } else {
        return res.status(404).json({ 
            erro: true, 
            mensagem: "Erro: Produto não encontrado ou não apagado" });
    }
});





// CRUD DE USUÁRIOS

app.post("/cadastrar-usuario", async ( req, res ) =>{
    try{
        const { nome, email, senha } = req.body;
        const novoUsuario = await Usuario.create({ 
            nome, email, senha
        });
        res.status(200).json({
            erro: false, 
            mensagem: "Usuários Cadastrado com Sucesso!",
            usuario: novoUsuario
        })
    
    } catch(error) {
        res.status(404).json({
            erro: true,
            mensagem: "Erro ao cadastrar Usuário: " + error.mensagem
        })
    }
});

app.put("/editar-usuario", async (req, res) => { 
    const {id} = req.body;
    const [update] = await Usuario.update(req.body, { where: { id } });
    if(update) {
        return res.status(200).json({
            erro: false,
            mensagem: "Produto Editado com Sucesso!"
        })
    } else{
        return res.status(404).json({
            erro: false,
            mensagem: "Erro: Não Foi Possível Atualizar o Usuario!"
        })
    }
});

app.delete("/deletar-usuario/:id", async (req, res) => {
    const { id } = req.params;
    const apagarUser = await Usuario.destroy({ where: { id } });
    
    if (apagarUser) {
        res.status(200).json({
            error: false,
            mensagem: "Usuário apagado com sucesso!"
        });
    } else {
        res.status(400).json({
            error: true,
            mensagem: "Erro: Usuário não foi apagado!"
        });
    }
});

app.get("/listar-usuarios", async (req,res) =>{
    try{
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nome', 'email', 'data_criacao'],
            order: [
                ['id', 'ASC']
            ]
        
        })
        res.status(200).json(usuarios);
    } catch(error){
        res.status(404).json({
            error: true,
            mensagem: "Error: Usuário não encontrado!"
        })
    }
        
});

app.get("/visualizar-usuario/:id", async (req, res) =>{
    try{
        const usuario = await Usuario.findByPk(req.params.id, { 
            attributes: ['id', 'nome', 'email', 'data_criacao']
             
        });
        if(usuario){
            res.status(200).json({
                error: false,
                usuario: usuario
            })
        } else{
            res.status(404).json({
                error: true,
                mensagem: "Erro: Usuário não encontrado."
            })
        }
    } catch{
        res.status(500).json({
            error: true,
            mensagem: "Verifique a conexão com o servidor!"
        })
    }
})



app.listen(8080, () =>{
    console.log("servidor iniciado na porta: http://localhost:8080")
});