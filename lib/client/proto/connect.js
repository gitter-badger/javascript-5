logconst Ably = require('ably');
const Promise = require('bluebird');

const assert = require('assert');
const co = require('co');
const endpoints = require('../../data/endpoints');

// TODO: export utility functions in separate modules
const doLogin = (request, user, pass) => new Promise((resolve, reject) => {
	request.post(endpoints.authDubtrack, {
		form: { user, pass },
	}).then((res) => resolve(res.body), reject);
});

const createSession = (request) => new Promise((resolve, reject) => {
	request.get(endpoints.authSession).then((res) => resolve(res.body), reject);
});

const getToken = (request) => new Promise((resolve, reject) => {
	request.get(endpoints.authToken).then((res) => resolve(res), reject);
});

const ablyConnect = (token) => new Promise((resolve, reject) => {
	const client = new Ably.Realtime({ tokenDetails: token });
	client.connection.on('connected', () => resolve(client));
	client.connection.on('failed', () => reject(
		new Error('Unable to connect to backend')
	));
});


/**
 * Connects the client to the backend. Generates a `connected` event.
 * TODO: link the event in the docs
 * @param  {Boolean} auth      If true connects with the credentials, otherwise
 *                             it connects as a guest.
 * @param   {String} username  Username.
 * @param   {String} password  Password (in plain-text, yeah..).
 */
function connect(auth, username, password) {
	const log = this.log;
	const request = this.request;

	if (auth) {
		assert(username); assert(typeof username === 'string');
		assert(password); assert(typeof password === 'string');
		log('Connecting with username \'%s\'', username);
	} else {
		log('Connecting anonymously');
	}

	co(function * () {
		if (auth) {
			// if this doesn't throw it means that auth is succesfull
			const loginResponse = yield doLogin(request, username, password);
			log(`Authentication: ${loginResponse.message}`);

			const sessionResponse = yield createSession(request);
			log(`Create session: ${sessionResponse.message}`);
			this.session = sessionResponse.data;
		}

		const tokenResponse = yield getToken(request);
		log(`Obtain token: ${tokenResponse.message}`);
		this.token = tokenResponse.data;

		this.client = yield ablyConnect(this.token);

		this.auth = auth;

		return this;
	}.bind(this)).then(
		(client) => {
			log('Connection established!');
			this.emit('connect', undefined, client);
		},
		(error) => {
			log(`Connection failed!\n${JSON.stringify(error)}`);
			this.emit('connect', error);
		}
	);
}

module.exports = connect;
