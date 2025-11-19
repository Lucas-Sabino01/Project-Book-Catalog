const db = require("../database.js");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor ao buscar usuários." });
  }
};

exports.getById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const user = await User.findByPk(id);

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
  const id = parseInt(req.params.id);
  const { username, password, role } = req.body;

  const updateData = {};
  if (username) updateData.username = username;
  if (role) updateData.role = role;

  try {
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const [rowsUpdated] = await User.update(updateData, { where: { id } });

    if (rowsUpdated > 0) {
      const updatedUser = await User.findByPk(id);
      const token = jwt.sign(
        {
          id: updatedUser.id,
          username: updatedUser.username,
          role: updatedUser.role,
        },
        SECRET,
        { expiresIn: "1h" }
      );
      res.json({ user: updatedUser, token });
    } else {
      res
        .status(404)
        .json({ message: "Usuário não encontrado para atualização." });
    }
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor ao atualizar usuário." });
  }
};

exports.delete = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const rowsDeleted = await User.destroy({ where: { id } });

    if (rowsDeleted > 0) {
      res.status(204).send();
    } else {
      res
        .status(404)
        .json({ message: "Usuário não encontrado para exclusão." });
    }
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor ao deletar usuário." });
  }
};
