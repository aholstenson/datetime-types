import type { Comparable } from '../types/index.js';

import { compareNullable } from './compareNullable.js';

/**
 * Compare the start of an interval with the end of an interval. A `null`
 * start has no lower limit and a `null` end has no upper limit, so a `null`
 * on either side puts the start before the end.
 *
 * @param start
 *   the start of an interval
 * @param end
 *   the end of an interval
 */
export function compareStartToEnd<T extends Comparable<T>>(
	start: T | null,
	end: T | null
): -1 | 0 | 1 {
	if(start === null || end === null) return -1;

	return start.compare(end);
}

/**
 * Compare two intervals. The start is compared first and then the end. An
 * open start comes before every value and an open end comes after every
 * value.
 *
 * @param a
 *   the first interval
 * @param b
 *   the second interval
 */
export function compareIntervals<T extends Comparable<T>>(
	a: { readonly start: T | null, readonly end: T | null },
	b: { readonly start: T | null, readonly end: T | null }
): -1 | 0 | 1 {
	const s = compareNullable(a.start, b.start, 'first');
	if(s !== 0) return s;

	return compareNullable(a.end, b.end, 'last');
}

/**
 * Throw an error if the start of an interval is after its end.
 *
 * @param start
 *   the start of the interval
 * @param end
 *   the end of the interval
 */
export function assertIntervalOrder<T extends Comparable<T>>(
	start: T | null,
	end: T | null
) {
	if(compareStartToEnd(start, end) > 0) {
		throw new Error('start of interval must not be after end');
	}
}

/**
 * Format an interval as in ISO 8601, with the start and the end separated by
 * `/`. An open start or end is written as `..`, as in ISO 8601-2.
 *
 * @param start
 *   the start of the interval
 * @param end
 *   the end of the interval
 */
export function formatInterval(start: unknown, end: unknown) {
	return (start === null ? '..' : String(start))
		+ '/'
		+ (end === null ? '..' : String(end));
}
