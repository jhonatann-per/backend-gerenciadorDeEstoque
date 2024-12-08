const Sequelize = require('sequelize');
const db = require('./db')

const Usuario = db.define('usuarios', {
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
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_criacao: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});

// Usuario.sync({ force: true })

module.exports = Usuario;
