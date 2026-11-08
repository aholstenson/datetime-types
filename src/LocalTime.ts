import type { LocalTimeInput, LocalTimeLike } from './types/index.js';

import { assertIntInRange } from './helpers/assertInt.js';
import { compareInt } from './helpers/compareInt.js';
import { noValueOf } from './helpers/noValueOf.js';
import { parseTime } from './helpers/parse.js';
import { assertMillisecondPrecision } from './helpers/assertFields.js';
import { zeroPadInt } from './helpers/zeroPadInt.js';

/**
 * Representation of a local time without timezone.
 */
export class LocalTime implements LocalTimeLike {
	/**
	 * The hour of the time.
	 */
	public readonly hour: number;

	/**
	 * The minute of the time.
	 */
	public readonly minute: number;

	/**
	 * The second of the time.
	 */
	public readonly second: number;

	/**
	 * The millisecond of the time.
	 */
	public readonly millisecond: number;

	private constructor(
		hour: number,
		minute: number,
		second: number,
		millisecond: number
	) {
		this.hour = hour;
		this.minute = minute;
		this.second = second;
		this.millisecond = millisecond;
	}

	/**
	 * Get if this local time equals another local time like object.
	 *
	 * @param other
	 */
	public equals(other: LocalTimeLike | null | undefined) {
		if(! other) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this local date with another local date like object.
	 *
	 * @param other
	 */
	public compare(other: LocalTimeLike) {
		const h = compareInt(this.hour, other.hour);
		if(h !== 0) return h;

		const m = compareInt(this.minute, other.minute);
		if(m !== 0) return m;

		const s = compareInt(this.second, other.second);
		if(s !== 0) return s;

		return compareInt(this.millisecond, other.millisecond);
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
		return noValueOf('LocalTime');
	}

	/**
	 * Turn this time into an ISO 8601 string, such as `08:30:00` or
	 * `08:30:00.25`. The string always has the seconds. The fraction of a
	 * second has no trailing zeros. This is the same string that `Temporal`
	 * gives.
	 */
	public toString() {
		let result = zeroPadInt(this.hour, 2)
			+ ':' + zeroPadInt(this.minute, 2)
			+ ':' + zeroPadInt(this.second, 2);

		if(this.millisecond > 0) {
			// Write the fraction without trailing zeros, as Temporal does.
			result += '.' + zeroPadInt(this.millisecond, 3).replace(/0+$/, '');
		}

		return result;
	}

	/**
	 * Create a local time. Will throw an error if a value is out of range.
	 *
	 * @param hour
	 *   the hour, from 0 to 23
	 * @param minute
	 *   the minute, from 0 to 59
	 * @param second
	 *   the second, from 0 to 59
	 * @param millisecond
	 *   the millisecond, from 0 to 999
	 */
	public static of(
		hour: number=0,
		minute: number=0,
		second: number=0,
		millisecond: number=0
	): LocalTime {
		hour = assertIntInRange(hour, 'hour', 0, 23);
		minute = assertIntInRange(minute, 'minute', 0, 59);
		second = assertIntInRange(second, 'second', 0, 59);
		millisecond = assertIntInRange(millisecond, 'millisecond', 0, 999);

		return new LocalTime(hour, minute, second, millisecond);
	}

	/**
	 * Create a local time from an ISO 8601 string or from an object.
	 *
	 * The string can be in the form that `toString()` gives, such as
	 * `08:30:00` or `08:30:00.25`. The seconds and the fraction are optional,
	 * so `08:30` is also accepted.
	 *
	 * The object can have numeric `hour`, `minute`, `second` and
	 * `millisecond` properties. A missing property is zero. This includes a
	 * `LocalTime`, a `LocalDateTime` and a `Temporal.PlainTime`.
	 *
	 * A time that is more precise than a millisecond gives an error, both in
	 * a string and in the `microsecond` and `nanosecond` properties.
	 *
	 * @param value
	 *   the string or the object
	 */
	public static from(value: string | LocalTimeInput): LocalTime {
		if(typeof value === 'string') {
			const parts = parseTime(value);
			return LocalTime.of(parts.hour, parts.minute, parts.second, parts.millisecond);
		}

		if(value instanceof LocalTime) {
			return value;
		}

		assertMillisecondPrecision(value);
		return LocalTime.of(
			value.hour ?? 0,
			value.minute ?? 0,
			value.second ?? 0,
			value.millisecond ?? 0
		);
	}

	/**
	 * Compare two times. Returns `-1` if `a` is before `b`, `0` if they are
	 * equal and `1` if `a` is after `b`. Use it to sort times, such as
	 * `times.sort(LocalTime.compare)`.
	 *
	 * @param a
	 *   a time, or a value that `from()` accepts
	 * @param b
	 *   a time, or a value that `from()` accepts
	 */
	public static compare(a: string | LocalTimeInput, b: string | LocalTimeInput): -1 | 0 | 1 {
		return LocalTime.from(a).compare(LocalTime.from(b));
	}

	/**
	 * Create a local time from the given date.
	 *
	 * @param date
	 */
	public static fromDate(date: Date) {
		return LocalTime.of(
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds()
		);
	}

	/**
	 * Get the current time as a local time.
	 */
	public static now(): LocalTime {
		const date = new Date();

		return LocalTime.of(
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds()
		);
	}

	/**
	 * The minimum time that can be represented.
	 */
	public static readonly MIN = new LocalTime(0, 0, 0, 0);

	/**
	 * The maximum time that can be represented.
	 */
	public static readonly MAX = new LocalTime(23, 59, 59, 999);

	/**
	 * Time at midnight.
	 */
	public static readonly MIDNIGHT = new LocalTime(0, 0, 0, 0);
}
