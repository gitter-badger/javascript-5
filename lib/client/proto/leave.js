
/**
 * Leave the current channel. Emits a `leave` event when completed.
 */
function leave() {
	const log = this.debug;

	if (this.channel) {
		this.channel.presence.leave();
		this.channel.unsubscribe();
		this.channel = null;
	}
	if (this.room) this.room = null;

	log('Channel left');
	this.emit('leave');
}

module.exports = leave;
