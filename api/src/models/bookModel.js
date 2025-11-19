
module.exports = (sequelize, DataTypes) => {
    
    const Book = sequelize.define(
        'Book', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: { type: DataTypes.STRING, allowNull: false, },
            author: { type: DataTypes.STRING, allowNull: false, },
            pages: { type: DataTypes.INTEGER, allowNull: false, },
            userOwnerId: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            tableName: 'Books',
        }
    );

    Book.associate = (models) => {
        Book.belongsTo(models.User, { foreignKey: 'userOwnerId', as: 'owner' });
    };

    return Book; 
};