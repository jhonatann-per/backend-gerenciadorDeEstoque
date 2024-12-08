const Sequelize = require('sequelize');
const db = require('./db');

const Produto = db.define('produtos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco_compra: {
        type: Sequelize.DOUBLE,
    },
    preco_venda: {
        type: Sequelize.DOUBLE,
    },
    quantidade: {
        type: Sequelize.INTEGER
    }
});


// Produto.sync();

module.exports = Produto;
