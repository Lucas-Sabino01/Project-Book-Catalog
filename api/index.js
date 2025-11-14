const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('API Vibe Coders está online!');
});

app.listen(port, () => {
  console.log(`[servidor]: API rodando em http://localhost:${port}`);
});