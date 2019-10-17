const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require ('bcrypt');
const saltRounds = 10;    
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const port = 5500;
const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.url == '/registerNewUser' && !JSON.parse(db.has(`users.${loginToId(req.body.registerLogin)}`))){
      fs.mkdirSync(`./public/users/${loginToId(req.body.registerLogin)}`);
      fs.mkdirSync(`./public/users/${loginToId(req.body.registerLogin)}/img`);
      cb(null, `./public/users/${loginToId(req.body.registerLogin)}`);
    }
    
  },
  filename: function (req, file, cb) {
    if (req.url == '/registerNewUser' && !JSON.parse(db.has(`users.${loginToId(req.body.registerLogin)}`))){
    cb(null, "user.png");
    }
  }
});
let upload = multer({ storage: storage });

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

function loginToId (login) {
  let id = '';
  for (let i=0; i<login.length; i++) {
    if (login[i] == ' ') {
      id += '_';
    } else {
      id += login[i].toLowerCase();
    }
  }
  return id;
}

function addNewUser (login, password, name, info = '', userIcon) {
  console.log(userIcon);
  if (!JSON.parse(db.has(`users.${loginToId(login)}`))) {
    const hash = bcrypt.hashSync(password, saltRounds);
    db.set(`users.${loginToId(login)}`, {
          id: loginToId(login),
          userName: name,
          userIcon: '../../img/user.svg',
          userInfo: info,
          images: [],})
        .write();
    db.set(`authenticationData.${loginToId(login)}`, {
      login: login,
      password: hash,})
    .write();
    return true;
  } else {
    return false;
  }
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

app.post ('/registerNewUser', upload.single('userIcon'), (req, res) => {
  if (addNewUser(req.body.registerLogin, 
    req.body.registerPassword, 
    req.body.registerName, 
    req.body.userInfo, req.file)
  ) {
      res.end('true');

    } else {
      res.end('false');
    }
    
});

app.listen(port);

console.log('Server started');

