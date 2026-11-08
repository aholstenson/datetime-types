import type { Comparable } from './types/index.js';

import {
	assertIntervalOrder,
	compareIntervals,
	compareStartToEnd,
	formatInterval
} from './helpers/intervals.js';
import { parseInterval } from './helpers/parse.js';
import { noValueOf } from './helpers/noValueOf.js';

/**
 * Interval between two values. The start is inclusive and the end is
 * exclusive, so the interval holds every value from the start up to, but not
 * including, the end. A `null` start or end makes that side of the interval
 * open.
 *
 * The values must have a `compare` method, as `LocalDate`, `LocalTime`,
 * `LocalDateTime`, `Year` and `Month` have. The start must not be after the
 * end, so an interval of times can not go across midnight.
 *
 * Use `DateInterval` for an interval of dates where the last date is part of
 * the interval.
 */
export class Interval<T extends Comparable<T>> {
	/**
	 * Start of the interval, inclusive. `null` if the interval has no start.
	 */
	public readonly start: T | null;

	/**
	 * End of the interval, exclusive. `null` if the interval has no end.
	 */
	public readonly end: T | null;

	private constructor(start: T | null, end: T | null) {
		assertIntervalOrder(start, end);

		this.start = start;
		this.end = end;
	}

	/**
	 * Get if this interval holds no values. This is true when the start
	 * equals the end.
	 */
	public isEmpty() {
		return this.start !== null
			&& this.end !== null
			&& this.start.compare(this.end) === 0;
	}

	/**
	 * Get if the given value is in this interval.
	 *
	 * @param value
	 */
	public contains(value: T) {
		return (this.start === null || this.start.compare(value) <= 0)
			&& (this.end === null || this.end.compare(value) > 0);
	}

	/**
	 * Get if this interval and another interval have at least one value in
	 * common. An empty interval overlaps no interval.
	 *
	 * @param other
	 */
	public overlaps(other: Interval<T>) {
		if(this.isEmpty() || other.isEmpty()) return false;

		return compareStartToEnd(this.start, other.end) < 0
			&& compareStartToEnd(other.start, this.end) < 0;
	}

	/**
	 * Get if this interval equals another interval.
	 *
	 * @param other
	 */
	public equals(other: Interval<T> | null | undefined) {
		if(! other) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this interval with another interval. The start is compared
	 * first and then the end. An open start comes before every value and an
	 * open end comes after every value.
	 *
	 * @param other
	 */
	public compare(other: Interval<T>) {
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
		return noValueOf('Interval');
	}

	/**
	 * Turn this interval into an ISO 8601 string, such as
	 * `08:00/17:00`. An open start or end is written as `..`.
	 */
	public toString() {
		return formatInterval(this.start, this.end);
	}

	/**
	 * Create a new interval between two values. Will throw an error if the
	 * start is after the end.
	 *
	 * @param startInclusive
	 * @param endExclusive
	 */
	public static between<T extends Comparable<T>>(startInclusive: T | null, endExclusive: T | null) {
		return new Interval(startInclusive, endExclusive);
	}

	/**
	 * Read an interval from an ISO 8601 string, such as `08:00:00/17:00:00`.
	 * Each side is read with `parseValue`, such as `LocalTime.from`. A side
	 * that is `..` is open. Will throw an error if the start is after the
	 * end.
	 *
	 * @param text
	 *   the string to read
	 * @param parseValue
	 *   function that reads one side of the interval
	 */
	public static parse<T extends Comparable<T>>(text: string, parseValue: (value: string) => T) {
		const [ start, end ] = parseInterval(text, parseValue);
		return new Interval<T>(start, end);
	}

	/**
	 * Compare two intervals. Use it to sort intervals, such as
	 * `intervals.sort(Interval.compare)`. See `compare` on an interval for
	 * the order.
	 *
	 * @param a
	 * @param b
	 */
	public static compare<T extends Comparable<T>>(a: Interval<T>, b: Interval<T>) {
		return a.compare(b);
	}

	/**
	 * Create an interval from an open start until (exclusive) the given
	 * value.
	 *
	 * @param endExclusive
	 */
	public static until<T extends Comparable<T>>(endExclusive: T) {
		return new Interval<T>(null, endExclusive);
	}

	/**
	 * Create an interval that starts at the given value and has an open end.
	 *
	 * @param startInclusive
	 */
	public static from<T extends Comparable<T>>(startInclusive: T) {
		return new Interval<T>(startInclusive, null);
	}
}
