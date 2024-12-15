const jwt = require('jsonwebtoken');
const {promisify} = require('util')
require('dotenv').config();

module.exports = {
    eAdmin: async (req, res, next) => {
        const authHeader = req.headers.authorization;
    
        if (!authHeader) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Necessário realizar o Login para acessar a página!"
            });
        }
    
        const [bearer, token] = authHeader.split(' ');
    
        if (!token || bearer !== 'Bearer') {
            return res.status(400).json({
                erro: true,
                mensagem: "Token inválido!"
            });
        }
    
        try {
            const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
            req.userId = decoded.id;
            next();
        } catch (error) {
            return res.status(403).json({
                erro: true,
                mensagem: "Acesso negado: token inválido!"
            });
        }
    }
    
}