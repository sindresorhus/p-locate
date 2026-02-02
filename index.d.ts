export type Options = {
	/**
	The number of concurrently pending promises returned by `tester`.

	Minimum: `1`

	@default Infinity
	*/
	readonly concurrency?: number;

	/**
	Preserve `input` order when searching.

	Disable this to improve performance if you don't care about the order.

	@default true
	*/
	readonly preserveOrder?: boolean;
};

/**
Get the first fulfilled promise that satisfies the provided testing function.

@param input - An iterable of promises/values to test.
@param tester - This function will receive resolved values from `input` and is expected to return a `Promise<boolean>` or `boolean`.
@returns A `Promise` that is fulfilled when `tester` resolves to `true` or the iterable is done, or rejects if any of the promises reject. The fulfilled value is the current iterable value or `undefined` if `tester` never resolved to `true`.

@example
```
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
*/
export default function pLocate<ValueType>(
	input: Iterable<PromiseLike<ValueType> | ValueType>,
	tester: (element: ValueType) => PromiseLike<boolean> | boolean,
	options?: Options
): Promise<ValueType | undefined>;

/**
Get the first fulfilled promise that satisfies the provided testing function.

This overload accepts an `AsyncIterable` as input. Since async iterables are iterated serially, the `concurrency` and `preserveOrder` options are not applicable.

@param input - An async iterable of promises/values to test.
@param tester - This function will receive resolved values from `input` and is expected to return a `Promise<boolean>` or `boolean`.
@returns A `Promise` that is fulfilled when `tester` resolves to `true` or the iterable is done, or rejects if any of the promises reject. The fulfilled value is the current iterable value or `undefined` if `tester` never resolved to `true`.

@example
```
import pLocate from 'p-locate';

async function * getFiles() {
	yield 'unicorn.png';
	yield 'rainbow.png';
	yield 'pony.png';
}

const foundPath = await pLocate(getFiles(), file => file === 'rainbow.png');

console.log(foundPath);
//=> 'rainbow.png'
```
*/
export default function pLocate<ValueType>(
	input: AsyncIterable<PromiseLike<ValueType> | ValueType>,
	tester: (element: ValueType) => PromiseLike<boolean> | boolean,
): Promise<ValueType | undefined>;
