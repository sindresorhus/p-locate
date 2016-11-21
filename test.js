import {serial as test} from 'ava';
import delay from 'delay';
import inRange from 'in-range';
import timeSpan from 'time-span';
import m from './';

const input = [
	[1, 300],
	[2, 400],
	[3, 200],
	Promise.resolve([4, 100]) // ensures promises work in the input
];

const tester = ([val, ms]) => delay(ms).then(() => val === 2 || val === 3);

test('main', async t => {
	const end = timeSpan();
	t.is((await m(input, tester))[0], 2);
	t.true(inRange(end(), 370, 440), 'should be time of item `2`');
});

test('option {preserveOrder:false}', async t => {
	const end = timeSpan();
	t.is((await m(input, tester, {preserveOrder: false}))[0], 3);
	t.true(inRange(end(), 170, 240), 'should be time of item `3`');
});

test('option {concurrency:1}', async t => {
	const end = timeSpan();
	t.is((await m(input, tester, {concurrency: 1}))[0], 2);
	t.true(inRange(end(), 670, 740), 'should be time of items `1` and `2`, since they run serially');
});

test('returns `undefined` when nothing could be found', async t => {
	t.is((await m([1, 2, 3], () => false)), undefined);
});

// test('rejected return value in `tester` rejects the promise', async t => {
// 	const fixtureErr = new Error('fixture');
// 	await t.throws(m([1, 2, 3], () => Promise.reject(fixtureErr)), fixtureErr.message);
// });
