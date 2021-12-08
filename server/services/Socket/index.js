const socket = require('socket.io');

class Socket {

  io = null;

  constructor(server) {
    this.io = socket(server);
  }

  getIo() {
   return this.io; 
  }

  onConnection(callback) {
    console.log(`Connected socket ${socket.id}`);

    this.io.on('connection', (socket) => {
      callback(socket);
    });
  }

  sendToAllSubscribers(eventName, data) {
    this.io.emit(eventName, data);
  }

}

module.exports = Socket;