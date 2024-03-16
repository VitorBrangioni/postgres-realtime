const DatabaseListener = require('../../services/DatabaseListener');
const Service = require('../../models/Service');

const helperToServiceMapStatus = {
  1: 'servicesPendding',
  2: 'servicesInProgress',
  3: 'servicesConcluded'
};

class ServiceController {

  static databaseChanges = new DatabaseListener();
  static servicesDto = {
    servicesPendding: [],
    servicesInProgress: [],
    servicesConcluded: []
  };

  constructor() {
    throw new Error('It is not instantiable')
  }

  static async fetchServicesFromDatabaseAndSend(socket) {
    const servicesFound = await Service.findAll();

    servicesFound.map(service => {
      const serviceKey = helperToServiceMapStatus[service.status_id];

      console.log('serviceKey === ', serviceKey);

      ServiceController.servicesDto[serviceKey].push(service);
    });

    socket.onConnection((_socket) => {
      console.log(`Socket connection `, _socket.id);
      socket.sendToAllSubscribers('receivedMessage', ServiceController.servicesDto);
    })
  }

  static listenAndSendServicesStatus(socket) {

      ServiceController.databaseChanges.onUpdate((e) => {
        ServiceController._managementState(e.old_record, e.record);
        socket.sendToAllSubscribers('receivedMessage', ServiceController.servicesDto);
      }, 'public:service:status_id=eq.1');

      ServiceController.databaseChanges.onUpdate((e) => {
        ServiceController._managementState(e.old_record, e.record);
        socket.sendToAllSubscribers('receivedMessage', ServiceController.servicesDto);
      }, 'public:service:status_id=eq.2');

      ServiceController.databaseChanges.onUpdate((e) => {
        ServiceController._managementState(e.old_record, e.record);
        socket.sendToAllSubscribers('receivedMessage', ServiceController.servicesDto);
      }, 'public:service:status_id=eq.3');
    }

  static _managementState(oldRecord, newRecord) {
      const oldService = helperToServiceMapStatus[oldRecord.status_id];
      const newService = helperToServiceMapStatus[newRecord.status_id];

      ServiceController.servicesDto[oldService] = ServiceController.servicesDto[oldService].filter(_service => (_service.id != oldRecord.id));
      ServiceController.servicesDto[newService].push(newRecord);
    }

}

module.exports = ServiceController;