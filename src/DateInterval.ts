import type { LocalDateLike } from './types/index.js';

import { LocalDate } from './LocalDate.js';
import {
	assertIntervalOrder,
	compareIntervals,
	compareStartToEnd,
	formatInterval
} from './helpers/intervals.js';
import { parseInterval } from './helpers/parse.js';
import { noValueOf } from './helpers/noValueOf.js';

/**
 * Interval between two dates, where both dates are inclusive. This matches
 * how people write date ranges, such as 1 March to 31 March. A `null` start
 * or end makes that side of the interval open.
 *
 * Use `Interval` for an interval where the end is not part of the interval.
 */
export class DateInterval {
	/**
	 * Start of the interval, inclusive. `null` if the interval has no start.
	 */
	public readonly start: LocalDate | null;

	/**
	 * End of the interval, inclusive. `null` if the interval has no end.
	 */
	public readonly end: LocalDate | null;

	private constructor(start: LocalDate | null, end: LocalDate | null) {
		assertIntervalOrder(start, end);

		this.start = start;
		this.end = end;
	}

	/**
	 * Get if the given date is in this interval.
	 *
	 * @param date
	 */
	public contains(date: LocalDateLike) {
		return (this.start === null || this.start.compare(date) <= 0)
			&& (this.end === null || this.end.compare(date) >= 0);
	}

	/**
	 * Get if this interval and another interval have at least one date in
	 * common.
	 *
	 * @param other
	 */
	public overlaps(other: DateInterval) {
		return compareStartToEnd(this.start, other.end) <= 0
			&& compareStartToEnd(other.start, this.end) <= 0;
	}

	/**
	 * Get if this interval equals another interval.
	 *
	 * @param other
	 */
	public equals(other: DateInterval | null | undefined) {
		if(! other) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this interval with another interval. The start is compared
	 * first and then the end. An open start comes before every date and an
	 * open end comes after every date.
	 *
	 * @param other
	 */
	public compare(other: DateInterval) {
		return compareIntervals(this, other);
	}

	/**
	 * Get the string for this value in JSON. This is the same as
	 * `toString()`.
	 */
	public toJSON() {
		return this.toString();
	}

	/**
	 * Throw a `TypeError`. Use `compare()` or `equals()` to compare values.
	 */
	public valueOf(): never {
		return noValueOf('DateInterval');
	}

	/**
	 * Turn this interval into an ISO 8601 string, such as
	 * `2024-03-01/2024-03-31`. An open start or end is written as `..`.
	 */
	public toString() {
		return formatInterval(this.start, this.end);
	}

	/**
	 * Create a new interval between two dates. Will throw an error if the
	 * start is after the end.
	 *
	 * @param startInclusive
	 * @param endInclusive
	 */
	public static between(startInclusive: LocalDate | null, endInclusive: LocalDate | null) {
		return new DateInterval(startInclusive, endInclusive);
	}

	/**
	 * Create an interval from an ISO 8601 string or from another interval.
	 *
	 * The string can be in the form that `toString()` gives, such as
	 * `2024-03-01/2024-03-31`. A side that is `..` is open, such as
	 * `2024-03-01/..`. An interval is returned as it is. Will throw an error
	 * if the start is after the end.
	 *
	 * @param value
	 *   the string or the interval
	 */
	public static from(value: string | DateInterval): DateInterval {
		if(value instanceof DateInterval) {
			return value;
		}

		const [ start, end ] = parseInterval(value, LocalDate.from);
		return new DateInterval(start, end);
	}

	/**
	 * Compare two intervals. Use it to sort intervals, such as
	 * `intervals.sort(DateInterval.compare)`. See `compare` on an interval
	 * for the order.
	 *
	 * @param a
	 * @param b
	 */
	public static compare(a: DateInterval, b: DateInterval) {
		return a.compare(b);
	}

	/**
	 * Create an interval that has an open start and ends at the given date.
	 * The end is part of the interval.
	 *
	 * @param endInclusive
	 */
	public static endingAt(endInclusive: LocalDate) {
		return new DateInterval(null, endInclusive);
	}

	/**
	 * Create an interval that starts at the given date and has an open end.
	 *
	 * @param startInclusive
	 */
	public static startingAt(startInclusive: LocalDate) {
		return new DateInterval(startInclusive, null);
	}
}
