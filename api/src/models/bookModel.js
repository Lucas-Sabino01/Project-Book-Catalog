const { DataTypes } = require('sequelize')
const { sequelize } = require('../database.js')

const Book = sequelize.define(
    'Book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userOwnerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}
)