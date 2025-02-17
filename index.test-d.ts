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
