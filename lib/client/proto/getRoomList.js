const Promise = require('bluebird');

const assert = require('assert');

/**
 * Retrieves the list of rooms from the remote.
 * @param   {Number} expire  Time in milliseconds before the list expires.
 *                           Default is 2 minutes.
 * @return {Promise}         Promise containing the roomlist.
 */
function getRoomList(expire = 120000) {
	const cache = this.cache;
	const log = this.debug;
	const request = this.request;

	assert(expire); assert(typeof expire === 'number');

	if (cache.roomlist && cache.roomlist.expireDate < Date.now()) {
		log('Returned cached roomlist');
		return Promise.resolve(cache.roomlist.rooms);
	}

	return new Promise((resolve, reject) => {
		request.get('/room').then(
			(response) => {
				log('Retrieved remote list');
				cache.roomlist.rooms = response.body.data;
				cache.roomlist.expireDate = Date.now() + expire;

				resolve(response.body.data);
			}
		).catch(reject);
	});
}

module.exports = getRoomList();
