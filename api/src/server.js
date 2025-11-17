const express = require('express');
const app = express();
const port = 3001;
require("dotenv").config()

app.use(express.json())

const userRoutes = require('./routes/userRoutes.js');

app.use('/api', userRoutes);
app.get('/api', (req, res) => {
  res.send('API Vibe Coders está online!');
});

app.listen(port, () => {
  console.log(`[servidor]: API rodando em http://localhost:${port}/api`);
});
