import type { LocalDateLike, LocalDateTimeInput, LocalTimeLike } from './types/index.js';

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
	 * Get if this date and time equals another object with date and time
	 * properties.
	 *
	 * @param other
	 */
	public equals(other: (LocalDateLike & LocalTimeLike) | null | undefined) {
		if(! other) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this date and time with another object with date and time
	 * properties. The date is compared first and then the time.
	 *
	 * @param other
	 */
	public compare(other: LocalDateLike & LocalTimeLike) {
		const d = this.date.compare(other);
		if(d !== 0) return d;

		return this.time.compare(other);
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
	 *   the month, from 1 to 12
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
		month: number,
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
	 * Create a new local date time from a date and a time.
	 *
	 * @param date
	 * @param time
	 */
	public static fromDateAndTime(date: LocalDateLike, time: LocalTimeLike) {
		const localDate = date instanceof LocalDate ? date : LocalDate.from(date);
		const localTime = time instanceof LocalTime ? time : LocalTime.from(time);
		return new LocalDateTime(localDate, localTime);
	}

	/**
	 * Create a new local date time from the specified Date object.
	 *
	 * @param date
	 */
	public static fromDate(date: Date) {
		return this.fromDateAndTime(
			LocalDate.fromDate(date),
			LocalTime.fromDate(date)
		);
	}
}
