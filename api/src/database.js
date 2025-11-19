const sqlite3 = require('sqlite3').verbose()
const { Sequelize, DataTypes } = require('sequelize')
const DBSOURCE = "database.db"

const sequelize = new Sequelize({
    'dialect': 'sqlite',
    'storage': 'database.db',
    'logging': process.env.NODE_ENV === 'test' ? false : console.log 
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./models/userModel')(sequelize, DataTypes); 
db.Book = require('./models/bookModel')(sequelize, DataTypes);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

sequelize.sync({force: false});

module.exports = db;
