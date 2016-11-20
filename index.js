'use strict';
const pMap = require('p-map');

class EndError extends Error {
	constructor(value) {
		super();
		this.value = value;
	}
}

module.exports = (iterable, tester, opts) =>
	pMap(iterable, el => (
		Promise.resolve()
			.then(() => tester(el))
			.then(val => val === true && Promise.reject(new EndError(el)))
	), opts)
		.then(() => {})
		.catch(err => err instanceof EndError ? err.value : Promise.reject(err));
