
module.exports = (sequelize, DataTypes) => {
    
    const User = sequelize.define(
        'User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            tableName: 'Users', 
        }
    );

    User.associate = (models) => {
        User.hasMany(models.Book, { 
            foreignKey: 'userOwnerId', 
            as: 'booksOwned' 
        });
    };

    return User; 
};