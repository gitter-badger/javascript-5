const Promise = require('bluebird');

const assert = require('assert');

/**
 * Retrieve a room's info.
 * @param   {String} id      Room's id.
 * @param   {Number} expire  Time in milliseconds before the info expires.
 * @return {Promise}         Promise containing the room's info.
 */
function getRoomInfo(id, expire = 120000) {
	const cache = this.cache;
	const log = this.debug;
	const request = this.request;

	assert(id); assert(typeof id === 'string');

	if (!cache.roominfo) cache.roominfo = {};

	if (cache.roominfo[id] && cache.roominfo[id].expireDate < Date.now()) {
		log('Returned cached info');
		return Promise.resolve(cache.roominfo[id]);
	}

	return new Promise((resolve, reject) => {
		request.get(`/room/${id}`).then(
			(response) => {
				log('Retriever remote info');
				cache.roominfo[id] = response.body.data;
				cache.roominfo[id].expireDate = Date.now() + expire;

				resolve(response.body.data);
			}
		).catch(reject);
	});
}

module.exports = getRoomInfo;
