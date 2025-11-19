const db = require("../database.js");

const Book = db.Book;
const { Sequelize } = require("sequelize");

const handleError = (res, error, status = 500) => {
  console.error("erro interno no servidor:", error.message);
  res.status(status).send({
    message: "Erro interno no servidor.",
  });
};

exports.create = async (req, res) => {
  try {
    const { title, author, pages, publication_year, genre } = req.body;
    if (!title || !author) {
      return handleError(
        res,
        new Error("Título e Autor são campos obrigatórios."),
        400
      );
    }
    const newBook = {
      title,
      author,
      pages: pages,
      publication_year: publication_year,
      genre: genre,
      userOwnerId: req.user.id,
    };
    const book = await Book.create(newBook);
    res.status(201).send(book);
  } catch (error) {
    handleError(res, error, 400);
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const { title, author, pages, publication_year, genre } = req.body;

  const updateData = {};
  if (title) updateData.title = title;
  if (author) updateData.author = author;
  if (pages) updateData.pages = pages;
  if (publication_year) updateData.publication_year = publication_year;
  if (genre) updateData.genre = genre;

  try {
    const [num] = await Book.update(updateData, {
      where: { id: id },
    });
    if (num === 1) {
      res.send({ message: "Livro atualizado com sucesso." });
    } else {
      handleError(
        res,
        new Error(
          `Não foi possível atualizar Livro com id=${id}. Livro não encontrado ou dados não fornecidos.`
        ),
        404
      );
    }
  } catch (error) {
    handleError(res, error);
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const num = await Book.destroy({
      where: { id: id },
    });
    if (num === 1) {
      res.send({ message: "Livro deletado com sucesso!" });
    } else {
      handleError(
        res,
        new Error(
          `Não foi possível deletar Livro com id=${id}. Livro não encontrado.`
        ),
        404
      );
    }
  } catch (error) {
    handleError(res, error);
  }
};

exports.findAll = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.send(books);
  } catch (error) {
    handleError(res, error);
  }
};
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const book = await Book.findByPk(id);
    if (book) {
      res.send(book);
    } else {
      handleError(res, new Error(`Livro com id=${id} não encontrado.`), 404);
    }
  } catch (error) {
    handleError(res, error);
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalBooks = await Book.count();

    const totalAuthors = await Book.count({
      distinct: true,
      col: "author",
    });

    const totalGenres = await Book.count({
      distinct: true,
      col: "genre",
    });

    res.status(200).json({
      totalBooks,
      totalAuthors,
      totalGenres,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro no servidor ao buscar estatísticas." });
  }
};

exports.getAuthors = async (req, res) => {
  try {
    const authors = await Book.findAll({
      attributes: [
        'author',
        [Sequelize.fn('COUNT', Sequelize.col('author')), 'bookCount']
      ],
      group: ['author'],
      order: [[Sequelize.fn('COUNT', Sequelize.col('author')), 'DESC']]
    });

    res.status(200).json(authors);
  } catch (error) {
    handleError(res, error);
  }
};
