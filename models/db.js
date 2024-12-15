const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

sequelize.authenticate()
.then(() => {
    console.log("Conexão com o banco de dados realizada com sucesso!");
}).catch((error) => {
    console.log("Erro: Falha de conexão com o banco de dados!");
    console.error(error);
});

module.exports = sequelize;
