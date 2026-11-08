import type { LocalDateInput, LocalDateLike, LocalTimeInput } from './types/index.js';

import { assertInt } from './helpers/assertInt.js';

import { Month } from './Month.js';
import { zeroPadInt } from './helpers/zeroPadInt.js';
import { formatYear } from './helpers/formatYear.js';
import { compareInt } from './helpers/compareInt.js';
import { noValueOf } from './helpers/noValueOf.js';
import { parseDate } from './helpers/parse.js';
import { assertIsoCalendar } from './helpers/assertFields.js';
import {
	dayOfWeek,
	dayOfYear,
	daysInMonth,
	daysInYear,
	isLeapYear
} from './helpers/calendar.js';

import type { DayOfWeek } from './DayOfWeek.js';
import { LocalDateTime } from './LocalDateTime.js';

/**
 * Local date that represents just a date.
 */
export class LocalDate implements LocalDateLike {
	/**
	 * The year of the date.
	 */
	public readonly year: number;

	/**
	 * The month of the date.
	 */
	public readonly month: number;

	/**
	 * The day of the month.
	 */
	public readonly day: number;

	private constructor(year: number, month: number, day: number) {
		this.year = year;
		this.month = month;
		this.day = day;
	}

	/**
	 * The day of the week, from `DayOfWeek.MONDAY` (1) to `DayOfWeek.SUNDAY`
	 * (7).
	 */
	get dayOfWeek(): DayOfWeek {
		return dayOfWeek(this.year, this.month, this.day);
	}

	/**
	 * The day of the year, from 1 for 1 January.
	 */
	get dayOfYear() {
		return dayOfYear(this.year, this.month, this.day);
	}

	/**
	 * The number of days in the month of this date, from 28 to 31.
	 */
	get daysInMonth() {
		return daysInMonth(this.year, this.month);
	}

	/**
	 * The number of days in the year of this date, 365 or 366.
	 */
	get daysInYear() {
		return daysInYear(this.year);
	}

	/**
	 * If the year of this date is a leap year.
	 */
	get inLeapYear() {
		return isLeapYear(this.year);
	}

	/**
	 * Combine this date with a time. Without a time, the result is at
	 * midnight.
	 *
	 * @param time
	 *   the time, or a value that `LocalTime.from()` accepts
	 */
	public toLocalDateTime(time?: string | LocalTimeInput): LocalDateTime {
		return LocalDateTime.fromDateAndTime(this, time ?? {});
	}

	/**
	 * Get if this local date equals another local date like object.
	 *
	 * @param other
	 */
	public equals(other: LocalDateLike | null | undefined) {
		if(! other) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this local date with another local date like object.
	 *
	 * @param other
	 */
	public compare(other: LocalDateLike) {
		const y = compareInt(this.year, other.year);
		if(y !== 0) return y;

		const m = compareInt(this.month, other.month);
		if(m !== 0) return m;

		return compareInt(this.day, other.day);
	}

	/**
	 * Turn this object into a Date-object.
	 */
	public toDateAtMidnight() {
		const date = new Date(2000, 0, 1, 0, 0, 0, 0);
		// The Date constructor reads years 0 to 99 as 1900 to 1999, so set the
		// full year separately.
		date.setFullYear(this.year, this.month - 1, this.day);
		return date;
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
		return noValueOf('LocalDate');
	}

	/**
	 * Turn this date into an ISO 8601 string, such as `2024-03-01`. A year
	 * outside 0 to 9999 has six digits and a sign, such as `+020240-03-01`.
	 */
	public toString() {
		let result = formatYear(this.year);
		result += '-' + zeroPadInt(this.month, 2);
		result += '-' + zeroPadInt(this.day, 2);
		return result;
	}


	/**
	 * Create a local date using the given year, month and day. Will throw an
	 * error if the date is invalid.
	 *
	 * @param year
	 *   the year of the date
	 * @param month
	 *   the month of the date
	 * @param day
	 *   the day of the month
	 */
	public static of(
		year: number,
		month: Month | number,
		day: number
	): LocalDate {
		year = assertInt(year);

		if(month instanceof Month) {
			month = month.month;
		}
		month = assertInt(month);

		day = assertInt(day);

		if(month < 1 || month > 12) {
			throw new Error('month must be between 1 and 12');
		}

		const maxDay = daysInMonth(year, month);
		if(day < 1 || day > maxDay) {
			throw new Error('day must be between 1 and ' + maxDay);
		}

		return new LocalDate(year, month, day);
	}

	/**
	 * Create a local date from the given `Date` instance.
	 *
	 * @param date
	 */
	public static fromDate(date: Date): LocalDate {
		return this.of(
			date.getFullYear(),
			date.getMonth() + 1,
			date.getDate()
		);
	}

	/**
	 * Create a local date from an ISO 8601 string or from an object.
	 *
	 * The string can be in the form that `toString()` gives, such as
	 * `2024-03-01` or `+020240-03-01`.
	 *
	 * The object must have numeric `year`, `month` and `day` properties. This
	 * includes a `LocalDate`, a `LocalDateTime` and a `Temporal.PlainDate`.
	 * An object with a calendar other than `iso8601` gives an error.
	 *
	 * @param value
	 *   the string or the object
	 */
	public static from(value: string | LocalDateInput): LocalDate {
		if(typeof value === 'string') {
			const parts = parseDate(value);
			return LocalDate.of(parts.year, parts.month, parts.day);
		}

		if(value instanceof LocalDate) {
			return value;
		}

		assertIsoCalendar(value);
		return LocalDate.of(value.year, value.month, value.day);
	}

	/**
	 * Compare two dates. Returns `-1` if `a` is before `b`, `0` if they are
	 * equal and `1` if `a` is after `b`. Use it to sort dates, such as
	 * `dates.sort(LocalDate.compare)`.
	 *
	 * @param a
	 *   a date, or a value that `from()` accepts
	 * @param b
	 *   a date, or a value that `from()` accepts
	 */
	public static compare(a: string | LocalDateInput, b: string | LocalDateInput): -1 | 0 | 1 {
		return LocalDate.from(a).compare(LocalDate.from(b));
	}
}
