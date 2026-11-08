import type { LocalDateInput } from './types/index.js';

import { LocalDate } from './LocalDate.js';
import {
	assertIntervalOrder,
	compareIntervals,
	compareStartToEnd,
	formatInterval,
	isDayBefore,
	maxNullable,
	minNullable
} from './helpers/intervals.js';
import { parseInterval } from './helpers/parse.js';
import { noValueOf } from './helpers/noValueOf.js';
import { compareNullable } from './helpers/compareNullable.js';
import { dateFromEpochDays, epochDays } from './helpers/arithmetic.js';

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
	 *   the date, or a value that `LocalDate.from()` accepts
	 */
	public contains(date: string | LocalDateInput) {
		return (this.start === null || this.start.compare(date) <= 0)
			&& (this.end === null || this.end.compare(date) >= 0);
	}

	/**
	 * Get if this interval and another interval have at least one date in
	 * common.
	 *
	 * @param other
	 *   the other interval, or a string that `from()` accepts
	 */
	public overlaps(other: string | DateInterval) {
		const o = DateInterval.from(other);
		return compareStartToEnd(this.start, o.end) <= 0
			&& compareStartToEnd(o.start, this.end) <= 0;
	}

	/**
	 * Get if this interval holds all dates of another interval.
	 *
	 * @param other
	 *   the other interval, or a string that `from()` accepts
	 */
	public encloses(other: string | DateInterval): boolean {
		const o = DateInterval.from(other);
		return compareNullable(this.start, o.start, 'first') <= 0
			&& compareNullable(o.end, this.end, 'last') <= 0;
	}

	/**
	 * Get if this interval and another interval meet without a gap and
	 * without an overlap. This is true when one interval ends on the day
	 * before the other starts, such as March and April.
	 *
	 * @param other
	 *   the other interval, or a string that `from()` accepts
	 */
	public abuts(other: string | DateInterval): boolean {
		const o = DateInterval.from(other);
		return isDayBefore(this.end, o.start) || isDayBefore(o.end, this.start);
	}

	/**
	 * Get if this interval ends before a date, or before another interval
	 * starts. An open end is never before anything.
	 *
	 * @param other
	 *   a date, a value that `LocalDate.from()` accepts, or an interval
	 */
	public isBefore(other: string | LocalDateInput | DateInterval): boolean {
		const date = other instanceof DateInterval ? other.start : LocalDate.from(other);
		return this.end !== null && date !== null && this.end.compare(date) < 0;
	}

	/**
	 * Get if this interval starts after a date, or after another interval
	 * ends. An open start is never after anything.
	 *
	 * @param other
	 *   a date, a value that `LocalDate.from()` accepts, or an interval
	 */
	public isAfter(other: string | LocalDateInput | DateInterval): boolean {
		const date = other instanceof DateInterval ? other.end : LocalDate.from(other);
		return this.start !== null && date !== null && this.start.compare(date) > 0;
	}

	/**
	 * Get the dates that this interval and another interval have in common,
	 * or `null` if they do not overlap.
	 *
	 * @param other
	 *   the other interval, or a string that `from()` accepts
	 */
	public intersection(other: string | DateInterval): DateInterval | null {
		const o = DateInterval.from(other);
		if(! this.overlaps(o)) return null;

		return new DateInterval(
			maxNullable(this.start, o.start, 'first'),
			minNullable(this.end, o.end, 'last')
		);
	}

	/**
	 * Get the smallest interval that holds all dates of this interval and of
	 * another interval. If there is a gap between them, the result also holds
	 * the gap.
	 *
	 * @param other
	 *   the other interval, or a string that `from()` accepts
	 */
	public span(other: string | DateInterval): DateInterval {
		const o = DateInterval.from(other);
		return new DateInterval(
			minNullable(this.start, o.start, 'first'),
			maxNullable(this.end, o.end, 'last')
		);
	}

	/**
	 * Get the number of dates in this interval, including the start and the
	 * end. An interval with an open side gives `Infinity`.
	 */
	public countDays(): number {
		if(this.start === null || this.end === null) return Infinity;

		return epochDays(this.end) - epochDays(this.start) + 1;
	}

	/**
	 * Get the dates in this interval in order, such as
	 * `for(const date of interval.days())`. Throws a `RangeError` if a side
	 * of the interval is open.
	 *
	 * The interval itself is not iterable, so that tools that compare or copy
	 * iterable values do not go through the dates of an open interval.
	 */
	public days(): IterableIterator<LocalDate> {
		if(this.start === null || this.end === null) {
			throw new RangeError('Can not get the dates of an interval with an open side');
		}

		return daysBetween(epochDays(this.start), epochDays(this.end));
	}

	/**
	 * Get if this interval equals another interval.
	 *
	 * @param other
	 *   the other interval, or a string that `from()` accepts
	 */
	public equals(other: string | DateInterval | null | undefined) {
		if(! other) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this interval with another interval. The start is compared
	 * first and then the end. An open start comes before every date and an
	 * open end comes after every date.
	 *
	 * @param other
	 *   the other interval, or a string that `from()` accepts
	 */
	public compare(other: string | DateInterval) {
		return compareIntervals(this, DateInterval.from(other));
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
	 *   the first date, a value that `LocalDate.from()` accepts, or `null`
	 *   for an open start
	 * @param endInclusive
	 *   the last date, a value that `LocalDate.from()` accepts, or `null`
	 *   for an open end
	 */
	public static between(
		startInclusive: string | LocalDateInput | null,
		endInclusive: string | LocalDateInput | null
	): DateInterval {
		return new DateInterval(toDate(startInclusive), toDate(endInclusive));
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
	public static compare(a: string | DateInterval, b: string | DateInterval) {
		return DateInterval.from(a).compare(b);
	}

	/**
	 * Create an interval that has an open start and ends at the given date.
	 * The end is part of the interval.
	 *
	 * @param endInclusive
	 *   the last date, or a value that `LocalDate.from()` accepts
	 */
	public static endingAt(endInclusive: string | LocalDateInput): DateInterval {
		return new DateInterval(null, LocalDate.from(endInclusive));
	}

	/**
	 * Create an interval that starts at the given date and has an open end.
	 *
	 * @param startInclusive
	 *   the first date, or a value that `LocalDate.from()` accepts
	 */
	public static startingAt(startInclusive: string | LocalDateInput): DateInterval {
		return new DateInterval(LocalDate.from(startInclusive), null);
	}
}

function toDate(value: string | LocalDateInput | null): LocalDate | null {
	return value === null ? null : LocalDate.from(value);
}

function* daysBetween(first: number, last: number): IterableIterator<LocalDate> {
	for(let day = first; day <= last; day++) {
		const date = dateFromEpochDays(day);
		yield LocalDate.of(date.year, date.month, date.day);
	}
}
