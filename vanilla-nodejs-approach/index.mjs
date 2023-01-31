import { createServer } from 'http';

const PORT = 2009

createServer((req, res) => {
	res.writeHead(200);
	res.end("You're on a Vanilla approach of websockets with nodejs")
}).listen(PORT, () => console.debug(`all good to go in localhost:${PORT}`));


;[
	"uncaughtException",
	"unhandledRejection"
].forEach(event => {
	process.on(event, (err) => console.error(`error on ${event}; ${err.stack || err}`))
})