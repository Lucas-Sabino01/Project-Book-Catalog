const sqlite3 = require('sqlite3').verbose()
const { Sequelize } = require('sequelize')
const DBSOURCE = "database.db"

const sequelize = new Sequelize({
    'dialect': 'sqlite',
    'storage': 'database.db',
    'logging': process.env.NODE_ENV === 'test' ? false : console.log 
})

sequelize.sync()

module.exports = { sequelize }
