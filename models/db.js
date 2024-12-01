const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gerenciador', 'root', 'Zed152zed.',{
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
.then(()=>{
    console.log("Conexão Realizada Com Sucesso!")
}).catch(()=>{
    console.log("Error: Falha De Conexão Com O Banco De Dados!")
})

module.exports = sequelize;