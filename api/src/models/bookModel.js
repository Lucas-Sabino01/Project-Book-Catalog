module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "Book",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING, allowNull: false },
      pages: { type: DataTypes.INTEGER, allowNull: false },
      genre: { type: DataTypes.STRING, allowNull: true },
      userOwnerId: { type: DataTypes.INTEGER, allowNull: false },
      publication_year: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "Books",
    }
  );

  Book.associate = (models) => {
    Book.belongsTo(models.User, { foreignKey: "userOwnerId", as: "owner" });
  };

  return Book;
};
