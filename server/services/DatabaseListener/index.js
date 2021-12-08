const { RealtimeClient } = require('@supabase/realtime-js');

class DatabaseListener {

  socket = new RealtimeClient(process.env.REALTIME_URL || 'ws://localhost:4000/socket');

  constructor() {
    this.socket.connect();

    this.socket.onOpen(() => console.log('Socket opened.'));
    this.socket.onClose(() => console.log('Socket closed.'));
    this.socket.onError((e) => console.log('Socket error', e.message));
  }

  _on(eventName, callback, channel = '*') {
    const databaseChanges = this.socket.channel(`realtime:${channel}`);

    databaseChanges.on(eventName, (e) => callback(e));
    databaseChanges.subscribe();
  }

  onAll(callback, channel = '*') {
    this._on('*', callback, channel);
  }

  onUpdate(callback, channel = '*') {
    this._on('UPDATE', callback, channel);
  }

  onInsert(callback, channel = '*') {
    this._on('INSERT', callback, channel);
  }

  onDelete(callback, channel = '*') {
    this._on('DELETE', callback, channel);
  }
}

module.exports = DatabaseListener;