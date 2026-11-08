import type { Comparable } from '../types/index.js';

import { compareNullable } from './compareNullable.js';
import { epochDays } from './arithmetic.js';
import type { DateParts } from './parse.js';

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
		throw new RangeError('start of interval must not be after end');
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

/**
 * Get the smaller of two limits of intervals. See `compareNullable` for the
 * meaning of `nulls`.
 *
 * @param a
 * @param b
 * @param nulls
 */
export function minNullable<T extends Comparable<T>>(a: T | null, b: T | null, nulls: 'first' | 'last') {
	return compareNullable(a, b, nulls) <= 0 ? a : b;
}

/**
 * Get the larger of two limits of intervals. See `compareNullable` for the
 * meaning of `nulls`.
 *
 * @param a
 * @param b
 * @param nulls
 */
export function maxNullable<T extends Comparable<T>>(a: T | null, b: T | null, nulls: 'first' | 'last') {
	return compareNullable(a, b, nulls) >= 0 ? a : b;
}

/**
 * Get if two limits of intervals are the same value. An open limit is never
 * the same as another limit.
 *
 * @param a
 * @param b
 */
export function isSame<T extends Comparable<T>>(a: T | null, b: T | null) {
	return a !== null && b !== null && a.compare(b) === 0;
}

/**
 * Get if date `a` is the day before date `b`. An open limit gives `false`.
 *
 * @param a
 * @param b
 */
export function isDayBefore(a: DateParts | null, b: DateParts | null) {
	return a !== null && b !== null && epochDays(b) - epochDays(a) === 1;
}
