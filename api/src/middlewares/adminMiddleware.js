const db = require("../database.js");
const User = db.User;

exports.isAdmin = async (req, res, next) => {
    const userId = req.user.id;

    try {
    const user = await User.findByPk(userId);

    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).send({ message: "Acesso negado. Requer permissão de administrador." });
    }
    } catch (error) {
    res.status(500).send({ message: "Erro ao verificar permissões do usuário." });
    }
};
