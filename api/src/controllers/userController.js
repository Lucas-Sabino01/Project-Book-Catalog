const User = require("../models/userModel.js")
const bcrypt = require("bcryptjs")

exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll()
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor ao buscar usuários." });
    }
};

exports.getById = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const user = await User.findByPk(id)

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "Usuário não encontrado." });
        }
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor ao buscar o usuário." });
    }
};

exports.update = async (req, res) => {
    const id = parseInt(req.params.id)
    const { username, password, role } = req.body

    if (!username || !password || role === undefined)
        return res.status(400).json({ message: "Username, senha e cargo são obrigatórios." })

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const [rowsUpdated] = await User.update(
            { username, password: hashedPassword, role },
            { where: { id } }
        )

        if (rowsUpdated > 0) {
            res.json({ id, username, role })
        } else {
            res.status(404).json({ message: "Usuário não encontrado para atualização." })
        }
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor ao atualizar usuário." })
    }
}

exports.delete = async (req, res) => {
    const id = parseInt(req.params.id)

    try {
        const rowsDeleted = await User.destroy({ where: { id } })

        if (rowsDeleted > 0) {
            res.status(204).send()
        } else {
            res.status(404).json({ message: "Usuário não encontrado para exclusão." })
        }
    } catch (err) {
        res.status(500).json({ message: "Erro no servidor ao deletar usuário." })
    }
}
