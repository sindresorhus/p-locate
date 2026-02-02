/* eslint-disable @typescript-eslint/no-floating-promises */
import {expectType} from 'tsd';
import pLocate from './index.js';

const files = new Set([
	'unicorn.png',
	'rainbow.png',
	Promise.resolve('pony.png'),
]);

const foundPath1 = await pLocate(files, file => {
	expectType<string>(file);
	return file === 'rainbow.png';
});
expectType<string | undefined>(foundPath1);
const foundPath2 = await pLocate(files, async file => {
	expectType<string>(file);
	return file === 'rainbow.png';
});
expectType<string | undefined>(foundPath2);

pLocate(files, () => true, {concurrency: 2});
pLocate(files, () => true, {preserveOrder: false});

const asyncIterable: AsyncIterable<Promise<string>> = {
	[Symbol.asyncIterator]() {
		const values = [
			Promise.resolve('unicorn.png'),
			Promise.resolve('rainbow.png'),
		];
		let index = 0;

		return {
			async next() {
				if (index >= values.length) {
					return {done: true, value: undefined};
				}

				const value = values[index];
				index++;

				return {done: false, value};
			},
		};
	},
};

const foundPath3 = await pLocate(asyncIterable, file => {
	expectType<string>(file);
	return file === 'rainbow.png';
});
expectType<string | undefined>(foundPath3);
