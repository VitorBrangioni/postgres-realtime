
const { RealtimeClient } = require('@supabase/realtime-js');
const socket = new RealtimeClient(process.env.REALTIME_URL || 'ws://localhost:4000/socket')
socket.connect();

socket.onOpen(() => console.log('Socket opened.'))
socket.onClose(() => console.log('Socket closed.'))
socket.onError((e) => console.log('Socket error', e.message))

const databaseChanges = socket.channel('realtime:*');

databaseChanges.on('*', (e) => console.log('ALL', e))
databaseChanges.on('INSERT', (e) => console.log('INSERT', e))
databaseChanges.on('UPDATE', (e) => console.log('UPDATE', e))
databaseChanges.on('DELETE', (e) => console.log('DELETE', e))
databaseChanges.subscribe()


// TODO
// socket to find all services by status and should display in front



































