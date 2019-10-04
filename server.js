const express = require('express');
const fs = require('fs');
const path = require('path');
const port = 5500;
const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

//db.defaults({ users: {}}).write();

app.use(express.static(path.join(__dirname, 'public')));

app.get ('/', (req, res) => {
  console.log(`URL: ${req.url}`);
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  
  res.end();
});

app.get ('/users/:userId/:reqId', (req, res) => {
  console.log(`URL: ${req.url}`);
  const userId = req.params.userId;
  const reqId = req.params.reqId;
  res.send(db.get(`users.${userId}`).value());
  res.end();
});

app.listen(port);

console.log('Server started');


// db.set('users.alise_mkr', {
//     id:'alise_mkr',
//     userName:'alise_mkr',
//     images: [],})
//   .write();

// db.get('users.alise_mkr.images')
// .push('1489853_935xp.jpg',
//   '1489855_935xp.jpg',
//   '59423666_180019409583672_5264310437239128295_n.jpg',
//   '69290544_122373092470961_8341487923827637601_n.jpg',
//   '69451576_658500621312724_8710632280197142134_n.jpg',
//   '70519833_1355004741325369_660144970400287339_n.jpg')
// .write();