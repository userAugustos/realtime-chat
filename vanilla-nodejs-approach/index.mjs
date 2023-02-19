import { createServer } from 'http';
import crypto from 'crypto';

const PORT = 2009

const WEBSOCKET_MAGIC_STRING_KEY = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
const MASK_KEY_BYTES_LENGTH = 4
const SEVEN_BITES_INTEGER_MARKER = 125
const SIXTEEN_BITES_INTEGER_MARKER = 126
const SIXTYFOUR_BITS_INTEGER_MARKER = 127 // 127 is the maximum we can work on a data frame
const FIRST_BIT = 128


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
		'' // this empty line must be present to response be valid
	].map(line => line.concat('\r\n')).join('')
}

function onSocketUpgrade (req, socket, head) {
	const { 'sec-websocket-key': clientSocketKey } = req.headers;
	const response = prepareHandShakeResponse(clientSocketKey);
	socket.write(response);

// 	a listener for the `readable` event, it will be called when the socket is ready to output data
	socket.on('readable', () => onSocketReadable(socket))
}

/*
[
  1, // mask bit
  // payload starts here
  0, // bit 1
  0, // bit 2
  0, // bit 3
  1, // bit 4
  0, // bit 5
  1, // bit 6
  1  // bit 7
  // total value of these bits tell us if payload is here or on the next byte
]
* */

function onSocketReadable(socket) {
	socket.read(1) // read and from moment, does nothing

	// so now we are in the second byte
	const [markerAndPayLoadLength] = socket.read(1) // passing 1, can look weirdo, but, the method read() of socket, read we pass the byte to read, so whe nhe reads, it's discarded
	// so after we make socket.read(3) the 3 byte will be read, or stored, and then discarded, so, when we read the first one in line 63, and didn't store it, he doesn't "exist" more

	const lengthIndicatorInBits = markerAndPayLoadLength - FIRST_BIT

	let messageLength = 0

	// so basically without the mask(FIRST_BIT), your message should be 125 bytes or less
	if(lengthIndicatorInBits <=! SEVEN_BITES_INTEGER_MARKER) {
		throw new Error(`your message is too long`)
	}

	messageLength = lengthIndicatorInBits

	// now with your message length we can read data on the socket
	const maskKey = socket.read(MASK_KEY_BYTES_LENGTH); // mask
	const encoded = socket.read(messageLength); // this will be actually our data

	const decoded = unmask(encoded, maskKey) // using a func with built in methods of javascript to unmask your encoded bytes
	console.debug(decoded.toString())
}

function unmask(encoded, maskKey){
	const decoded = Uint8Array.from(encoded, (element, index) => element ^ maskKey[index % 4])

	return Buffer.from(decoded)
}
;[
	"uncaughtException",
	"unhandledRejection"
].forEach(event => {
	process.on(event, (err) => console.error(`error on ${event}; ${err.stack || err}`))
})
