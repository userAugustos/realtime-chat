const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server); // so here we instance socket.io passing your server, so we can list the connection with sockets from the client

/**
 * io emit event:
 * io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });
 */

app.get('/chatzin/pai', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// let's log it
io.on('connection', (socket) => { // so here we can pass the event (connection) and the listener (socket)
    console.log('connection initiated');
		// of course, exists many events, like the disconnect
		socket.on('disconnect', () => {
      console.log('disconnected');
		});
		// then we can call the event of browser (chat message)
		socket.on('chat message', (data) => { // we receive the data of the event
			console.debug(data);
			// return the message to browser, so others can see it
			socket.broadcast.emit('chat message', data);
		})
})

server.listen(3000, () => {
    console.log('port 3000!')
})
