import type {
	DurationInput,
	LocalDateInput,
	LocalDateLike,
	LocalTimeInput,
	TemporalNamespace,
	TemporalPlainDate
} from './types/index.js';

import { temporalOf } from './helpers/temporal.js';
import { assertIntInRange, assertYear } from './helpers/assertInt.js';

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
import { YearMonth } from './YearMonth.js';

import { Duration } from './Duration.js';
import {
	addToDate,
	assertHasSomeField,
	DATE_UNITS,
	dateUntil,
	durationTimeToMilliseconds,
	largestUnitOf,
	MILLISECONDS_PER_DAY,
	overflowOf,
	regulateDate,
	truncDiv
} from './helpers/arithmetic.js';
import type { DateUnit, DifferenceOptions, OverflowOptions } from './types/index.js';

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
	 * Get the year and month of this date.
	 */
	public toYearMonth(): YearMonth {
		return YearMonth.of(this.year, this.month);
	}

	/**
	 * Get if this date equals another value. The other value can be anything
	 * that `from()` accepts. `null` and `undefined` give `false`.
	 *
	 * @param other
	 */
	public equals(other: string | LocalDateInput | null | undefined): boolean {
		if(other === null || other === undefined) return false;

		return this.compare(other) === 0;
	}

	/**
	 * Compare this date with another value. The other value can be anything
	 * that `from()` accepts. Returns `-1` if this date comes first, `0` if
	 * they are equal and `1` if this date comes last.
	 *
	 * Only the date is compared, so a `LocalDateTime` on the same date is
	 * equal to this date.
	 *
	 * @param other
	 */
	public compare(other: string | LocalDateInput): -1 | 0 | 1 {
		const o = LocalDate.from(other);

		const y = compareInt(this.year, o.year);
		if(y !== 0) return y;

		const m = compareInt(this.month, o.month);
		if(m !== 0) return m;

		return compareInt(this.day, o.day);
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
	 * Get a copy of this date with some fields changed, such as
	 * `date.with({ day: 1 })` for the first day of the month.
	 *
	 * A month after 12 becomes 12. A day after the last day of the month
	 * becomes the last day, unless `overflow` is `reject`.
	 *
	 * @param fields
	 *   the fields to change. At least one is necessary.
	 * @param options
	 */
	public with(fields: Partial<LocalDateLike>, options?: OverflowOptions): LocalDate {
		assertHasSomeField(fields, [ 'year', 'month', 'day' ]);
		const date = regulateDate({
			year: fields.year ?? this.year,
			month: fields.month ?? this.month,
			day: fields.day ?? this.day
		}, overflowOf(options));
		return LocalDate.of(date.year, date.month, date.day);
	}

	/**
	 * Add a duration to this date, such as `date.add({ months: 1 })`.
	 *
	 * The years and months are added first. If the day is not in the month
	 * that results, it becomes the last day of the month, unless `overflow`
	 * is `reject`. Then the weeks and days are added. Hours and smaller units
	 * are added as whole days, so 25 hours adds 1 day.
	 *
	 * @param duration
	 *   the duration, or a value that `Duration.from()` accepts
	 * @param options
	 */
	public add(duration: string | DurationInput, options?: OverflowOptions): LocalDate {
		const d = Duration.from(duration);
		const result = addToDate(this, {
			years: d.years,
			months: d.months,
			weeks: d.weeks,
			days: d.days + truncDiv(durationTimeToMilliseconds(d), MILLISECONDS_PER_DAY)
		}, overflowOf(options));
		return LocalDate.of(result.year, result.month, result.day);
	}

	/**
	 * Subtract a duration from this date. This is the same as adding the
	 * negated duration.
	 *
	 * @param duration
	 *   the duration, or a value that `Duration.from()` accepts
	 * @param options
	 */
	public subtract(duration: string | DurationInput, options?: OverflowOptions): LocalDate {
		return this.add(Duration.from(duration).negated(), options);
	}

	/**
	 * Get the duration from this date until another date. The result is
	 * negative if the other date is before this date.
	 *
	 * The result has days and no larger units, unless `largestUnit` is
	 * `years`, `months` or `weeks`. For example, from 2024-01-31 until
	 * 2024-03-01 is `P30D`, or `P1M1D` with `largestUnit: 'months'`.
	 *
	 * @param other
	 *   the other date, or a value that `from()` accepts
	 * @param options
	 */
	public until(other: string | LocalDateInput, options?: DifferenceOptions<DateUnit>): Duration {
		const unit = largestUnitOf(options, DATE_UNITS, 'days');
		return Duration.from(dateUntil(this, LocalDate.from(other), unit));
	}

	/**
	 * Get the duration from another date until this date. The result is
	 * negative if the other date is after this date. See `until()` for the
	 * options.
	 *
	 * @param other
	 *   the other date, or a value that `from()` accepts
	 * @param options
	 */
	public since(other: string | LocalDateInput, options?: DifferenceOptions<DateUnit>): Duration {
		return this.until(other, options).negated();
	}

	/**
	 * Convert this value into a `Temporal.PlainDate`.
	 *
	 * Without an argument this uses the global `Temporal`. Give the `Temporal`
	 * object of a polyfill where there is no global `Temporal`, such as in
	 * older browsers. Throws a `TypeError` if `Temporal` is not available.
	 *
	 * @param temporal
	 *   the `Temporal` object to use, such as the export of a polyfill
	 */
	public toTemporal(): TemporalPlainDate;
	public toTemporal<T extends TemporalNamespace<'PlainDate'>>(temporal: T): T['PlainDate']['prototype'];
	public toTemporal(temporal?: TemporalNamespace<'PlainDate'>): unknown {
		return temporalOf(temporal).PlainDate.from({ year: this.year, month: this.month, day: this.day });
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
	 *   the year of the date, from -271821 to 275760
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
		year = assertYear(year);

		if(month instanceof Month) {
			month = month.month;
		}
		month = assertIntInRange(month, 'month', 1, 12);
		day = assertIntInRange(day, 'day', 1, daysInMonth(year, month));

		return new LocalDate(year, month, day);
	}

	/**
	 * Create a local date from the given `Date` instance.
	 *
	 * @param date
	 */
	public static fromDate(date: Date): LocalDate {
		return LocalDate.of(
			date.getFullYear(),
			date.getMonth() + 1,
			date.getDate()
		);
	}

	/**
	 * Get the current date in the local timezone of the system.
	 */
	public static now(): LocalDate {
		return LocalDate.fromDate(new Date());
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
