const express = require('express');
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const port = 5500;
const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

let upload = multer({ dest: "./upload/" });

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));


function giveUsers () {
  return db.get(`users`).value();
}

function giveOneUser () {
  return db.get(`users.${userId}`).value();
}

app.get ('/loadUsers', (req, res) => {
  res.send(giveUsers ());
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
  res.send(giveOneUser ());
  res.end();
});

app.post ('/registerNewUser', upload.array(), (req, res) => {
  console.log(req.body.registerLogin);
  res.end();
});

app.listen(port);

console.log('Server started');

