import { WithHour, WithMinute, WithSecond, WithMilliOfSecond } from './types';

import { assertInt } from './helpers/assertInt';

/**
 * Representation of a local time without timezone.
 */
export class LocalTime implements WithHour, WithMinute, WithSecond, WithMilliOfSecond {
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
	 * Turn this time into a standard string representation.
	 */
	public toString() {
		let result = '';
		result += (this.hour < 10 ? '0' : '') + this.hour;
		result += ':';
		result += (this.minute < 10 ? '0' : '') + this.minute;
		if(this.second > 0 || this.milliOfSecond > 0) {
			// If there is either a second or millisecond, add them to the result
			result += ':';
			result += (this.second < 10 ? '0' : '') + this.second;

			if(this.milliOfSecond) {
				result += '.';
				result += (this.milliOfSecond < 10 ? '00' : (this.milliOfSecond < 100 ? '0' : ''))
					+ this.milliOfSecond;
			}
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
	public static MIN = new LocalTime(0, 0, 0, 0);

	/**
	 * The maximum time that can be represented.
	 */
	public static MAX = new LocalTime(23, 59, 59, 999);

	/**
	 * Time at midnight.
	 */
	public static MIDNIGHT = new LocalTime(0, 0, 0, 0);
}
