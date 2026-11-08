import type { DurationInput, DurationLike } from './types/index.js';

import { assertInt } from './helpers/assertInt.js';
import { noValueOf } from './helpers/noValueOf.js';
import { parseDuration } from './helpers/parse.js';

/**
 * The fields of a duration, from the largest unit to the smallest.
 */
const FIELDS = [
	'years',
	'months',
	'weeks',
	'days',
	'hours',
	'minutes',
	'seconds',
	'milliseconds'
] as const;

/**
 * Amount of time, such as 3 days or 1 year and 2 months. A duration has the
 * same fields as `Temporal.Duration`, but it stops at milliseconds.
 *
 * A duration keeps each field as it is given. It does not change 90 minutes
 * into 1 hour and 30 minutes, because the length of a day, a month and a
 * year is not always the same.
 *
 * All fields have the same sign. A negative duration goes back in time.
 */
export class Duration implements DurationLike {
	/**
	 * The number of years.
	 */
	public readonly years: number;

	/**
	 * The number of months.
	 */
	public readonly months: number;

	/**
	 * The number of weeks.
	 */
	public readonly weeks: number;

	/**
	 * The number of days.
	 */
	public readonly days: number;

	/**
	 * The number of hours.
	 */
	public readonly hours: number;

	/**
	 * The number of minutes.
	 */
	public readonly minutes: number;

	/**
	 * The number of seconds.
	 */
	public readonly seconds: number;

	/**
	 * The number of milliseconds.
	 */
	public readonly milliseconds: number;

	private constructor(fields: DurationLike) {
		this.years = fields.years;
		this.months = fields.months;
		this.weeks = fields.weeks;
		this.days = fields.days;
		this.hours = fields.hours;
		this.minutes = fields.minutes;
		this.seconds = fields.seconds;
		this.milliseconds = fields.milliseconds;
	}

	/**
	 * The sign of this duration: `-1` if it is negative, `0` if all fields
	 * are zero and `1` if it is positive.
	 */
	get sign(): -1 | 0 | 1 {
		for(const field of FIELDS) {
			if(this[field] !== 0) {
				return this[field] < 0 ? -1 : 1;
			}
		}

		return 0;
	}

	/**
	 * If all fields of this duration are zero.
	 */
	get blank(): boolean {
		return this.sign === 0;
	}

	/**
	 * Get a duration with the same fields and the opposite sign.
	 */
	public negated(): Duration {
		return Duration.create(field => -this[field]);
	}

	/**
	 * Get a duration with the same fields and a positive sign.
	 */
	public abs(): Duration {
		return Duration.create(field => Math.abs(this[field]));
	}

	/**
	 * Get a copy of this duration with some fields changed.
	 *
	 * @param fields
	 *   the fields to change. All fields of the result must have the same
	 *   sign.
	 */
	public with(fields: Partial<DurationLike>): Duration {
		assertHasField(fields);
		return Duration.create(field => fields[field] ?? this[field]);
	}

	/**
	 * Get the string for this value in JSON. This is the same as
	 * `toString()`.
	 */
	public toJSON() {
		return this.toString();
	}

	/**
	 * Throw a `TypeError`. A duration does not have one order, because a
	 * month does not always have the same number of days.
	 */
	public valueOf(): never {
		return noValueOf('Duration');
	}

	/**
	 * Turn this duration into an ISO 8601 string, such as `P1Y2M3D`,
	 * `PT8H30M` or `-P1D`. A duration where all fields are zero is `PT0S`.
	 * Milliseconds are written as a fraction of a second, such as `PT1.5S`.
	 * This is the same string that `Temporal` gives.
	 */
	public toString() {
		const sign = this.sign;
		const abs = this.abs();

		let date = '';
		if(abs.years) date += abs.years + 'Y';
		if(abs.months) date += abs.months + 'M';
		if(abs.weeks) date += abs.weeks + 'W';
		if(abs.days) date += abs.days + 'D';

		let time = '';
		if(abs.hours) time += abs.hours + 'H';
		if(abs.minutes) time += abs.minutes + 'M';

		const totalMilliseconds = abs.seconds * 1000 + abs.milliseconds;
		if(totalMilliseconds !== 0 || (date === '' && time === '')) {
			const seconds = Math.floor(totalMilliseconds / 1000);
			const fraction = totalMilliseconds % 1000;
			time += seconds;
			if(fraction !== 0) {
				time += '.' + String(fraction).padStart(3, '0').replace(/0+$/, '');
			}
			time += 'S';
		}

		return (sign < 0 ? '-' : '')
			+ 'P'
			+ date
			+ (time === '' ? '' : 'T' + time);
	}

	/**
	 * Create a duration from an ISO 8601 string or from an object.
	 *
	 * The string can be in the form that `toString()` gives, such as
	 * `P1Y2M3DT4H5M6.5S` or `-P1D`. The last unit can have a fraction, such
	 * as `PT1.5H`.
	 *
	 * The object can have the fields `years`, `months`, `weeks`, `days`,
	 * `hours`, `minutes`, `seconds` and `milliseconds`. It must have at least
	 * one of them. A missing field is zero. This includes a
	 * `Temporal.Duration`.
	 *
	 * All fields must be integers with the same sign. A duration that is more
	 * precise than a millisecond gives an error.
	 *
	 * @param value
	 *   the string or the object
	 */
	public static from(value: string | DurationInput): Duration {
		if(typeof value === 'string') {
			const fields = parseDuration(value);
			return Duration.create(field => fields[field]);
		}

		if(value instanceof Duration) {
			return value;
		}

		if(typeof value !== 'object' || value === null) {
			throw new TypeError('duration must be a string or an object');
		}

		assertHasField(value);
		if((value.microseconds ?? 0) !== 0 || (value.nanoseconds ?? 0) !== 0) {
			throw new RangeError('Invalid duration, the duration can not be more precise than a millisecond');
		}

		return Duration.create(field => value[field] ?? 0);
	}

	/**
	 * A duration where all fields are zero.
	 */
	public static readonly ZERO = new Duration({
		years: 0,
		months: 0,
		weeks: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		milliseconds: 0
	});

	private static create(get: (field: typeof FIELDS[number]) => unknown): Duration {
		const fields = {} as Record<typeof FIELDS[number], number>;
		let sign = 0;
		for(const field of FIELDS) {
			// Add zero to change -0 into 0.
			const value = assertInt(get(field), field) + 0;
			if(value !== 0) {
				const fieldSign = value < 0 ? -1 : 1;
				if(sign !== 0 && fieldSign !== sign) {
					throw new RangeError('All fields of a duration must have the same sign');
				}
				sign = fieldSign;
			}
			fields[field] = value;
		}

		return new Duration(fields);
	}
}

function assertHasField(value: object) {
	const object = value as Record<string, unknown>;
	if(! FIELDS.some(field => object[field] !== undefined)
		&& object.microseconds === undefined
		&& object.nanoseconds === undefined
	) {
		throw new TypeError('duration must have at least one field, such as days or hours');
	}
}
