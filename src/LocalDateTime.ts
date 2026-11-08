import type { LocalDateInput, LocalDateLike, LocalDateTimeInput, LocalTimeInput, LocalTimeLike } from './types/index.js';

import type { DayOfWeek } from './DayOfWeek.js';
import type { Month } from './Month.js';
import { LocalTime } from './LocalTime.js';
import { LocalDate } from './LocalDate.js';
import { noValueOf } from './helpers/noValueOf.js';
import { parseDateTime } from './helpers/parse.js';
import { assertIsoCalendar, assertMillisecondPrecision } from './helpers/assertFields.js';

/**
 * Representation of a date and time without a timezone.
 */
export class LocalDateTime implements LocalDateLike, LocalTimeLike {
	private readonly date: LocalDate;
	private readonly time: LocalTime;

	private constructor(date: LocalDate, time: LocalTime) {
		this.date = date;
		this.time = time;
	}

	get year() {
		return this.date.year;
	}

	get month() {
		return this.date.month;
	}

	get day() {
		return this.date.day;
	}

	/**
	 * The day of the week, from `DayOfWeek.MONDAY` (1) to `DayOfWeek.SUNDAY`
	 * (7).
	 */
	get dayOfWeek(): DayOfWeek {
		return this.date.dayOfWeek;
	}

	/**
	 * The day of the year, from 1 for 1 January.
	 */
	get dayOfYear() {
		return this.date.dayOfYear;
	}

	/**
	 * The number of days in the month of this date, from 28 to 31.
	 */
	get daysInMonth() {
		return this.date.daysInMonth;
	}

	/**
	 * The number of days in the year of this date, 365 or 366.
	 */
	get daysInYear() {
		return this.date.daysInYear;
	}

	/**
	 * If the year of this date is a leap year.
	 */
	get inLeapYear() {
		return this.date.inLeapYear;
	}

	get hour() {
		return this.time.hour;
	}

	get minute() {
		return this.time.minute;
	}

	get second() {
		return this.time.second;
	}

	get millisecond() {
		return this.time.millisecond;
	}

	/**
	 * Get the date part of this date and time.
	 */
	public toLocalDate(): LocalDate {
		return this.date;
	}

	/**
	 * Get the time part of this date and time.
	 */
	public toLocalTime(): LocalTime {
		return this.time;
	}

	/**
	 * Get if this date and time equals another value. The other value can be anything
	 * that `from()` accepts. `null` and `undefined` give `false`.
	 *
	 * @param other
	 */
	public equals(other: string | LocalDateTimeInput | null | undefined): boolean {
		if(other === null || other === undefined) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this date and time with another value. The other value can be anything
	 * that `from()` accepts. Returns `-1` if this date and time comes first, `0` if
	 * they are equal and `1` if this date and time comes last.
	 * The date is compared first and then the time.
	 *
	 * @param other
	 */
	public compare(other: string | LocalDateTimeInput): -1 | 0 | 1 {
		const o = LocalDateTime.from(other);
		const d = this.date.compare(o.date);
		if(d !== 0) return d;

		return this.time.compare(o.time);
	}

	/**
	 * Turn this date and time into a `Date` in the local timezone of the
	 * system.
	 */
	public toDate(): Date {
		const date = this.date.toDateAtMidnight();
		date.setHours(this.hour, this.minute, this.second, this.millisecond);
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
		return noValueOf('LocalDateTime');
	}

	/**
	 * Turn this date and time into an ISO 8601 string, such as
	 * `2024-03-01T08:30:00`.
	 */
	public toString() {
		return this.date.toString() + 'T' + this.time.toString();
	}

	/**
	 * Create a local date and time. Will throw an error if a value is out of
	 * range.
	 *
	 * @param year
	 *   the year
	 * @param month
	 *   the month, from 1 to 12, or a `Month`
	 * @param day
	 *   the day of the month, from 1
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
		year: number,
		month: Month | number,
		day: number,
		hour: number = 0,
		minute: number = 0,
		second: number = 0,
		millisecond: number = 0
	): LocalDateTime {
		return new LocalDateTime(
			LocalDate.of(year, month, day),
			LocalTime.of(hour, minute, second, millisecond)
		);
	}

	/**
	 * Create a local date and time from an ISO 8601 string or from an
	 * object.
	 *
	 * The string can be in the form that `toString()` gives, such as
	 * `2024-03-01T08:30:00`. The seconds and the fraction are optional.
	 *
	 * The object must have numeric `year`, `month` and `day` properties, and
	 * can have numeric `hour`, `minute`, `second` and `millisecond`
	 * properties. A missing time property is zero. This includes a
	 * `LocalDateTime` and a `Temporal.PlainDateTime`.
	 *
	 * An object with a calendar other than `iso8601` gives an error. A time
	 * that is more precise than a millisecond gives an error.
	 *
	 * @param value
	 *   the string or the object
	 */
	public static from(value: string | LocalDateTimeInput): LocalDateTime {
		if(typeof value === 'string') {
			const parts = parseDateTime(value);
			return LocalDateTime.of(
				parts.year,
				parts.month,
				parts.day,
				parts.hour,
				parts.minute,
				parts.second,
				parts.millisecond
			);
		}

		if(value instanceof LocalDateTime) {
			return value;
		}

		assertIsoCalendar(value);
		assertMillisecondPrecision(value);
		return LocalDateTime.of(
			value.year,
			value.month,
			value.day,
			value.hour ?? 0,
			value.minute ?? 0,
			value.second ?? 0,
			value.millisecond ?? 0
		);
	}

	/**
	 * Compare two dates and times. Returns `-1` if `a` is before `b`, `0` if
	 * they are equal and `1` if `a` is after `b`. Use it to sort values, such
	 * as `values.sort(LocalDateTime.compare)`.
	 *
	 * @param a
	 *   a date and time, or a value that `from()` accepts
	 * @param b
	 *   a date and time, or a value that `from()` accepts
	 */
	public static compare(
		a: string | LocalDateTimeInput,
		b: string | LocalDateTimeInput
	): -1 | 0 | 1 {
		return LocalDateTime.from(a).compare(LocalDateTime.from(b));
	}

	/**
	 * Create a local date and time from a date and a time.
	 *
	 * @param date
	 *   the date, or a value that `LocalDate.from()` accepts
	 * @param time
	 *   the time, or a value that `LocalTime.from()` accepts
	 */
	public static fromDateAndTime(
		date: string | LocalDateInput,
		time: string | LocalTimeInput
	): LocalDateTime {
		return new LocalDateTime(LocalDate.from(date), LocalTime.from(time));
	}

	/**
	 * Get the current date and time in the local timezone of the system.
	 */
	public static now(): LocalDateTime {
		return LocalDateTime.fromDate(new Date());
	}

	/**
	 * Create a new local date time from the specified Date object.
	 *
	 * @param date
	 */
	public static fromDate(date: Date) {
		return LocalDateTime.fromDateAndTime(
			LocalDate.fromDate(date),
			LocalTime.fromDate(date)
		);
	}
}
