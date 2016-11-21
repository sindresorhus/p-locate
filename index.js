'use strict';
const pLimit = require('p-limit');

class EndError extends Error {
	constructor(value) {
		super();
		this.value = value;
	}
}

// the input can also be a promise, so we `Promise.all()` them both
const finder = el => Promise.all(el).then(val => val[1] === true && Promise.reject(new EndError(val[0])));

module.exports = (iterable, tester, opts) => {
	opts = Object.assign({
		concurrency: Infinity,
		preserveOrder: true
	}, opts);

	const limit = pLimit(opts.concurrency);

	// start all the promises concurrently with optional limit
	const items = Array.from(iterable).map(el => {
		return [el, limit(() => Promise.resolve(el).then(tester))];
	});

	// check the promises either serially or concurrently
	const ret = opts.preserveOrder ?
		items.reduce((p, el) => p.then(() => finder(el)), Promise.resolve()) :
		Promise.all(items.map(el => finder(el)));

	return ret.then(() => {})
		.catch(err => err instanceof EndError ? (err.value) : Promise.reject(err));
};
