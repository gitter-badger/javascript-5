const Promise = require('bluebird');

function sendMessage(message) {
	return new Promise((resolve, reject) => {
		this.request.post(`/chat/${this.room._id}`, { body: {
			message,
			token: this.token.token,
		} }).then(resolve, reject);
	});
}

module.exports = sendMessage;
