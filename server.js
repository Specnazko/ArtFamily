const express = require('express');
const fs = require('fs');
const path = require('path');
const port = 5500;
const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);


app.use(express.static(path.join(__dirname, 'public')));

app.get ('/', (req, res) => {
  console.log(`URL: ${req.url}`);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  
  res.end();
});

let userId;

app.get ('/userClick/:userId', (req, res) => {
  console.log(`URL: ${req.url}`);
  userId = req.params.userId;
  res.end();
});

app.get ('/users/:reqId', (req, res) => {
  console.log(`URL: ${req.url}`);
  const reqId = req.params.reqId;
  res.send(db.get(`users.${userId}`).value());
  res.end();
});


app.listen(port);

console.log('Server started');

