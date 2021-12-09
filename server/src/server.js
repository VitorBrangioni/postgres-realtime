
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const Socket = require('../services/Socket');
const ServiceController = require('../controllers/ServiceController');

app.use(express.static(path.join(__dirname, '../../public')));
app.set('views', path.join(__dirname, '../../public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/public', (req, res) => {
  res.render('index.html');
});

(async () => {
  const socket = new Socket(server);

  ServiceController.fetchServicesFromDatabaseAndSend(socket);
  ServiceController.listenAndSendServicesStatus(socket);
})();


server.listen(8181);