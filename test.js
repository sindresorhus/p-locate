import {serial as test} from 'ava';
import delay from 'delay';
import inRange from 'in-range';
import timeSpan from 'time-span';
import pLocate from '.';

const input = [
	[1, 300],
	[2, 400],
	[3, 200],
	Promise.resolve([4, 100]) // Ensures promises work in the input
];

const tester = async ([value, ms]) => {
	await delay(ms);
	return value === 2 || value === 3;
};

test('main', async t => {
	const end = timeSpan();
	t.is((await pLocate(input, tester))[0], 2);
	t.true(inRange(end(), {start: 370, end: 450}), 'should be time of item `2`');
});

test('option {preserveOrder:false}', async t => {
	const end = timeSpan();
	t.is((await pLocate(input, tester, {preserveOrder: false}))[0], 3);
	t.true(inRange(end(), {start: 170, end: 250}), 'should be time of item `3`');
});

test('option {concurrency:1}', async t => {
	const end = timeSpan();
	t.is((await pLocate(input, tester, {concurrency: 1}))[0], 2);
	t.true(inRange(end(), {start: 670, end: 750}), 'should be time of items `1` and `2`, since they run serially');
});

test('returns `undefined` when nothing could be found', async t => {
	t.is((await pLocate([1, 2, 3], () => false)), undefined);
});

test('rejected return value in `tester` rejects the promise', async t => {
	const fixtureError = new Error('fixture');

	await t.throwsAsync(
		pLocate([1, 2, 3], () => Promise.reject(fixtureError)),
		fixtureError.message
	);
});
