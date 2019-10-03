const express = require('express');
const fs = require('fs');
const path = require('path');
const port = 5500;
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get ('/', (req, res) => {
  console.log(`URL: ${req.url}`);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  
  res.end();
});

app.listen(port);

console.log('Server started');
