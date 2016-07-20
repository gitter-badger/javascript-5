const EventEmitter = require('events').EventEmitter;
const PRequest = require('../net/prequest');

const debug = require('debug')('dubtrack-api:DubClient');

class DubClient extends EventEmitter {
	constructor() {
		super();

		this.cache = {};
		this.log = debug('dubtrack-api:client');

		this.request = new PRequest({
			baseUrl: 'http://api.dubtrack.fm/',
			json: true, // body as json
			gzip: true, // gzip compression
			jar: true,	// cookie support
		});

		this.client = null;
		this.channel = null;
		this.room = null;
	}
}

// register prototype
[
	// connection
	'connect', 'disconnect',

	// rooms
	'getRoomList', 'getRoomInfo',

	// messages (chatbox / pms)
	'sendMessage',

].forEach((method) => {
	// eslint-disable-next-line global-require
	DubClient.prototype[method] = require(`./proto/${method}`);
});

module.exports = (DubClient.default = DubClient);
