const express = require('express');
const app = express();
const cors = require('cors')
const bcrypt = require('bcryptjs'); 
const Produto = require('./models/Produtos')
const Usuario = require('./models/usuario')
const jwt = require('jsonwebtoken')
const {eAdmin} = require('./middlewares/auth.js')
require('dotenv').config();


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

app.post("/cadastrar", eAdmin, async (req, res) => {
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

app.get("/listar", eAdmin, async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            attributes: ['id', 'nome', 'preco_compra', 'preco_venda', 'quantidade'],
            order: [
                ['id', 'ASC']
            ]
        });

        res.status(200).json({
            userId: req.userId, 
            produtos: produtos
        });
    } catch (error) {
        res.status(400).json({
             mensagem: "Erro: Lista não encontrada" 
        });
    }
});

app.get("/visualizar/:id", eAdmin, async (req, res) => {
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

app.put("/editar-produto", eAdmin, async (req, res) => {
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

app.delete("/deletar-produto/:id", eAdmin, async (req, res) => {
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

app.post("/cadastrar-usuario", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Todos os campos são obrigatórios!"
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        const novoUsuario = await Usuario.create({ 
            nome, 
            email, 
            senha: senhaCriptografada 
        });

        res.status(200).json({
            erro: false,
            mensagem: "Usuário cadastrado com sucesso!",
            usuario: novoUsuario
        });

    } catch (error) {
        res.status(500).json({
            erro: true,
            mensagem: "Erro ao cadastrar usuário: " + error.message
        });
    }
});

app.put("/editar-usuario", eAdmin, async (req, res) => { 
    const { id } = req.body; 
    const dados = req.body;
    
    dados.senha = await bcrypt.hash(String(dados.senha), 8);

    try {
        const [update] = await Usuario.update(dados, { where: { id } });
        if (update) {
            return res.status(200).json({
                erro: false,
                mensagem: "Usuário editado com sucesso!"
            });
        } else {
            return res.status(404).json({
                erro: true,
                mensagem: "Erro: Não foi possível atualizar o usuário!"
            });
        }
    } catch (error) {
        return res.status(500).json({
            erro: true,
            mensagem: "Erro: Não foi possível atualizar o usuário! " + error.message
        });
    }
});

app.delete("/deletar-usuario/:id", eAdmin, async (req, res) => {
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

app.get("/listar-usuarios", eAdmin, async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'nome', 'email', 'data_criacao'],
            order: [
                ['id', 'ASC']
            ]
        });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
            error: true,
            mensagem: "Erro: Usuários não encontrados! " + error.message
        });
    }
});

app.get("/visualizar-usuario/:id", eAdmin, async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            attributes: ['id', 'nome', 'email', 'data_criacao']
        });
        if (usuario) {
            res.status(200).json({
                error: false,
                usuario: usuario
            });
        } else {
            res.status(404).json({
                error: true,
                mensagem: "Erro: Usuário não encontrado."
            });
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            mensagem: "Verifique a conexão com o servidor! " + error.message
        });
    }
});



// ROTA DE LOGIN

app.post('/login', async (req, res) => {
    const {email, senha} = req.body;
    const user = await Usuario.findOne({
        attributes: ['id', 'email', 'senha'],
        where:{ email }
    });

    if(!user){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Email ou senha invalida!"
        })
    };

    if(!(await bcrypt.compare(req.body.senha, user.senha))) {
        return res.status(401).json({
            erro: true,
            mensagem: "Erro: Email ou senha invalida!"
        })
    };

    const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {
        expiresIn: '7d'
    })

    return res.status(200).json({
        erro: false,
        mensagem: "login bem sucedido!",
        token: token
    })

});


app.listen(8080, () =>{
    console.log("servidor iniciado na porta: http://localhost:8080")
});