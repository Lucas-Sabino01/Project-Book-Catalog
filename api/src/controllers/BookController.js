const db = require("../database.js");

const Book = db.Book;

const handleError = (res, error, status = 500) => {
    console.error("erro interno no servidor:", error.message);
    res.status(status).send({ 
        message: "Erro interno no servidor."
    });
};

exports.create = async (req, res) => {
    try {
        const { title, author, pages, userOwnerId } = req.body;
        if (!title || !author) {
            return handleError(res, new Error("Título e Autor são campos obrigatórios."), 400);
        }
        const newBook = { 
            title,
            author,
            pages,
            userOwnerId: userOwnerId };
        const book = await Book.create(newBook);
        res.status(201).send(book); 
    } catch (error) {
        handleError(res, error, 400);
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;

    try {
        const [num] = await Book.update(req.body, {
            where: { id: id }
        });
        if (num === 1) {
            res.send({ message: "Livro atualizado com sucesso." });
        } else {
            handleError(res, new Error(`Não foi possível atualizar Livro com id=${id}. Livro não encontrado ou dados não fornecidos.`), 404);
        }
    } catch (error) {
        handleError(res, error);
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        const num = await Book.destroy({
            where: { id: id }
        });
        if (num === 1) {
            res.send({ message: "Livro deletado com sucesso!" });
        } else {
            handleError(res, new Error(`Não foi possível deletar Livro com id=${id}. Livro não encontrado.`), 404);
        }
    } catch (error) {
        handleError(res, error);
    }
};

exports.findAll = async (req, res) => {
    try {
        const books = await Book.findAll(); res.send(books);
    } catch (error) { handleError(res, error); }
};
exports.findOne = async (req, res) => {
    const id = req.params.id;
    try {
        const book = await Book.findByPk(id);
        if (book) { res.send(book); }
        else { handleError(res, new Error(`Livro com id=${id} não encontrado.`), 404); }
    } catch (error) { handleError(res, error); }
};

