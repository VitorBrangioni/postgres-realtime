
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const Socket = require('../services/Socket');
const DatabaseListener = require('../services/DatabaseListener');
const Service = require('../models/Service');

app.use(express.static(path.join(__dirname, '../../public')));
app.set('views', path.join(__dirname, '../../public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/public', (req, res) => {
  res.render('index.html');
});

const socket = new Socket(server);
const databaseChanges = new DatabaseListener();

const servicesDto = {
  servicesInProgress: [],
  servicesPendding: [],
  servicesScheduled: []
};

const servicesMapToStatus = {
  1: 'servicesScheduled',
  2: 'servicesPendding',
  3: 'servicesInProgress'
};


( async () => {

  const servicesFound = await Service.findAll();
  console.log('servicesFound' , servicesFound);


  servicesFound.map(service => {
    switch (service.status_id) {
      case '1': 
      servicesDto.servicesScheduled.push(service);
        break;

      case '2': 
      servicesDto.servicesPendding.push(service);
        break;

      case '3': 
      servicesDto.servicesInProgress.push(service);
        break;
    }
  });

  socket.onConnection((_socket) => {
    console.log(`_socket conn `, _socket.id);
    socket.sendToAllSubscribers('receivedMessage', servicesDto);
  })
  
})();

const managementState = (oldRecord, newRecord) => {
  const oldService = servicesMapToStatus[oldRecord.status_id];
  const newService = servicesMapToStatus[newRecord.status_id];

  servicesDto[oldService] = servicesDto[oldService].filter(_service => (_service.id != oldRecord.id));
  servicesDto[newService].push(e.newRecord);
}

databaseChanges.onUpdate((e) => {
  managementState(e.old_record, e.record);
  socket.sendToAllSubscribers('receivedMessage', servicesDto);
}, 'public:service:status_id=eq.1');

databaseChanges.onUpdate((e) => {
  managementState(e.old_record, e.record);
  socket.sendToAllSubscribers('receivedMessage', servicesDto);
}, 'public:service:status_id=eq.2');

databaseChanges.onUpdate((e) => {
  managementState(e.old_record, e.record);
  socket.sendToAllSubscribers('receivedMessage', servicesDto);
}, 'public:service:status_id=eq.3');

server.listen(8181);