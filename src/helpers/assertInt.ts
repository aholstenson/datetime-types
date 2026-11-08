/**
 * Throw an error if a value is not an integer. The errors are the same kind
 * that `Temporal` throws: a `TypeError` if the value is not a number, and a
 * `RangeError` if the number is not a safe integer.
 *
 * @param value
 *   the value to check
 * @param name
 *   the name of the field, used in the error message
 */
export function assertInt(value: unknown, name: string): number {
	if(typeof value !== 'number') {
		throw new TypeError(name + ' must be a number, got ' + describe(value));
	}

	if(! Number.isSafeInteger(value)) {
		throw new RangeError(name + ' must be an integer, got ' + value);
	}

	return value;
}

/**
 * Throw a `RangeError` if an integer is not in a range.
 *
 * @param value
 *   the integer to check
 * @param name
 *   the name of the field, used in the error message
 * @param min
 *   the lowest permitted value
 * @param max
 *   the highest permitted value
 */
export function assertIntInRange(value: unknown, name: string, min: number, max: number): number {
	const result = assertInt(value, name);
	if(result < min || result > max) {
		throw new RangeError(name + ' must be between ' + min + ' and ' + max + ', got ' + result);
	}

	return result;
}

function describe(value: unknown) {
	if(value === null) return 'null';
	if(typeof value === 'string') return JSON.stringify(value);
	return typeof value;
}

/**
 * The lowest year that a value can have. This is the same range that
 * `Temporal` uses, so every year fits in the six digits of an ISO 8601
 * string and the calculations stay exact.
 */
export const MIN_YEAR = -271821;

/**
 * The highest year that a value can have. See `MIN_YEAR`.
 */
export const MAX_YEAR = 275760;

/**
 * Throw an error if a value is not a year from `MIN_YEAR` to `MAX_YEAR`.
 *
 * @param value
 *   the value to check
 */
export function assertYear(value: unknown): number {
	return assertIntInRange(value, 'year', MIN_YEAR, MAX_YEAR);
}
