/**
 * Disconnects the client from the backend. Emits a `disconnect` event.
 * TODO: link the event in the docs
 */
function disconnect() {
	const auth = this.auth;
	const log = this.debug;

	if (auth) {
		// TODO: disconnect api?
	}

	this.client.close();

	log('Connection closed!');
	this.emit('disconnect');
}

module.exports = disconnect;
