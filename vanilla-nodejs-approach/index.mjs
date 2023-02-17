import { createServer } from 'http';
import crypto from 'crypto';

const WEBSOCKET_MAGIC_STRING_KEY = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

const PORT = 2009

const server = createServer((req, res) => {
	res.writeHead(200);
	res.end("You're on a Vanilla approach of websockets with nodejs")
}).listen(PORT, () => console.debug(`all good to go in localhost:${PORT}`));

server.on('upgrade', onSocketUpgrade);

function createSocketAccept(id) {
	// so a lot of the crypto lib here, but we start a hash in the sha1 pattern, pass the strings that we want to it, and return digested in the base64
	const hash = crypto.createHash('sha1');
	hash.update(id + WEBSOCKET_MAGIC_STRING_KEY)
	return hash.digest('base64');
}

function prepareHandShakeResponse(id) {
	const acceptKey = createSocketAccept(id);

	// this return pattern comes from the mdn docs: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers
	return [
		'HTTP/1.1 101 Switching Protocols',
		'Upgrade: websocket',
		'Connection: Upgrade',
		`Sec-WebSocket-Accept: ${acceptKey}`,
		'' // tihs empty line must be present to response be valid
	].map(line => line.concat('\r\n')).join('')
}

function onSocketUpgrade (req, socket, head) {
	const { 'sec-websocket-key': clientSocketKey } = req.headers;
	const response = prepareHandShakeResponse(clientSocketKey);
	socket.write(response);

// 	a listener for the `readable` event, it will be called when the socket is ready to output data
	socket.on('readable', () => onSocketReadable(socket))
}

function onSocketReadable(socket) {

}
;[
	"uncaughtException",
	"unhandledRejection"
].forEach(event => {
	process.on(event, (err) => console.error(`error on ${event}; ${err.stack || err}`))
})
