const assert = require('assert');

/**
 * Joins a channel. If it is already in one it disconnects from it. Emits a
 * `join` event when done.
 * @param  {String} id  Room's ID.
 */
function join(id) {
	const client = this.client;
	const log = this.debug;

	if (this.channel || this.room) this.leave();

	assert(id); assert(typeof id === 'string');

	log(`Joining room ${id}`);

	const channel = client.channels.get(`room:${id}`);

	// listener
	channel.subscribe((event) => {
		switch (event.name) {
		case 'chat-message': this.emit('chat-message', event.data); break;
		default: log(`${event.name} : ${event.data}`);
		}
	});

	channel.on('attached', () => {
		this.channel = channel;
		this.room = id;

		this.emit('join', null, id);
	});

	channel.on('failed', () => {
		this.emit('join', new Error('Failed'));
	});
}

module.exports = join;
