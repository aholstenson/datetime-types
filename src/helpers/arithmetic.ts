/**
 * Arithmetic for dates and times in the ISO 8601 calendar. The rules are the
 * same as in `Temporal`, so the results are the same.
 */

import type {
	DateUnit,
	DifferenceOptions,
	Overflow,
	OverflowOptions,
	TimeUnit
} from '../types/index.js';
import type { DateParts, TimeParts } from './parse.js';
import { daysFromEpoch, daysInMonth } from './calendar.js';
import { compareInt } from './compareInt.js';
import { assertInt } from './assertInt.js';

export const MILLISECONDS_PER_SECOND = 1000;
export const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
export const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;
export const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

/**
 * The fields of a duration, in plain numbers.
 */
export interface DurationParts {
	years: number;
	months: number;
	weeks: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
}

/**
 * Get the overflow option, and throw a `RangeError` if it is not valid.
 *
 * @param options
 */
export function overflowOf(options: OverflowOptions | undefined): Overflow {
	const overflow = options?.overflow ?? 'constrain';
	if(overflow !== 'constrain' && overflow !== 'reject') {
		throw new RangeError('overflow must be constrain or reject, got ' + String(overflow));
	}

	return overflow;
}

/**
 * Get the largest unit from the options, and throw a `RangeError` if it is
 * not one of the permitted units.
 *
 * @param options
 *   the options of `until()` or `since()`
 * @param permitted
 *   the units that the type permits
 * @param defaultUnit
 *   the unit to use when the option is missing or `auto`
 */
export function largestUnitOf<U extends string>(
	options: DifferenceOptions<U> | undefined,
	permitted: readonly U[],
	defaultUnit: U
): U {
	const unit = options?.largestUnit;
	if(unit === undefined || unit === 'auto') {
		return defaultUnit;
	}

	const plural = (unit.endsWith('s') ? unit : unit + 's') as U;
	if(! permitted.includes(plural)) {
		throw new RangeError(
			'largestUnit must be one of ' + permitted.join(', ') + ', got ' + String(unit)
		);
	}

	return plural;
}

/**
 * Get if a unit is a date unit.
 *
 * @param unit
 */
export function isDateUnit(unit: string): unit is DateUnit {
	return unit === 'years' || unit === 'months' || unit === 'weeks' || unit === 'days';
}

/**
 * Floor division, which rounds towards negative infinity.
 *
 * @param value
 * @param divisor
 */
export function floorDiv(value: number, divisor: number) {
	return Math.floor(value / divisor);
}

/**
 * Get the date for a number of days from 1970-01-01.
 *
 * This is the `civil_from_days` algorithm by Howard Hinnant, which is the
 * inverse of `daysFromEpoch`.
 *
 * @param days
 */
export function dateFromEpochDays(days: number): DateParts {
	const z = days + 719468;
	const era = Math.floor(z / 146097);
	const dayOfEra = z - era * 146097;
	const yearOfEra = Math.floor(
		(dayOfEra - Math.floor(dayOfEra / 1460) + Math.floor(dayOfEra / 36524) - Math.floor(dayOfEra / 146096)) / 365
	);
	const dayOfShiftedYear = dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100));
	const shiftedMonth = Math.floor((5 * dayOfShiftedYear + 2) / 153);
	const day = dayOfShiftedYear - Math.floor((153 * shiftedMonth + 2) / 5) + 1;
	const month = shiftedMonth < 10 ? shiftedMonth + 3 : shiftedMonth - 9;
	const year = yearOfEra + era * 400 + (month <= 2 ? 1 : 0);

	return { year, month, day };
}

/**
 * Get the number of days from 1970-01-01 to a date.
 *
 * @param date
 */
export function epochDays(date: DateParts) {
	return daysFromEpoch(date.year, date.month, date.day);
}

/**
 * Add a number of months to a year and a month. The month can be any
 * integer, also 0, negative or more than 12.
 *
 * @param year
 * @param month
 *   the month, which can be out of the range 1 to 12
 */
export function balanceYearMonth(year: number, month: number) {
	const months = month - 1;
	return {
		year: year + floorDiv(months, 12),
		month: months - floorDiv(months, 12) * 12 + 1
	};
}

/**
 * Get a valid day of the month. With `constrain`, a day after the last day
 * of the month becomes the last day. With `reject`, it throws a
 * `RangeError`.
 *
 * @param year
 * @param month
 *   the month, from 1 to 12
 * @param day
 *   the day, from 1
 * @param overflow
 */
export function regulateDay(year: number, month: number, day: number, overflow: Overflow) {
	const max = daysInMonth(year, month);
	if(day > max) {
		if(overflow === 'reject') {
			throw new RangeError('day must be between 1 and ' + max + ', got ' + day);
		}

		return max;
	}

	return day;
}

/**
 * Add years, months, weeks and days to a date. The years and months are added
 * first. If the day is not in the month that results, `overflow` decides what
 * happens. Then the weeks and days are added.
 *
 * @param date
 * @param duration
 * @param overflow
 */
export function addToDate(
	date: DateParts,
	duration: Pick<DurationParts, 'years' | 'months' | 'weeks' | 'days'>,
	overflow: Overflow
): DateParts {
	const yearMonth = balanceYearMonth(date.year + duration.years, date.month + duration.months);
	const day = regulateDay(yearMonth.year, yearMonth.month, date.day, overflow);
	const days = duration.weeks * 7 + duration.days;
	if(days === 0) {
		return { year: yearMonth.year, month: yearMonth.month, day };
	}

	return dateFromEpochDays(daysFromEpoch(yearMonth.year, yearMonth.month, day) + days);
}

/**
 * Compare two dates.
 *
 * @param a
 * @param b
 */
export function compareDates(a: DateParts, b: DateParts): -1 | 0 | 1 {
	return compareInt(a.year, b.year)
		|| compareInt(a.month, b.month)
		|| compareInt(a.day, b.day);
}

/**
 * Get if adding years and months to `one`, without a change to the day, goes
 * past `two` in the direction of `sign`. This is `ISODateSurpasses` from the
 * `Temporal` specification, for a duration without weeks and days.
 */
function surpasses(sign: number, one: DateParts, two: DateParts, years: number, months: number) {
	const yearMonth = balanceYearMonth(one.year + years, one.month + months);
	const order = compareInt(yearMonth.year, two.year)
		|| compareInt(yearMonth.month, two.month)
		|| compareInt(one.day, two.day);

	return sign * order > 0;
}

/**
 * Get the difference from one date to another date, with `largestUnit` as
 * the largest unit. This is `CalendarDateUntil` from the `Temporal`
 * specification for the ISO 8601 calendar.
 *
 * @param one
 *   the start date
 * @param two
 *   the end date
 * @param largestUnit
 */
export function dateUntil(
	one: DateParts,
	two: DateParts,
	largestUnit: DateUnit
): Pick<DurationParts, 'years' | 'months' | 'weeks' | 'days'> {
	const sign = -compareDates(one, two);
	if(sign === 0) {
		return { years: 0, months: 0, weeks: 0, days: 0 };
	}

	let years = 0;
	if(largestUnit === 'years') {
		// Start one year before the difference in years, which never goes past
		// the end date, and then step forward.
		const difference = two.year - one.year;
		years = difference === 0 ? 0 : difference - sign;
		while(! surpasses(sign, one, two, years + sign, 0)) {
			years += sign;
		}
	}

	let months = 0;
	if(largestUnit === 'years' || largestUnit === 'months') {
		if(largestUnit === 'months') {
			const difference = (two.year - one.year) * 12 + (two.month - one.month);
			months = difference === 0 ? 0 : difference - sign;
		}

		while(! surpasses(sign, one, two, years, months + sign)) {
			months += sign;
		}
	}

	const intermediate = addToDate(one, { years, months, weeks: 0, days: 0 }, 'constrain');
	let days = epochDays(two) - epochDays(intermediate);
	let weeks = 0;
	if(largestUnit === 'weeks') {
		weeks = Math.trunc(days / 7);
		days -= weeks * 7;
	}

	return { years, months, weeks: weeks + 0, days: days + 0 };
}

/**
 * Get the number of milliseconds from midnight to a time.
 *
 * @param time
 */
export function timeToMilliseconds(time: TimeParts) {
	return time.hour * MILLISECONDS_PER_HOUR
		+ time.minute * MILLISECONDS_PER_MINUTE
		+ time.second * MILLISECONDS_PER_SECOND
		+ time.millisecond;
}

/**
 * Get the time for a number of milliseconds from midnight. The number must
 * be from 0 to the number of milliseconds in a day, minus one.
 *
 * @param milliseconds
 */
export function timeFromMilliseconds(milliseconds: number): TimeParts {
	return {
		hour: Math.floor(milliseconds / MILLISECONDS_PER_HOUR),
		minute: Math.floor(milliseconds / MILLISECONDS_PER_MINUTE) % 60,
		second: Math.floor(milliseconds / MILLISECONDS_PER_SECOND) % 60,
		millisecond: milliseconds % 1000
	};
}

/**
 * Get the number of milliseconds in the time fields of a duration.
 *
 * @param duration
 */
export function durationTimeToMilliseconds(
	duration: Pick<DurationParts, 'hours' | 'minutes' | 'seconds' | 'milliseconds'>
) {
	return duration.hours * MILLISECONDS_PER_HOUR
		+ duration.minutes * MILLISECONDS_PER_MINUTE
		+ duration.seconds * MILLISECONDS_PER_SECOND
		+ duration.milliseconds;
}

/**
 * Split a number of milliseconds into time fields, with `largestUnit` as the
 * largest field. All fields get the same sign as the number.
 *
 * @param milliseconds
 * @param largestUnit
 */
export function balanceTime(
	milliseconds: number,
	largestUnit: TimeUnit
): Pick<DurationParts, 'hours' | 'minutes' | 'seconds' | 'milliseconds'> {
	const sign = milliseconds < 0 ? -1 : 1;
	let rest = Math.abs(milliseconds);
	const result = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

	const sizes: [ TimeUnit, number ][] = [
		[ 'hours', MILLISECONDS_PER_HOUR ],
		[ 'minutes', MILLISECONDS_PER_MINUTE ],
		[ 'seconds', MILLISECONDS_PER_SECOND ],
		[ 'milliseconds', 1 ]
	];

	let started = false;
	for(const [ unit, size ] of sizes) {
		started = started || unit === largestUnit;
		if(! started) continue;

		const amount = Math.floor(rest / size);
		rest -= amount * size;
		// Add zero to change -0 into 0.
		result[unit] = sign * amount + 0;
	}

	return result;
}

/**
 * Throw a `TypeError` if an object has none of the given fields. `with()`
 * needs at least one field to change.
 *
 * @param object
 * @param fields
 */
export function assertHasSomeField(object: object, fields: readonly string[]) {
	if(typeof object !== 'object' || object === null) {
		throw new TypeError('with() needs an object with fields to change');
	}

	const record = object as Record<string, unknown>;
	if(! fields.some(field => record[field] !== undefined)) {
		throw new TypeError('with() needs at least one of the fields ' + fields.join(', '));
	}
}

/**
 * Get a value in a range. With `constrain`, a value out of the range becomes
 * the nearest value in the range. With `reject`, it throws a `RangeError`.
 *
 * @param value
 * @param name
 * @param min
 * @param max
 * @param overflow
 */
export function regulateInRange(
	value: number,
	name: string,
	min: number,
	max: number,
	overflow: Overflow
) {
	if(value >= min && value <= max) {
		return value;
	}

	if(overflow === 'reject') {
		throw new RangeError(name + ' must be between ' + min + ' and ' + max + ', got ' + value);
	}

	return Math.min(Math.max(value, min), max);
}

/**
 * The date units, from the largest to the smallest.
 */
export const DATE_UNITS: readonly DateUnit[] = [ 'years', 'months', 'weeks', 'days' ];

/**
 * The time units, from the largest to the smallest.
 */
export const TIME_UNITS: readonly TimeUnit[] = [ 'hours', 'minutes', 'seconds', 'milliseconds' ];

/**
 * Check the fields of a date for `with()`. A month or a day below 1 throws a
 * `RangeError`. A month or a day that is too large is changed or rejected as
 * `overflow` tells.
 *
 * @param fields
 * @param overflow
 */
export function regulateDate(
	fields: { year: unknown, month: unknown, day: unknown },
	overflow: Overflow
): DateParts {
	const year = assertInt(fields.year, 'year');
	const month = regulateInRange(assertPositive(fields.month, 'month'), 'month', 1, 12, overflow);
	const day = regulateDay(year, month, assertPositive(fields.day, 'day'), overflow);
	return { year, month, day };
}

/**
 * Check the fields of a time for `with()`. A field out of range is changed
 * or rejected as `overflow` tells.
 *
 * @param fields
 * @param overflow
 */
export function regulateTime(
	fields: { hour: unknown, minute: unknown, second: unknown, millisecond: unknown },
	overflow: Overflow
): TimeParts {
	return {
		hour: regulateInRange(assertInt(fields.hour, 'hour'), 'hour', 0, 23, overflow),
		minute: regulateInRange(assertInt(fields.minute, 'minute'), 'minute', 0, 59, overflow),
		second: regulateInRange(assertInt(fields.second, 'second'), 'second', 0, 59, overflow),
		millisecond: regulateInRange(
			assertInt(fields.millisecond, 'millisecond'), 'millisecond', 0, 999, overflow
		)
	};
}

function assertPositive(value: unknown, name: string) {
	const result = assertInt(value, name);
	if(result < 1) {
		throw new RangeError(name + ' must be 1 or more, got ' + result);
	}
	return result;
}
