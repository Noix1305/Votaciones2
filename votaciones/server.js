const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'dist/votaciones')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/votaciones/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
