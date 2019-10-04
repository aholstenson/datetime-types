/**
 * Assert that the input is an integer.
 *
 * @param value
 */
export function assertInt(value: number | undefined | null): number {
	if(typeof value === 'undefined' || value === null) {
		throw new Error('Invalid value, can not be undefined or null');
	}

	if(! Number.isSafeInteger(value)) {
		throw new Error('Invalid value, number is not an integer');
	}

	return value;
}
