import {expectType} from 'tsd';
import pLocate = require('.');

const files = new Set([
	'unicorn.png',
	'rainbow.png',
	Promise.resolve('pony.png')
]);

pLocate(files, file => {
	expectType<string>(file);
	return file === 'rainbow.png';
}).then(foundPath => {
	expectType<string | undefined>(foundPath);
});
pLocate(files, async file => {
	expectType<string>(file);
	return file === 'rainbow.png';
}).then(foundPath => {
	expectType<string | undefined>(foundPath);
});

pLocate(files, () => true, {concurrency: 2});
pLocate(files, () => true, {preserveOrder: false});
