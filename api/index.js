const express = require('express');
const app = express();
const { sequelize } = require('./src/database')

require("dotenv").config()

async function syncDatabase() {
  console.log("Sincronizando modelos da base de dados.")
  try {
    await sequelize.sync()
    console.log("Modelos sincronizados com sucesso!")
  } catch (error) {
    console.error("Erro ao sincronizar modelos: " + error)
  }
}

if (process.env.NODE_ENV !== 'test') {
  syncDatabase();
}



module.exports = app
