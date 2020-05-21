const express = require('express');

const server = express();

server.use(express.json());

const USERS = ['Alexandre', 'Camila', 'Terezinha'];

server.use((req, res, next) => {
  console.time('request');
  console.log(`${req.method} ${req.url}`);
  next();
  console.timeEnd('request');
});

function checkUserExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ messege: 'Required name' });
  }
  next();
}

function checkUserInArray(req, res, next) {
  const { index } = req.params;
  const user = USERS[index];

  if (!user) {
    return res.status(400).json({ messege: 'User not exist' });
  }

  req.user = user;
  next();
}

server.get('/users', (req, res) => {
  return res.json(USERS);
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post('/users', checkUserExist, (req, res) => {
  USERS.push(req.body.name);
  return res.json(USERS);
});

server.put('/users/:index', checkUserInArray, checkUserExist, (req, res) => {
  const { name } = req.body;
  const index = req.params.index;
  USERS[index] = name;

  return res.json(USERS);
});

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  USERS.splice(index, 1);
  return res.send();
});

server.listen(3000);
