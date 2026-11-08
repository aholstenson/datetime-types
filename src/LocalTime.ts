import type { WithHour, WithMinute, WithSecond, WithMilliOfSecond, LocalTimeLike } from './types/index.js';

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
	public readonly milliOfSecond: number;

	private constructor(
		hour: number,
		minute: number,
		second: number,
		milliOfSecond: number
	) {
		this.hour = hour;
		this.minute = minute;
		this.second = second;
		this.milliOfSecond = milliOfSecond;
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

		return compareInt(this.milliOfSecond, other.milliOfSecond);
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

		if(this.milliOfSecond > 0) {
			// Write the fraction without trailing zeros, as Temporal does.
			result += '.' + zeroPadInt(this.milliOfSecond, 3).replace(/0+$/, '');
		}

		return result;
	}

	/**
	 * Create a new local time instance from the given time.
	 *
	 * @param hour
	 * @param minute
	 * @param second
	 * @param nanoOfSecond
	 */
	public static of(
		hour: number=0,
		minute: number=0,
		second: number=0,
		milliOfSecond: number=0
	): LocalTime {
		hour = assertInt(hour);
		minute = assertInt(minute);
		second = assertInt(second);
		milliOfSecond = assertInt(milliOfSecond);

		if(hour < 0 || hour > 23) {
			throw new Error('hour must be between 0 and 23');
		}

		if(minute < 0 || minute > 59) {
			throw new Error('minute must be between 0 and 59');
		}

		if(second < 0 || second > 59) {
			throw new Error('second must be between 0 and 59');
		}

		if(milliOfSecond < 0 || milliOfSecond > 999) {
			throw new Error('milliOfSecond must be between 0 and 999');
		}

		return new LocalTime(hour, minute, second, milliOfSecond);
	}

	/**
	 * Create a local time from an object containing a combination of numeric
	 * `hour`, `minute`, `second` or `milliOfSecond` properties. If any
	 * property is not present it will be set to `0`.
	 *
	 * @param object
	 */
	public static from(object: WithHour | WithMinute | WithSecond | WithMilliOfSecond) {
		return this.of(
			'hour' in object ? object.hour : 0,
			'minute' in object ? object.minute : 0,
			'second' in object ? object.second : 0,
			'milliOfSecond' in object ? object.milliOfSecond : 0
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
	public static readonly Minimum = new LocalTime(0, 0, 0, 0);

	/**
	 * The maximum time that can be represented.
	 */
	public static readonly Maximum = new LocalTime(23, 59, 59, 999);

	/**
	 * Time at midnight.
	 */
	public static readonly Midnight = new LocalTime(0, 0, 0, 0);
}
