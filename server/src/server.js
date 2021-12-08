
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const Socket = require('../services/Socket');
const DatabaseListener = require('../services/DatabaseListener');

app.use(express.static(path.join(__dirname, '../../public')));
app.set('views', path.join(__dirname, '../../public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/public', (req, res) => {
  res.render('index.html');
});

const socket = new Socket(server);
const databaseChanges = new DatabaseListener();

const servicesCanceled = []; // 4
const servicesConcluded = []; // 3
const servicesInProgress = []; // 2
const servicesPendding = []; // 1

databaseChanges.onUpdate((e) => {
  socket.sendToAllSubscribers('receivedMessage', e);
}, 'public:service:status_id=eq.1');

server.listen(8181);