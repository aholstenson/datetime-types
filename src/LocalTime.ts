import type { WithHour, WithMinute, WithSecond, WithMillisecond, LocalTimeLike } from './types/index.js';

import { assertInt } from './helpers/assertInt.js';
import { compareInt } from './helpers/compareInt.js';
import { noValueOf } from './helpers/noValueOf.js';
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
		hour = assertInt(hour);
		minute = assertInt(minute);
		second = assertInt(second);
		millisecond = assertInt(millisecond);

		if(hour < 0 || hour > 23) {
			throw new Error('hour must be between 0 and 23');
		}

		if(minute < 0 || minute > 59) {
			throw new Error('minute must be between 0 and 59');
		}

		if(second < 0 || second > 59) {
			throw new Error('second must be between 0 and 59');
		}

		if(millisecond < 0 || millisecond > 999) {
			throw new Error('millisecond must be between 0 and 999');
		}

		return new LocalTime(hour, minute, second, millisecond);
	}

	/**
	 * Create a local time from an object containing a combination of numeric
	 * `hour`, `minute`, `second` or `millisecond` properties. If any
	 * property is not present it will be set to `0`.
	 *
	 * @param object
	 */
	public static from(object: WithHour | WithMinute | WithSecond | WithMillisecond) {
		return this.of(
			'hour' in object ? object.hour : 0,
			'minute' in object ? object.minute : 0,
			'second' in object ? object.second : 0,
			'millisecond' in object ? object.millisecond : 0
		);
	}

	/**
	 * Create a local time from the given date.
	 *
	 * @param date
	 */
	public static fromDate(date: Date) {
		return this.of(
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

		return this.of(
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
