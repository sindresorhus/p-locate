# p-locate

> Get the first fulfilled promise that satisfies the provided testing function

Think of it like an async version of [`Array#find`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/find).

## Install

```sh
npm install p-locate
```

## Usage

Here we find the first file that exists on disk, in array order.

```js
import {pathExists} from 'path-exists';
import pLocate from 'p-locate';

const files = [
	'unicorn.png',
	'rainbow.png', // Only this one actually exists on disk
	'pony.png'
];

const foundPath = await pLocate(files, file => pathExists(file));

console.log(foundPath);
//=> 'rainbow.png'
```

*The above is just an example. Use [`locate-path`](https://github.com/sindresorhus/locate-path) if you need this.*

## API

### pLocate(input, tester, options?)

Returns a `Promise` that is fulfilled when `tester` resolves to `true` or the iterable is done, or rejects if any of the promises reject. The fulfilled value is the current iterable value or `undefined` if `tester` never resolved to `true`.

#### input

Type: `Iterable<Promise | unknown>`

An iterable of promises/values to test.

#### tester(element)

Type: `Function`

This function will receive resolved values from `input` and is expected to return a `Promise<boolean>` or `boolean`.

#### options

Type: `object`

##### concurrency

Type: `number`\
Default: `Infinity`\
Minimum: `1`

The number of concurrently pending promises returned by `tester`.

##### preserveOrder

Type: `boolean`\
Default: `true`

Preserve `input` order when searching.

Disable this to improve performance if you don't care about the order.

## Related

- [p-map](https://github.com/sindresorhus/p-map) - Map over promises concurrently
- [p-filter](https://github.com/sindresorhus/p-filter) - Filter promises concurrently
- [p-any](https://github.com/sindresorhus/p-any) - Wait for any promise to be fulfilled
- [More…](https://github.com/sindresorhus/promise-fun)
