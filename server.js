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
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.url == '/registerNewUser' && !JSON.parse(db.has(`users.${loginToId(req.body.registerLogin)}`))){
      fs.mkdirSync(`./public/users/${loginToId(req.body.registerLogin)}`);
      fs.mkdirSync(`./public/users/${loginToId(req.body.registerLogin)}/img`);
      cb(null, `./public/users/${loginToId(req.body.registerLogin)}`);
    } else if (req.url == '/addNewImage'){
      db.get(`users.${req.body.idUI}.images`).push(`${file.originalname}.jpeg`).write();
      cb(null, `./public/users/${req.body.idUI}/img`);
    }
  },
  filename: function (req, file, cb) {
    if (req.url == '/registerNewUser' && !JSON.parse(db.has(`users.${loginToId(req.body.registerLogin)}`))){
      cb(null, "user.png");
    } else if (req.url == '/addNewImage'){
      cb(null, file.originalname + '.jpeg');
    }
  }
});
let upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

function giveUsers () {
  return db.get(`users`).value();
}

function giveOneUser () {
  return db.get(`users.${userId}`).value();
}

function giveToken (user) {
  return db.get(`tokens.${user}`).value();
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

function loginUser (login, password) {
  const hash = db.get(`authenticationData.${loginToId(login)}.password`).value();
  return bcrypt.compareSync(password,  hash);
}

function addNewUser (login, password, name, info = '', userIcon) {
  console.log(userIcon);
  if (!JSON.parse(db.has(`users.${loginToId(login)}`))) {
    const hash = bcrypt.hashSync(password, saltRounds);
    db.set(`users.${loginToId(login)}`, {
          id: loginToId(login),
          userName: name,
          userIcon: `../../users/${loginToId(login)}/user.png`,
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
      let userToken = jwt.sign({ login: `${loginToId(req.body.registerLogin)}` }, 'secretKey');
      db.set(`tokens.${loginToId(req.body.registerLogin)}`, {
          id: loginToId(req.body.registerLogin),
          token: userToken,})
        .write();
      res.send (giveToken (loginToId(req.body.registerLogin)));
      res.end();

    } else {
      res.end('false');
    }
    
});

app.post ('/loginUser', upload.none(), (req, res) => {
  console.log(`URL: ${req.url}`);
  if (loginUser(req.body.signInLogin, req.body.signInPassword)) {
    let userToken = jwt.sign({ login: `${loginToId(req.body.signInLogin)}` }, 'secretKey');
    db.set(`tokens.${loginToId(req.body.signInLogin)}`, {
        id: loginToId(req.body.signInLogin),
        token: userToken,})
      .write();
    res.send (giveToken (loginToId(req.body.signInLogin)));
    res.end();
    
  } else {
    res.end(false);
  } 
});

app.post ('/addNewImage', upload.single('NewImg'), (req, res) => {
  res.end('true'); 
});

app.get ('/logout/:userId', (req, res) => {
  console.log(`URL: ${req.url}`);
  logoutId = req.params.userId;
  db.set(`tokens.${logoutId}`, {}).write();
  res.end();
});

app.listen(port);

console.log('Server started');

