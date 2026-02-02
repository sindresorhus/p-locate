import test from 'ava';
import delay from 'delay';
import inRange from 'in-range';
import timeSpan from 'time-span';
import pLocate from './index.js';

const input = [
	[1, 300],
	[2, 400],
	[3, 200],
	Promise.resolve([4, 100]), // Ensures promises work in the input
];

const tester = async ([value, ms]) => {
	await delay(ms);
	return value === 2 || value === 3;
};

test.serial('main', async t => {
	const end = timeSpan();
	const [result] = await pLocate(input, tester);
	t.is(result, 2);
	t.true(inRange(end(), {start: 370, end: 450}), 'should be time of item `2`');
});

test.serial('option {preserveOrder:false}', async t => {
	const end = timeSpan();
	const [result] = await pLocate(input, tester, {preserveOrder: false});
	t.is(result, 3);
	t.true(inRange(end(), {start: 170, end: 250}), 'should be time of item `3`');
});

test.serial('option {concurrency:1}', async t => {
	const end = timeSpan();
	const [result] = await pLocate(input, tester, {concurrency: 1});
	t.is(result, 2);
	t.true(inRange(end(), {start: 670, end: 750}), 'should be time of items `1` and `2`, since they run serially');
});

test.serial('returns `undefined` when nothing could be found', async t => {
	t.is((await pLocate([1, 2, 3], () => false)), undefined);
});

test.serial('rejected return value in `tester` rejects the promise', async t => {
	const fixtureError = new Error('fixture');

	await t.throwsAsync(
		pLocate([1, 2, 3], () => Promise.reject(fixtureError)),
		{
			message: fixtureError.message,
		},
	);
});

test.serial('async iterable', async t => {
	async function * generate() {
		yield 1;
		yield 2;
		yield 3;
	}

	const result = await pLocate(generate(), element => element === 2);
	t.is(result, 2);
});

test.serial('async iterable - yields promises', async t => {
	const asyncIterable = {
		[Symbol.asyncIterator]() {
			const values = [1, 2, 3].map(value => Promise.resolve(value));
			let index = 0;

			return {
				next() {
					if (index >= values.length) {
						return Promise.resolve({done: true});
					}

					const value = values[index];
					index++;

					return Promise.resolve({value, done: false});
				},
			};
		},
	};

	const result = await pLocate(asyncIterable, element => element === 2);
	t.is(result, 2);
});

test.serial('async iterable - returns undefined when nothing could be found', async t => {
	async function * generate() {
		yield 1;
		yield 2;
		yield 3;
	}

	const result = await pLocate(generate(), () => false);
	t.is(result, undefined);
});

test.serial('async iterable - async tester', async t => {
	async function * generate() {
		yield 1;
		yield 2;
		yield 3;
	}

	const result = await pLocate(generate(), async element => {
		await delay(50);
		return element === 3;
	});
	t.is(result, 3);
});

test.serial('async iterable - only matches strict true', async t => {
	async function * generate() {
		yield 1;
		yield 2;
		yield 3;
	}

	const result = await pLocate(generate(), element => element === 2 ? 1 : false);
	t.is(result, undefined);
});

test.serial('async iterable - stops iterating after finding a match', async t => {
	let count = 0;

	async function * generate() {
		yield 1;
		count++;
		yield 2;
		count++;
		yield 3;
		count++;
	}

	const result = await pLocate(generate(), element => element === 2);
	t.is(result, 2);
	t.is(count, 1);
});

test.serial('async iterable - rejected tester rejects the promise', async t => {
	const fixtureError = new Error('fixture');

	async function * generate() {
		yield 1;
	}

	await t.throwsAsync(
		pLocate(generate(), () => Promise.reject(fixtureError)),
		{
			message: fixtureError.message,
		},
	);
});

test.serial('async iterable - empty', async t => {
	async function * generate() {
		// Empty
	}

	const result = await pLocate(generate(), () => true);
	t.is(result, undefined);
});
